import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBlogPostBySlug } from "@/lib/wordpress";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

type BlogPostPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function formatDate(value: string | null) {
  if (!value) {
    return "날짜 미정";
  }

  return new Intl.DateTimeFormat("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric"
  }).format(new Date(value));
}

function buildDescription(excerpt: string, title: string) {
  const description = excerpt || `${title} 본문을 확인해 보세요.`;

  return description.length > 150 ? `${description.slice(0, 147)}...` : description;
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  const post = await getBlogPostBySlug(slug).catch(() => null);

  if (!post) {
    return {
      title: "블로그 글 | 대전톰바 대전호빠"
    };
  }

  return {
    title: `${post.title} | 대전톰바 대전호빠`,
    description: buildDescription(post.excerpt, post.title),
    alternates: {
      canonical: `/blog/${post.slug}`
    },
    openGraph: {
      type: "article",
      title: post.title,
      description: buildDescription(post.excerpt, post.title),
      publishedTime: post.date ?? undefined,
      modifiedTime: post.modified ?? undefined
    }
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(rawSlug);
  const post = await getBlogPostBySlug(slug).catch(() => null);

  if (!post) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-transparent text-[#fffaf7]">
      <article>
        <header className="border-b border-white/10 bg-white/[0.02] py-14 md:py-18">
          <div className="mx-auto max-w-4xl px-5">
            <Link
              href="/blog"
              className="text-sm font-black text-[#ff5f7a] hover:text-[#f7d680]"
            >
              블로그 목록
            </Link>
            <div className="mt-6 flex flex-wrap gap-2">
              {post.categories.map((category) => (
                <span
                  key={category.slug}
                  className="rounded-sm border border-[#f7d680]/40 px-2.5 py-1 text-xs font-black text-[#f7d680]"
                >
                  {category.name}
                </span>
              ))}
            </div>
            <h1 className="mt-5 text-4xl font-black leading-tight md:text-6xl">
              {post.title}
            </h1>
            <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-sm font-semibold text-white/58">
              <time>{formatDate(post.date)}</time>
              <span>{post.author}</span>
            </div>
            {post.excerpt ? (
              <p className="mt-6 text-lg leading-8 text-white/74 md:text-xl">
                {post.excerpt}
              </p>
            ) : null}
          </div>
        </header>

        <div className="mx-auto max-w-4xl px-5 py-12 md:py-16">
          <div
            className="wp-content"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>
      </article>
    </main>
  );
}
