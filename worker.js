const LEGACY_HOST = "devarity-web.devarity-web.workers.dev";
const CANONICAL_ORIGIN = "https://devarity.com.br";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Keep the old workers.dev address alive only as a permanent redirect.
    // Path and query string are preserved for Google and existing links.
    if (url.hostname === LEGACY_HOST) {
      // Concatenate the fixed origin so even paths beginning with // stay local.
      const destination = `${CANONICAL_ORIGIN}${url.pathname}${url.search}`;

      return Response.redirect(destination, 301);
    }

    // New official domain: serve the site's static files normally.
    return env.ASSETS.fetch(request);
  },
};
