import fs from "node:fs/promises";
import path from "node:path";

import matter from "gray-matter";

const blogDir = path.join(process.cwd(), "src/content/blog");

export type BlogMeta = {
  slug: string;
  title: string;
  description: string;
  date: string;
};

export async function getBlogPosts(): Promise<BlogMeta[]> {
  const files = await fs.readdir(blogDir);
  const posts = await Promise.all(
    files
      .filter((file) => file.endsWith(".mdx"))
      .map(async (file) => {
        const source = await fs.readFile(path.join(blogDir, file), "utf8");
        const { data } = matter(source);
        return {
          slug: file.replace(/\.mdx$/, ""),
          title: String(data.title),
          description: String(data.description),
          date: String(data.date),
        };
      }),
  );

  return posts.sort((a, b) => (a.date > b.date ? -1 : 1));
}

export async function getBlogPost(slug: string) {
  const source = await fs.readFile(path.join(blogDir, `${slug}.mdx`), "utf8");
  const { data, content } = matter(source);
  return {
    meta: {
      slug,
      title: String(data.title),
      description: String(data.description),
      date: String(data.date),
    },
    content,
  };
}
