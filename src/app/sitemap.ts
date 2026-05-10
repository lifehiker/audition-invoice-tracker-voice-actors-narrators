import type { MetadataRoute } from "next";

import { getBlogPosts } from "@/lib/blog";
import { env } from "@/lib/env";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getBlogPosts();
  const base = env.appUrl;
  const pages = [
    "",
    "/pricing",
    "/royalty-share-calculator",
    "/features/audition-tracker",
    "/features/royalty-share-roi",
    "/vs/spreadsheets",
    "/blog",
  ];

  return [
    ...pages.map((route) => ({
      url: `${base}${route}`,
      lastModified: new Date(),
    })),
    ...posts.map((post) => ({
      url: `${base}/blog/${post.slug}`,
      lastModified: new Date(post.date),
    })),
  ];
}
