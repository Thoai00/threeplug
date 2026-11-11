import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Silence the "border" / "borderColor" shorthand React 19 warning
     that may still surface from third-party libs in dev mode. */
  reactStrictMode: true,

  /* Compress HTML/JS for smaller Vercel bundles */
  compress: true,

  /* Allow local images in /public — no remote patterns needed */
  images: {
    formats: ["image/avif", "image/webp"],
  },

  /* Remove X-Powered-By header */
  poweredByHeader: false,

  /* Route changes run through React's <ViewTransition> (see
     app/fx/PageTransition.tsx). Browsers without the View Transitions API
     simply navigate without the animation. */
  experimental: {
    viewTransition: true,
  },
};

export default nextConfig;
