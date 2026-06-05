import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://buleleng-mall-dev.vercel.app";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin/", // Keep search engines out of your admin dashboard
        "/*?*sort=", // Prevent indexing infinite sorting variations
        "/*?*filter=", // Prevent indexing infinite filtering variations
      ],
    },
    // Point search engines directly to your sitemap so they find products faster
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
