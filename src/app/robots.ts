import type { MetadataRoute } from "next";
import { abs } from "@/lib/seo";

export default function robots(): MetadataRoute.Robots {
  return {
    // /go è il redirect affiliato: non va indicizzato né seguito dai crawler
    rules: { userAgent: "*", allow: "/", disallow: ["/admin", "/go/", "/api/"] },
    sitemap: abs("/sitemap.xml"),
  };
}
