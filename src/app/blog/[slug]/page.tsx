import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";

import { SiteHeader } from "@/components/layout/site-header";
import { getBlogPost, getBlogPosts } from "@/lib/blog";

export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const posts = await getBlogPosts();
  const match = posts.find((post) => post.slug === slug);

  if (!match) {
    return {};
  }

  return {
    title: match.title,
    description: match.description,
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  try {
    const post = await getBlogPost(slug);
    return (
      <div className="pb-16">
        <SiteHeader />
        <article className="shell py-10">
          <div className="panel rounded-[2.5rem] p-8 md:p-10">
            <p className="text-sm text-[var(--muted)]">{post.meta.date}</p>
            <h1 className="mt-3 text-5xl font-semibold">{post.meta.title}</h1>
            <p className="mt-4 max-w-3xl text-lg text-[var(--muted)]">{post.meta.description}</p>
            <div className="prose mt-10 max-w-none">
              <MDXRemote source={post.content} />
            </div>
          </div>
        </article>
      </div>
    );
  } catch {
    notFound();
  }
}
