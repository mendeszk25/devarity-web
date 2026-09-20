const LEGACY_HOST = "devarity-web.devarity-web.workers.dev";
const CANONICAL_ORIGIN = "https://devarity.com.br";
const PREVIEW_SITES = {
  taiane: "https://taianealmeida.com.br/",
  fr: "https://fr-usinagens.vercel.app/",
};

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

    // Fixed destinations only: this is a framing-policy check, never an open proxy.
    if (url.pathname === "/api/project-preview") {
      const destination = PREVIEW_SITES[url.searchParams.get("id")];
      if (!Object.hasOwn(PREVIEW_SITES, url.searchParams.get("id"))) {
        return Response.json({ allowed: false }, { status: 404 });
      }
      let allowed = false;
      try {
        const response = await fetch(destination, { redirect: "error", signal: AbortSignal.timeout(7000) });
        // Conservatively keep the screenshot for any declared framing restriction.
        allowed = response.ok &&
          (response.headers.get("content-type") || "").includes("text/html") &&
          !response.headers.has("x-frame-options") &&
          !/\bframe-ancestors\b/i.test(response.headers.get("content-security-policy") || "");
        await response.body?.cancel();
      } catch {
        // A timeout, redirect or unavailable site retains the static preview.
      }
      return Response.json({ allowed }, { headers: { "Cache-Control": "no-store" } });
    }

    // New official domain: serve the site's static files normally.
    return env.ASSETS.fetch(request);
  },
};
