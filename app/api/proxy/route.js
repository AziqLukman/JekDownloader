import path from "path";
import util from "util";
import fs from "fs";
import os from "os";
import { spawn, execFile } from "child_process";

const execFileAsync = util.promisify(execFile);

const getBinPath = () => path.join(process.cwd(), 'node_modules', 'youtube-dl-exec', 'bin', 'yt-dlp.exe');

// Detect CDN source from URL
const getReferer = (url) => {
  if (!url) return 'https://www.tiktok.com/';
  if (url.includes('tiktokcdn') || url.includes('tiktok')) return 'https://www.tiktok.com/';
  if (url.includes('googlevideo') || url.includes('youtube')) return 'https://www.youtube.com/';
  if (url.includes('instagram') || url.includes('cdninstagram')) return 'https://www.instagram.com/';
  if (url.includes('facebook') || url.includes('fbcdn')) return 'https://www.facebook.com/';
  if (url.includes('twitter.com') || url.includes('x.com') || url.includes('twimg.com')) return 'https://x.com/';
  try { return new URL(url).origin + '/'; } catch { return 'https://www.google.com/'; }
};

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const originalUrl = searchParams.get("originalUrl");
  const directUrl = searchParams.get("url");
  const mode = searchParams.get("mode") || "download";
  const requestedRes = searchParams.get("res");
  const downloadType = searchParams.get("type") || "video"; // video | audio | image
  const downloadToken = searchParams.get("token"); // For tracking
  let filename = searchParams.get("name") || "video";

  filename = filename.replace(/\.(mp3|mp4|webp|jpg|png|jpeg|m4a|aac)$/i, '');
  filename = filename.replace(/[^a-z0-9]/gi, '_').substring(0, 80) || "video";

  // === IMAGE DOWNLOAD: langsung fetch thumbnail URL ===
  if (downloadType === 'image' && directUrl) {
    console.log('[Proxy] Image download for:', directUrl.substring(0, 80));
    try {
      const referer = getReferer(directUrl);
      const imgRes = await fetch(directUrl, {
        headers: { 
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Referer': referer,
          'Origin': referer.replace(/\/$/, '')
        },
        signal: AbortSignal.timeout(15000)
      });
      if (!imgRes.ok) throw new Error(`HTTP ${imgRes.status}`);
      const contentType = imgRes.headers.get('content-type') || 'image/jpeg';
      const ext = contentType.includes('png') ? 'png' : contentType.includes('webp') ? 'webp' : 'jpg';
      const headers = new Headers();
      headers.set('Content-Disposition', `attachment; filename="${filename}.${ext}"`);
      headers.set('Content-Type', contentType);
      const cl = imgRes.headers.get('content-length');
      if (cl) headers.set('Content-Length', cl);
      console.log(`[Proxy] Image SUCCESS: ${filename}.${ext}`);
      return new Response(imgRes.body, { status: 200, headers });
    } catch (e) {
      console.error('[Proxy] Image download failed:', e.message);
      const headers = new Headers();
      headers.set('Content-Type', 'text/html');
      if (downloadToken) {
        headers.set('Set-Cookie', `download_token=${downloadToken}; Path=/; Max-Age=60`);
      }
      return new Response(`<script>window.parent.alert("Waduh, gagal download gambar ini bang. Coba lagi nanti ya!");</script>`, { 
        status: 200, 
        headers
      });
    }
  }

  // === AUDIO DOWNLOAD: pakai yt-dlp extract audio ===
  if (downloadType === 'audio') {
    const urlToDownload = originalUrl || directUrl;
    if (!urlToDownload) return new Response('URL is required', { status: 400 });
    console.log('[Proxy] Audio download for:', urlToDownload.substring(0, 80));

    // --- Fast Path: Jika URL sudah berupa link audio langsung (.mp3, .m4a, query audio, dll) ---
    const fastPathUrl = directUrl || originalUrl;
    const isDirectAudio = fastPathUrl.match(/\.(mp3|m4a|wav|aac|ogg|opus|m4b|flac)(\?|$)/i) || 
                          fastPathUrl.includes('music') || 
                          fastPathUrl.includes('tiktokcdn') ||
                          fastPathUrl.includes('.googlevideo.com/videoplayback?');

    if (isDirectAudio) {
      console.log('[Proxy] Audio Fast Path triggered (Direct Fetch)');
      try {
        const referer = getReferer(fastPathUrl);
        const res = await fetch(fastPathUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
            'Referer': referer
          },
          signal: AbortSignal.timeout(30000)
        });

        if (res.ok) {
          const cl = parseInt(res.headers.get('content-length') || '0');
          // Validasi ukuran, kalau 0 byte atau terlalu kecil (kemungkinan link expired/403 hidden), lempar ke fallback
          if (cl > 5000) {
            const headers = new Headers();
            headers.set('Content-Disposition', `attachment; filename="${filename}.mp3"`);
            headers.set('Content-Type', res.headers.get('content-type') || 'audio/mpeg');
            headers.set('Content-Length', cl.toString());
            if (downloadToken) {
              headers.set('Set-Cookie', `download_token=${downloadToken}; Path=/; Max-Age=60`);
            }
            console.log(`[Proxy] Audio Fast Path SUCCESS: ${filename}.mp3 (Size: ${cl} bytes)`);
            return new Response(res.body, { status: 200, headers });
          } else {
             console.warn(`[Proxy] Audio Fast Path returned 200 OK tapi ukuran 0b / terlalu kecil (${cl} bytes). Fallback ke yt-dlp...`);
          }
        } else {
          console.warn(`[Proxy] Audio Fast Path failed (Status: ${res.status}), falling back to yt-dlp`);
        }
      } catch (e) {
        console.warn('[Proxy] Audio Fast Path error:', e.message, ', falling back to yt-dlp');
      }
    }

    try {
      const binPath = getBinPath();
      const ffmpegPathReal = process.platform === 'win32'
        ? path.join(process.cwd(), 'node_modules', 'ffmpeg-static', 'ffmpeg.exe')
        : path.join(process.cwd(), 'node_modules', 'ffmpeg-static', 'ffmpeg');

      // Step 1: Ambil URL stream langsung pake yt-dlp -g
      console.log('[Proxy] Audio Turbo: Getting direct stream URL...');
      const { stdout: streamUrlRaw } = await execFileAsync(binPath, [
        '-g', 
        '--no-check-certificates',
        '--user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        urlToDownload
      ]);
      const streamUrl = streamUrlRaw.trim();

      if (!streamUrl) throw new Error('Could not get stream URL');

      // Step 2: Gunakan FFmpeg untuk stream & transcode langsung ke user
      const ffmpegArgs = [
        '-i', streamUrl,
        '-vn', // No video
        '-acodec', 'libmp3lame',
        '-ab', '128k',
        '-f', 'mp3',
        '-map', '0:a:0',
        'pipe:1'
      ];

      console.log('[Proxy] Audio Turbo Stream (FFmpeg) firing...');
      const child = spawn(ffmpegPathReal, ffmpegArgs);
      
      const stream = new ReadableStream({
        start(controller) {
          child.stdout.on('data', (chunk) => controller.enqueue(chunk));
          child.stdout.on('end', () => controller.close());
          child.on('error', (err) => controller.error(err));
          child.stderr.on('data', (data) => {
            // FFmpeg logs to stderr, quiet down unless needed
          });
        },
        cancel() {
          child.kill();
        }
      });

      const headers = new Headers();
      headers.set('Content-Disposition', `attachment; filename="${filename}.mp3"`);
      headers.set('Content-Type', 'audio/mpeg');
      if (downloadToken) {
        headers.set('Set-Cookie', `download_token=${downloadToken}; Path=/; Max-Age=60`);
      }

      console.log(`[Proxy] Audio Turbo SUCCESS: ${filename}.mp3 (FFmpeg Stream)`);
      return new Response(stream, { status: 200, headers });
    } catch (e) {
      console.error('[Proxy] Audio Turbo Error:', e.message);
      // Fallback: Return HTML script to show alert instead of downloading a corrupt file
      const headers = new Headers();
      headers.set('Content-Type', 'text/html');
      if (downloadToken) {
        headers.set('Set-Cookie', `download_token=${downloadToken}; Path=/; Max-Age=60`);
      }
      return new Response(`<script>window.parent.alert("Waduh, server sumber ngeblokir download audio ini bang. Coba download Videonya aja ya!");</script>`, { 
        status: 200, 
        headers
      });
    }
  }

  const isTikTok = (directUrl || originalUrl || '').includes('tiktok') ||
    (directUrl || '').includes('tiktokcdn') ||
    (directUrl || '').includes('muscdn');

  // === Strategy 1: Direct proxy fetch (untuk TikTok CDN atau Non-YouTube) ===
  const referer = getReferer(directUrl);
  const isLikelyTikTok = isTikTok || (directUrl && (directUrl.includes('tiktokcdn') || directUrl.includes('muscdn')));

  // Skip Strategy 1 jika user request resolusi spesifik, biar yt-dlp yang handle di Strategy 2
  if (directUrl && (!requestedRes || requestedRes === 'auto')) {
    console.log(`[Proxy] Trying Strategy 1 (Direct Fetch) for: ${isLikelyTikTok ? 'TikTok' : 'Other'}`);
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 20000);

      const fetchOptions = {
        signal: controller.signal,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          'Accept': '*/*',
          'Accept-Language': 'en-US,en;q=0.9',
          'Referer': referer,
          'Origin': referer.replace(/\/$/, ''),
          'Range': 'bytes=0-',
        }
      };

      let response = await fetch(directUrl, fetchOptions);
      clearTimeout(timeoutId);

      // --- AUTO-REPAIR LOGIC FOR TIKTOK ---
      // Jika 403 atau Content-Length mencurigakan (biasanya < 1000 byte untuk video)
      const cl = parseInt(response.headers.get('content-length') || '0');
      if (isLikelyTikTok && (!response.ok || response.status === 403 || cl < 10000)) {
        console.warn(`[Proxy] Link 403 atau korup (CL: ${cl}), attempting Auto-Repair extraction...`);
        if (originalUrl) {
          try {
            // Re-extract fresh link internally
            const protocol = request.headers.get('x-forwarded-proto') || 'http';
            const host = request.headers.get('host');
            const extractUrl = `${protocol}://${host}/api/extract`;
            
            const repairRes = await fetch(extractUrl, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ url: originalUrl })
            });

            if (repairRes.ok) {
              const freshData = await repairRes.json();
              if (freshData.url && freshData.url !== directUrl) {
                console.log("[Proxy] Auto-Repair SUCCESS, trying fresh link...");
                response = await fetch(freshData.url, fetchOptions);
              }
            }
          } catch (repairErr) {
            console.error("[Proxy] Auto-Repair failed:", repairErr.message);
          }
        }
      }

      if (!response.ok) {
        console.error(`[Proxy] FINAL ERROR: Status ${response.status}`);
        throw new Error(`HTTP ${response.status}`);
      }

      const headers = new Headers();
      if (mode !== 'stream') {
        headers.set("Content-Disposition", `attachment; filename="${filename}.mp4"`);
      }
      headers.set("Content-Type", response.headers.get('content-type') || "video/mp4");
      const finalCl = response.headers.get('content-length');
      if (finalCl) headers.set("Content-Length", finalCl);
      headers.set("Accept-Ranges", "bytes");
      headers.set("Cache-Control", "public, max-age=3600");
      
      if (downloadToken) {
        headers.set('Set-Cookie', `download_token=${downloadToken}; Path=/; Max-Age=60`);
      }

      console.log(`[Proxy] Strategy 1 SUCCESS: ${filename}.mp4`);
      return new Response(response.body, { status: 200, headers });

    } catch (e) {
      console.warn("[Proxy] Strategy 1 failed, moving to Strategy 2");
    }
  }

  // === Strategy 2: yt-dlp download (Fallback atau untuk YouTube) ===
  const urlToDownload = originalUrl || directUrl;
  if (urlToDownload) {
    console.log("[Proxy] Strategy 2 (yt-dlp) start for:", urlToDownload.substring(0, 70));
    try {
      const binPath = getBinPath();
      const tmpDir = path.join(os.tmpdir(), 'jekdownloader');
      if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

      const outputPath = path.join(tmpDir, `${filename}_${Date.now()}.mp4`);

      const ffmpegPathReal = process.platform === "win32"
        ? path.join(process.cwd(), 'node_modules', 'ffmpeg-static', 'ffmpeg.exe')
        : path.join(process.cwd(), 'node_modules', 'ffmpeg-static', 'ffmpeg');

      const ytdlpArgs = [
        '-o', outputPath,
        '--no-check-certificates',
        '--no-warnings',
        '--ffmpeg-location', ffmpegPathReal,
        '--merge-output-format', 'mp4',
        '--user-agent', 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
      ];

      // Format sortir resolusi jika user request selain Auto
      if (requestedRes && requestedRes !== 'auto') {
        ytdlpArgs.push('-S', `res:${requestedRes}`);
      }
      ytdlpArgs.push(urlToDownload);

      console.log("[Proxy] Executing yt-dlp with args:", ytdlpArgs.join(" "));

      await execFileAsync(binPath, ytdlpArgs, { timeout: 600000, maxBuffer: 1024 * 1024 * 10 });

      if (!fs.existsSync(outputPath)) throw new Error("File not found after download");

      const stat = fs.statSync(outputPath);
      const fileStream = fs.createReadStream(outputPath);
      fileStream.on('close', () => { try { fs.unlinkSync(outputPath); } catch { } });

      const headers = new Headers();
      if (mode !== 'stream') {
        headers.set("Content-Disposition", `attachment; filename="${filename}.mp4"`);
      }
      headers.set("Content-Type", "video/mp4");
      headers.set("Content-Length", String(stat.size));
      headers.set("Accept-Ranges", "bytes");
      
      if (downloadToken) {
        headers.set('Set-Cookie', `download_token=${downloadToken}; Path=/; Max-Age=60`);
      }

      const webStream = new ReadableStream({
        start(controller) {
          fileStream.on('data', chunk => controller.enqueue(chunk));
          fileStream.on('end', () => controller.close());
          fileStream.on('error', err => controller.error(err));
        }
      });

      console.log(`[Proxy] Strategy 2 SUCCESS: ${filename}.mp4`);
      return new Response(webStream, { status: 200, headers });

    } catch (err) {
      console.error("[Proxy] Strategy 2 ERROR:", err.message?.substring(0, 100));
      const headers = new Headers();
      headers.set('Content-Type', 'text/html');
      if (downloadToken) {
        headers.set('Set-Cookie', `download_token=${downloadToken}; Path=/; Max-Age=60`);
      }
      return new Response(`<script>window.parent.alert("Waduh, server sumber ngeblokir download video ini bang. Coba lagi nanti ya!");</script>`, { 
        status: 200, 
        headers
      });
    }
  }

  return new Response("URL is required", { status: 400 });
}