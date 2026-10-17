import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  headers() {
    return [
      {
        // A password reset link carries its token in the query string until
        // the page takes it out, so no request made from the page may pass
        // the address on in a Referer header. This has to be a response
        // header: a <meta> tag comes too late for the page's own scripts,
        // styles and fonts, which are requested before it is read.
        source: "/reset-password",
        headers: [{ key: "Referrer-Policy", value: "no-referrer" }],
      },
      {
        // An email verification link carries its token the same way.
        source: "/verify-email",
        headers: [{ key: "Referrer-Policy", value: "no-referrer" }],
      },
    ];
  },
};

export default nextConfig;
