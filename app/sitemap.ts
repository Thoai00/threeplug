import type { MetadataRoute } from "next";
import { CASES } from "./work/cases";
import { SITE_URL } from "./seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: SITE_URL, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/work`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    ...CASES.map((c) => ({
      url: `${SITE_URL}/work/${c.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
