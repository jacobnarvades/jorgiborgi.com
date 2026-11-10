// Static assets are served directly; only /media/* runs through here, to add
// HTTP Range support (Safari on iPhone/iPad will not play video without it).
export default {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);
    const range = request.headers.get('Range');
    if (!range || response.status !== 200 || request.method !== 'GET') {
      const headers = new Headers(response.headers);
      headers.set('Accept-Ranges', 'bytes');
      return new Response(response.body, { status: response.status, headers });
    }
    const body = await response.arrayBuffer();
    const size = body.byteLength;
    const match = /^bytes=(\d*)-(\d*)$/.exec(range.trim());
    let start, end;
    if (match && match[1] !== '') {
      start = Number(match[1]);
      end = match[2] !== '' ? Math.min(Number(match[2]), size - 1) : size - 1;
    } else if (match && match[2] !== '') {
      start = Math.max(0, size - Number(match[2]));  // suffix range: last N bytes
      end = size - 1;
    }
    if (start === undefined || start > end || start >= size) {
      return new Response(null, { status: 416, headers: { 'Content-Range': `bytes */${size}` } });
    }
    const headers = new Headers(response.headers);
    headers.set('Accept-Ranges', 'bytes');
    headers.set('Content-Range', `bytes ${start}-${end}/${size}`);
    headers.set('Content-Length', String(end - start + 1));
    return new Response(body.slice(start, end + 1), { status: 206, headers });
  },
};
