import type { MetadataRoute } from "next";
import { getSiteOrigin } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: getSiteOrigin(),
      changeFrequency: "daily",
      priority: 1,
    },
  ];
}
