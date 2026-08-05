import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getBlogPostsByCategory } from "@/lib/wordpress";

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const metadata: Metadata = {
  title: "블로그 | 대전톰바 대전호빠",
  description:
    "대전톰바 대전호빠 예약 안내, 방문 팁, 분위기와 가격 상담 정보를 정리한 블로그입니다.",
  alternates: {
    canonical: "/blog"
  },
  openGraph: {
    title: "블로그 | 대전톰바 대전호빠",
    description: "대전톰바 대전호빠 예약 안내, 방문 팁, 분위기와 가격 상담 정보를 정리한 블로그입니다.",
    url: "/blog",
    type: "website",
    siteName: "대전톰바"
  },
  twitter: {
    card: "summary_large_image",
    title: "블로그 | 대전톰바 대전호빠",
    description: "대전톰바 대전호빠 예약 안내, 방문 팁, 분위기와 가격 상담 정보를 정리한 블로그입니다."
  }
};

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

const blogSchema = {
  "@context": "https://schema.org",
  "@type": "Blog",
  "url": "https://www.daejeonhopa.com/blog",
  "name": "블로그 | 대전톰바 대전호빠",
  "description": "대전톰바 대전호빠 예약 안내, 방문 팁, 분위기와 가격 상담 정보를 정리한 블로그입니다.",
  "publisher": {
    "@type": "Organization",
    "name": "대전톰바"
  }
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

interface PostCategory {
  slug: string;
  name: string;
}

interface BlogPost {
  title: string;
  slug: string;
  date: string | null;
  excerpt?: string | null;
  categories?: PostCategory[];
  featuredImage?: {
    sourceUrl: string;
    altText?: string | null;
  } | null;
}

// 개별 포스트 카드 컴포넌트
function PostCard({ post }: { post: BlogPost }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] transition-all duration-300 hover:-translate-y-1 hover:border-[#f7d680]/60 hover:shadow-[0_8px_30px_rgba(247,214,128,0.08)]">
      {/* 썸네일 이미지 영역 */}
      <div className="relative h-20 sm:h-24 md:h-28 w-full overflow-hidden bg-gradient-to-br from-[#f7d680]/15 to-[#ff5f7a]/15">
        {post.featuredImage?.sourceUrl ? (
          <Image
            src={post.featuredImage.sourceUrl}
            alt={post.featuredImage.altText || post.title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center p-3 text-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-white/30">
              {post.categories?.[0]?.name || "대전톰바"}
            </span>
          </div>
        )}
      </div>

      {/* 포스트 정보 영역 */}
      <div className="flex flex-1 flex-col p-2.5 sm:p-3.5">
        <div className="flex items-center gap-2">
          {post.categories?.slice(0, 1).map((category: PostCategory) => (
            <span
              key={category.slug}
              className="rounded-full bg-[#ff5f7a]/10 px-2 py-0.5 text-[9px] sm:text-[10px] font-black text-[#ff5f7a]"
            >
              {category.name}
            </span>
          ))}
          <time className="text-[9px] sm:text-[10px] font-medium text-white/40">
            {formatDate(post.date)}
          </time>
        </div>

        <h3 className="mt-2 text-xs sm:text-sm font-black leading-snug text-[#fffaf7] transition-colors duration-300 group-hover:text-[#ff5f7a] line-clamp-2">
          <Link href={`/blog/${post.slug}`} className="focus:outline-none">
            {post.title}
          </Link>
        </h3>

        <p className="mt-1 line-clamp-2 text-[10px] sm:text-xs leading-normal text-white/50">
          {post.excerpt || "자세한 내용은 글 상세 페이지에서 확인해 주세요."}
        </p>

        <Link
          href={`/blog/${post.slug}`}
          className="mt-auto pt-2.5 inline-flex items-center text-[10px] sm:text-xs font-bold text-[#ff5f7a] group-hover:text-[#f7d680] transition-colors duration-300"
          aria-label={`${post.title} 자세히 보기`}
        >
          자세히 보기
          <svg
            className="ml-1 h-3 w-3 transition-transform duration-300 group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </article>
  );
}

// 각 단의 에러 및 빈 데이터 처리 컴포넌트
function ColumnFallback({ title }: { title: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/10 bg-white/[0.02] py-20 px-6 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/[0.04] text-white/40">
        <svg
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
          />
        </svg>
      </div>
      <h4 className="mt-4 text-lg font-black text-white/80">{title} 소식이 비어 있습니다</h4>
      <p className="mt-2 text-sm max-w-xs leading-relaxed text-white/50">
        현재 워드프레스에 발행된 관련 글이 없습니다. 새로운 소식이 올라오면 자동으로 표시됩니다.
      </p>
    </div>
  );
}

export default async function BlogPage() {
  // 병렬로 이용정보와 대전호빠의 포스팅 가져오기 (각각 18개씩)
  const [sevenNightPosts, waiterPosts] = await Promise.all([
    getBlogPostsByCategory("aaa", 18).catch(() => null),
    getBlogPostsByCategory("bbb", 18).catch(() => null)
  ]);

  return (
    <main className="min-h-screen bg-transparent text-[#fffaf7]">
      <JsonLd data={blogSchema} />
      {/* 최상단 인트로 섹션 */}
      <section className="border-b border-white/10 bg-white/[0.02] py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-5">
          <p className="text-sm font-black uppercase tracking-[0.18em] text-[#f7d680]">
            Blog
          </p>
          <div className="mt-4 grid gap-6 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <h1 className="text-4xl font-black leading-tight md:text-6xl break-keep">
              대전톰바
              <br />
              소식과 방문 가이드
            </h1>
            <p className="text-lg leading-8 text-white/72">
              워드프레스에서 카테고리별 실시간 소식을 모아두었습니다.
              원하시는 정보를 좌우 2개의 컬럼에서 바로 확인하세요.
            </p>
          </div>
        </div>
      </section>

      {/* 본문 2컬럼 레이아웃 영역 */}
      <section className="mx-auto max-w-7xl px-5 py-14 md:py-20">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          
          {/* 왼쪽 단: 이용정보 */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="text-2xl font-black tracking-tight text-[#f7d680] md:text-3xl">
                이용정보
              </h2>
              <span className="rounded-full bg-[#f7d680]/10 px-3 py-1 text-xs font-bold text-[#f7d680]">
                이용정보
              </span>
            </div>
            
            {!sevenNightPosts || sevenNightPosts.length === 0 ? (
              <ColumnFallback title="이용정보" />
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {sevenNightPosts.map((post) => (
                  <PostCard key={post.slug} post={post} />
                ))}
              </div>
            )}
          </div>

          {/* 오른쪽 단: 대전호빠 */}
          <div className="flex flex-col gap-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="text-2xl font-black tracking-tight text-[#ff5f7a] md:text-3xl">
                대전호빠
              </h2>
              <span className="rounded-full bg-[#ff5f7a]/10 px-3 py-1 text-xs font-bold text-[#ff5f7a]">
                대전호빠
              </span>
            </div>
            
            {!waiterPosts || waiterPosts.length === 0 ? (
              <ColumnFallback title="대전호빠" />
            ) : (
              <div className="grid grid-cols-3 gap-3">
                {waiterPosts.map((post) => (
                  <PostCard key={post.slug} post={post} />
                ))}
              </div>
            )}
          </div>

        </div>
      </section>
    </main>
  );
}
