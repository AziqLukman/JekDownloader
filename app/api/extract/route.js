import { NextResponse } from "next/server";
import { execFile } from "child_process";
import path from "path";
import util from "util";

const execFileAsync = util.promisify(execFile);

const getBinPath = () => path.join(process.cwd(), 'node_modules', 'youtube-dl-exec', 'bin', 'yt-dlp.exe');

// Simple in-memory cache to speed up repeated extracts
const extractionCache = new Map();
const CACHE_TTL = 300000; // 5 minutes

function getCached(url) {
  const cached = extractionCache.get(url);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  return null;
}

function setCache(url, data) {
  extractionCache.set(url, { data, timestamp: Date.now() });
  // Cleanup occasionally
  if (extractionCache.size > 100) {
    const it = extractionCache.keys();
    extractionCache.delete(it.next().value);
  }
}

async function resolveUrl(url) {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);
    const res = await fetch(url, {
      method: 'HEAD',
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1'
      }
    });
    clearTimeout(timeoutId);
    return res.url || url;
  } catch {
    return url;
  }
}

// Validasi URL beneran video (bukan audio-only)
function isLikelyVideo(url) {
  if (!url) return false;
  const lower = url.toLowerCase();
  // Reject kalau jelas audio only
  if (lower.includes('audio') && !lower.includes('video')) return false;
  if (lower.includes('.mp3') || lower.includes('.m4a') || lower.includes('.aac') || lower.includes('.ogg')) return false;
  return true;
}

// Ambil title terbaik dari berbagai source, JANGAN hardcode "TikTok Video"
function getBestTitle(candidates, fallbackUrl) {
  for (const t of candidates) {
    if (t && typeof t === 'string' && t.trim().length > 0) {
      const cleaned = t.trim();
      // Skip title yang generik/kosong
      if (cleaned === 'TikTok Video') continue;
      if (cleaned === 'Video') continue;
      if (cleaned === 'Untitled') continue;
      return cleaned;
    }
  }
  // Fallback: ambil dari URL kalau ada video ID
  try {
    const match = fallbackUrl?.match(/video\/(\d+)/);
    if (match) return `tiktok_${match[1]}`;
  } catch { }
  return "video"; // minimal fallback
}

// === JekEngine Internal Scraper: TikTok ===
async function internalTikTokScraper(url) {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9'
      },
      signal: AbortSignal.timeout(10000)
    });
    const html = await res.text();
    
    // Cari __UNIVERSAL_DATA_FOR_REA_T7_CLIENT__ (data JSON TikTok modern)
    const jsonMatch = html.match(/<script id="__UNIVERSAL_DATA_FOR_REA_T7_CLIENT__" type="application\/json">([\s\S]*?)<\/script>/);
    if (jsonMatch) {
      const allData = JSON.parse(jsonMatch[1]);
      const videoData = allData?.["webapp.video-detail"]?.itemInfo?.itemStruct || allData?.default?.["webapp.video-detail"]?.itemInfo?.itemStruct;
      
      if (videoData) {
        return {
          title: videoData.desc || "TikTok Video",
          thumbnail: videoData.video?.cover || "",
          url: videoData.video?.downloadAddr || videoData.video?.playAddr,
          audio: videoData.music?.playUrl,
          images: videoData.imagePost?.images?.map(img => img.imageURL?.obj_node?.url_list?.[0]) || []
        };
      }
    }
  } catch (e) { console.error("[JekEngine] TikTok Scrape failed:", e.message); }
  return null;
}

// === JekEngine Internal Scraper: Instagram ===
async function internalInstagramScraper(url) {
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      },
      signal: AbortSignal.timeout(10000)
    });
    const html = await res.text();
    
    // Ambil dari Meta Tags (OpenGraph) - Cara paling "Internal" & Cepet
    const videoMatch = html.match(/<meta property="og:video" content="(.*?)"/);
    const imageMatch = html.match(/<meta property="og:image" content="(.*?)"/);
    const titleMatch = html.match(/<meta property="og:title" content="(.*?)"/);
    
    if (videoMatch || imageMatch) {
      return {
        title: titleMatch ? titleMatch[1] : "Instagram Post",
        thumbnail: imageMatch ? imageMatch[1] : "",
        url: videoMatch ? videoMatch[1] : imageMatch ? imageMatch[1] : "",
        images: imageMatch ? [imageMatch[1]] : [],
        audio: videoMatch ? videoMatch[1] : undefined
      };
    }
  } catch (e) { console.error("[JekEngine] IG Scrape failed:", e.message); }
  return null;
}

export async function POST(request) {
  try {
    const { url } = await request.json();
    if (!url) return NextResponse.json({ error: "URL is required" }, { status: 400 });

    // 1. Check Cache
    const cachedResult = getCached(url);
    if (cachedResult) {
      console.log("[Extract] Serving from cache:", url.substring(0, 50));
      return NextResponse.json(cachedResult);
    }

    const isTikTok = url.includes('tiktok.com') || url.includes('vt.tiktok');
    const isInstagram = url.includes('instagram.com');
    const isX = url.includes('x.com') || url.includes('twitter.com');

    // 2. JekEngine: Internal Extraction for Social Media
    if (isTikTok || isInstagram || isX) {
      console.log(`[JekEngine] Internal extraction for ${isTikTok ? 'TikTok' : isInstagram ? 'Instagram' : 'X/Twitter'}...`);
      const resolvedUrl = await resolveUrl(url);

      // --- TIKTOK INTERNAL ---
      if (isTikTok) {
        const data = await internalTikTokScraper(resolvedUrl);
        if (data && data.url) {
          const res = { ...data, originalUrl: resolvedUrl, sourceUrl: url };
          setCache(url, res);
          return NextResponse.json(res);
        }
      }

      // --- INSTAGRAM INTERNAL ---
      if (isInstagram) {
        const data = await internalInstagramScraper(resolvedUrl);
        if (data && data.url) {
          const res = { ...data, originalUrl: resolvedUrl, sourceUrl: url };
          setCache(url, res);
          return NextResponse.json(res);
        }
      }

      // --- FALLBACK 1: TikWM (Universal Fallback) ---
      try {
        console.log("[Extract] Fallback: TikWM...");
        const tikwmRes = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(resolvedUrl)}`, {
          signal: AbortSignal.timeout(10000)
        });
        const tikwmData = await tikwmRes.json();
        if (tikwmData?.data) {
          const d = tikwmData.data;
          const result = {
            title: d.title || "Social Media Post",
            thumbnail: d.cover || d.origin_cover,
            url: d.play || d.hdplay || d.images?.[0] || d.url,
            images: d.images || [],
            originalUrl: resolvedUrl,
            sourceUrl: url,
            audio: d.music || d.music_info?.play_url
          };
          setCache(url, result);
          return NextResponse.json(result);
        }
      } catch (e) { console.warn("[Extract] TikWM fallback failed"); }

      // --- FALLBACK 2: yt-dlp (Strong Fallback) ---
      try {
        console.log("[Extract] Fallback: yt-dlp...");
        const binPath = getBinPath();
        const { stdout } = await execFileAsync(binPath, [
          '--dump-json',
          '--no-check-certificates',
          '--no-warnings',
          '--user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
          resolvedUrl
        ], { timeout: 30000 });

        const data = JSON.parse(stdout);
        const images = data.entries?.map(e => e.url) || [];
        const result = {
          title: data.title || "Media",
          thumbnail: data.thumbnail || images[0],
          url: data.url || (data.formats && data.formats[0]?.url),
          images: images,
          originalUrl: resolvedUrl,
          sourceUrl: url,
          audio: data.url
        };
        setCache(url, result);
        return NextResponse.json(result);
      } catch (e) { console.warn("[Extract] yt-dlp fallback failed"); }

      throw new Error(`Waduh, gagal narik data dari ${isTikTok ? 'TikTok' : isInstagram ? 'Instagram' : 'X/Twitter'} 😭\nCoba link lain bang.`);
    }

    // --- OTHER PLATFORMS (YouTube, etc.) ---
    console.log("[Extract] General platform, using yt-dlp...");
    const binPath = getBinPath();
    const { stdout } = await execFileAsync(binPath, [
      '--dump-json',
      '--no-check-certificates',
      '--no-warnings',
      '--user-agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
      url
    ], { timeout: 30000 });

    const data = JSON.parse(stdout);
    const result = {
      title: data.title || "Video",
      thumbnail: data.thumbnail || "",
      url: data.url || (data.formats && data.formats.find(f => f.vcodec !== 'none' && f.acodec !== 'none')?.url) || data.formats?.[0]?.url,
      originalUrl: url,
      sourceUrl: url,
      audio: data.url
    };
    setCache(url, result);
    return NextResponse.json(result);

  } catch (error) {
    console.error("[Extract] Final error:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}