export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get("url");
  if (!url) return new Response("URL required", { status: 400 });

  try {
    const isTikTok = url.includes("tiktok") || url.includes("muscdn") || url.includes("tiktokcdn");
    const response = await fetch(url, {
      headers: {
        "User-Agent": isTikTok
          ? "Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1"
          : "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        "Referer": isTikTok ? "https://www.tiktok.com/" : "https://www.google.com/",
        "Accept": "image/*,*/*",
      },
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const contentType = response.headers.get("content-type") || "image/jpeg";
    const headers = new Headers();
    headers.set("Content-Type", contentType);
    headers.set("Cache-Control", "public, max-age=86400");

    return new Response(response.body, { status: 200, headers });
  } catch (e) {
    // Return 1x1 transparent gif as fallback
    const pixel = Buffer.from("R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7", "base64");
    return new Response(pixel, {
      status: 200,
      headers: { "Content-Type": "image/gif", "Cache-Control": "public, max-age=3600" }
    });
  }
}
