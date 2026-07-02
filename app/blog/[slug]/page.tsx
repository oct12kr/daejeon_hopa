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
      title: "블로그 글 | 대전호빠"
    };
  }

  const description = buildDescription(post.excerpt, post.title);

  return {
    title: `${post.title} | 대전호빠`,
    description,
    alternates: {
      canonical: `/blog/${post.slug}`
    },
    openGraph: {
      type: "article",
      title: post.title,
      description,
      url: `/blog/${post.slug}`,
      siteName: "대전톰바",
      publishedTime: post.date ?? undefined,
      modifiedTime: post.modified ?? undefined,
      images: post.featuredImage ? [{ url: post.featuredImage.sourceUrl }] : []
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description,
      images: post.featuredImage ? [post.featuredImage.sourceUrl] : []
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

  const postUrl = `https://daejeonhopa.com/blog/${post.slug}`;
  const description = buildDescription(post.excerpt, post.title);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description,
    image: post.featuredImage?.sourceUrl || "https://daejeonhopa.com/images/seven%20(1).png",
    author: {
      "@type": "Person",
      name: post.author
    },
    publisher: {
      "@type": "Organization",
      name: "대전톰바",
      logo: {
        "@type": "ImageObject",
        url: "https://daejeonhopa.com/images/seven%20(1).png"
      }
    },
    datePublished: post.date,
    dateModified: post.modified || post.date,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": postUrl
    },
    url: postUrl
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "홈",
        item: "https://daejeonhopa.com/"
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "블로그",
        item: "https://daejeonhopa.com/blog"
      },
      {
        "@type": "ListItem",
        position: 3,
        name: post.title,
        item: postUrl
      }
    ]
  };

  return (
    <main className="min-h-screen bg-transparent text-[#fffaf7]">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
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
