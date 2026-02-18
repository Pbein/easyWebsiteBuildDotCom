import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/dev/", "/demo/preview/render"],
      },
    ],
    sitemap: "https://easywebsitebuild.com/sitemap.xml",
  };
}
