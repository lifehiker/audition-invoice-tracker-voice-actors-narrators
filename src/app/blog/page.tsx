import Link from "next/link";

import { SiteHeader } from "@/components/layout/site-header";
import { getBlogPosts } from "@/lib/blog";

export default async function BlogIndexPage() {
  let posts: Awaited<ReturnType<typeof getBlogPosts>>;
  try {
    posts = await getBlogPosts();
  } catch {
    posts = [];
  }

  return (
    <div className="pb-16">
      <SiteHeader />
      <section className="shell py-10">
        <p className="eyebrow">Blog</p>
        <h1 className="mt-3 text-5xl font-semibold">Guides for ACX narrators and freelance voice actors</h1>
        <div className="mt-10 grid gap-4">
          {posts.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="panel rounded-[2rem] p-6 transition hover:-translate-y-0.5">
              <p className="text-sm text-[var(--muted)]">{post.date}</p>
              <h2 className="mt-2 text-2xl font-semibold">{post.title}</h2>
              <p className="mt-3 text-[var(--muted)]">{post.description}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
