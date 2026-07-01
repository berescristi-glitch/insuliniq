import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

const BASE = process.env.NEXT_PUBLIC_APP_URL ?? "https://insuliniq.com";

const STATIC_ROUTES: MetadataRoute.Sitemap = [
  { url: BASE, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
  { url: `${BASE}/learn`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
  { url: `${BASE}/pricing`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  { url: `${BASE}/quiz`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  // Condition hubs
  { url: `${BASE}/pcos`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
  { url: `${BASE}/prediabetes`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
  { url: `${BASE}/nafld`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
  { url: `${BASE}/obesity`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
  // Static MDX articles
  { url: `${BASE}/learn/what-is-insulin-resistance`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  { url: `${BASE}/learn/metabolic-syndrome`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
  { url: `${BASE}/learn/microbiome`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  { url: `${BASE}/learn/nutrition`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
  // Legal
  { url: `${BASE}/legal/disclaimer`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  { url: `${BASE}/legal/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  { url: `${BASE}/legal/terms`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    const supabase = await createClient();
    const { data } = await supabase
      .from("articles")
      .select("slug, updated_at")
      .eq("published", true);

    const cmsRoutes: MetadataRoute.Sitemap = (data ?? []).map((a) => ({
      url: `${BASE}/learn/${a.slug}`,
      lastModified: a.updated_at ? new Date(a.updated_at) : new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    }));

    return [...STATIC_ROUTES, ...cmsRoutes];
  } catch {
    return STATIC_ROUTES;
  }
}
