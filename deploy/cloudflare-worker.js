// Cloudflare Worker that exposes the HTTP-only backend over HTTPS.
// Deploy this worker, then set VITE_API_BASE_URL to its https:// URL
// (e.g. https://kulture-api.YOUR_SUBDOMAIN.workers.dev) and redeploy the app.
//
// The worker forwards every request to /api/* -> http://72.62.199.223/api/*
// and keeps the CORS/credentials behaviour the app relies on.

const BACKEND = 'http://72.62.199.223';

const HEADERS_TO_COPY = [
  'content-type',
  'content-disposition',
  'set-cookie',
  'cache-control',
  'etag',
  'last-modified',
];

export default {
  async fetch(request) {
    const url = new URL(request.url);

    // Only proxy /api and /files paths; everything else 404s.
    if (!url.pathname.startsWith('/api') && !url.pathname.startsWith('/files')) {
      return new Response('Not Found', { status: 404 });
    }

    // /files are static assets -> pass-through GET without body handling.
    if (url.pathname.startsWith('/files')) {
      const target = new URL(BACKEND + url.pathname + url.search);
      try {
        const upstream = await fetch(target, {
          method: request.method,
          headers: request.headers,
          redirect: 'follow',
        });
        const respHeaders = new Headers(upstream.headers);
        respHeaders.set('access-control-allow-origin', '*');
        return new Response(upstream.body, {
          status: upstream.status,
          headers: respHeaders,
        });
      } catch (err) {
        return new Response('Backend unreachable: ' + err.message, { status: 502 });
      }
    }

    const target = new URL(BACKEND + url.pathname + url.search);

    const headers = new Headers();
    // Forward the browser's cookies so the session/CSRF still works.
    const cookie = request.headers.get('cookie');
    if (cookie) headers.set('cookie', cookie);
    headers.set('accept', 'application/json');
    headers.set('content-type', 'application/json');

    const init = {
      method: request.method,
      headers,
      redirect: 'follow',
      body: ['GET', 'HEAD'].includes(request.method) ? undefined : request.body,
    };

    let upstream;
    try {
      upstream = await fetch(target, init);
    } catch (err) {
      return new Response('Backend unreachable: ' + err.message, { status: 502 });
    }

    const respHeaders = new Headers();
    for (const name of HEADERS_TO_COPY) {
      if (upstream.headers.has(name)) {
        respHeaders.set(name, upstream.headers.get(name));
      }
    }
    // Allow the browser app (any origin, incl. GitHub Pages) to call this worker.
    respHeaders.set('access-control-allow-origin', '*');
    respHeaders.set('access-control-allow-credentials', 'true');
    respHeaders.set(
      'access-control-expose-headers',
      'set-cookie, content-type, content-disposition'
    );
    respHeaders.set('vary', 'Origin');

    if (request.method === 'OPTIONS') {
      respHeaders.set('access-control-allow-methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
      respHeaders.set('access-control-allow-headers', 'content-type, x-frappe-csrf-token, accept');
      return new Response(null, { status: 204, headers: respHeaders });
    }

    return new Response(upstream.body, {
      status: upstream.status,
      headers: respHeaders,
    });
  },
};