import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import RelatedPosts from "@/components/RelatedPosts";
import {
  BLOG_CATEGORIES,
  RELATED_POSTS_COUNT,
  getBlogCategoryCounts,
  getBlogPostsPage,
  type BlogPostSummary
} from "@/lib/wordpress";
import { siteUrl, phoneDisplay, phoneHref, kakaoOpenChatHref } from "@/lib/constants";

const BASE_TITLE = "블로그 | 대전톰바";
const BASE_OG_TITLE = "블로그 | 대전톰바 대전호빠";
const BASE_DESCRIPTION =
  "대전톰바 대전호빠 예약 안내, 방문 팁, 분위기와 가격 상담 정보를 정리한 블로그입니다.";

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

export function findBlogCategory(slug: string): BlogCategory | undefined {
  return BLOG_CATEGORIES.find((item) => item.slug === slug);
}

// /blog/page/[page] 의 page 값 검증. 2 이상의 정수만 허용한다
// (1페이지는 /blog 또는 /blog/category/[slug] 하나로만 존재).
export function parsePageNumber(value: string): number | null {
  if (!/^[1-9]\d{0,3}$/.test(value)) return null;
  const page = Number(value);
  return page >= 2 ? page : null;
}

// 목록 URL 생성: /blog, /blog/page/2, /blog/category/aaa, /blog/category/aaa/page/2
function buildListHref(categorySlug?: string, page = 1) {
  const base = categorySlug ? `/blog/category/${categorySlug}` : "/blog";
  return page > 1 ? `${base}/page/${page}` : base;
}

// 카테고리/페이지별로 title과 canonical을 구분해 2페이지 이후가 1페이지의
// 중복 페이지로 보이지 않도록 한다. 기본 /blog는 기존 값 그대로다.
export function buildBlogListMetadata(category: BlogCategory | undefined, page: number): Metadata {
  const prefix = category ? `${category.name} ` : "";
  const suffix = page > 1 ? ` (${page}페이지)` : "";
  const title = `${prefix}${BASE_TITLE}${suffix}`;
  const ogTitle = `${prefix}${BASE_OG_TITLE}${suffix}`;
  const url = buildListHref(category?.slug, page);

  return {
    title,
    description: BASE_DESCRIPTION,
    alternates: {
      canonical: url
    },
    openGraph: {
      title: ogTitle,
      description: BASE_DESCRIPTION,
      url,
      type: "website",
      siteName: "대전톰바"
    },
    twitter: {
      card: "summary_large_image",
      title: ogTitle,
      description: BASE_DESCRIPTION
    }
  };
}

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
  "url": `${siteUrl}/blog`,
  "name": "블로그 | 대전톰바 대전호빠",
  "description": "대전톰바 대전호빠 예약 안내, 방문 팁, 분위기와 가격 상담 정보를 정리한 블로그입니다.",
  "publisher": {
    "@type": "Organization",
    "name": "대전톰바"
  }
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "홈",
      item: `${siteUrl}/`
    },
    {
      "@type": "ListItem",
      position: 2,
      name: "블로그",
      item: `${siteUrl}/blog`
    }
  ]
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

// 개별 포스트 카드 컴포넌트
function PostCard({ post }: { post: BlogPostSummary }) {
  return (
    <article className="group flex flex-col overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] transition-all duration-300 hover:-translate-y-1 hover:border-[#f7d680]/60 hover:shadow-[0_8px_30px_rgba(247,214,128,0.08)]">
      {/* 카드 전체를 하나의 링크로 감싸 어느 영역을 클릭해도 상세페이지로 이동 */}
      <Link href={`/blog/${post.slug}`} className="flex flex-1 flex-col focus:outline-none">
        {/* 썸네일 이미지 영역 */}
        <div className="relative aspect-[16/10] w-full overflow-hidden bg-gradient-to-br from-[#f7d680]/15 to-[#ff5f7a]/15">
          {post.featuredImage?.sourceUrl ? (
            <Image
              src={post.featuredImage.sourceUrl}
              alt={post.featuredImage.altText || post.title}
              fill
              sizes="(max-width: 767px) 50vw, (max-width: 1023px) 33vw, 25vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center p-3 text-center">
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/30">
                {post.categories[0]?.name || "대전톰바"}
              </span>
            </div>
          )}
        </div>

        {/* 포스트 정보 영역 */}
        <div className="flex flex-1 flex-col p-3 sm:p-4">
          {post.categories.slice(0, 1).map((category) => (
            <span
              key={category.slug}
              className="self-start rounded-full bg-[#ff5f7a]/10 px-2 py-0.5 text-[10px] font-black text-[#ff5f7a]"
            >
              {category.name}
            </span>
          ))}

          <h3 className="mt-2 line-clamp-2 break-keep text-sm font-black leading-snug text-[#fffaf7] transition-colors duration-300 group-hover:text-[#ff5f7a] sm:text-[15px]">
            {post.title}
          </h3>

          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-white/50">
            {post.excerpt || "자세한 내용은 글 상세 페이지에서 확인해 주세요."}
          </p>

          <time className="mt-auto pt-3 text-[11px] font-medium text-white/40">
            {formatDate(post.date)}
          </time>
        </div>
      </Link>
    </article>
  );
}

// 에러 및 빈 데이터 처리 컴포넌트
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
      <h3 className="mt-4 text-lg font-black text-white/80">{title} 소식이 비어 있습니다</h3>
      <p className="mt-2 text-sm max-w-xs leading-relaxed text-white/50">
        현재 워드프레스에 발행된 관련 글이 없습니다. 새로운 소식이 올라오면 자동으로 표시됩니다.
      </p>
    </div>
  );
}

// 카테고리 탭 바: [ 전체 ] [ 대전호빠 ] [ 대전톰바 ] — 탭을 바꾸면 항상 1페이지부터
function CategoryTabs({ activeSlug }: { activeSlug?: string }) {
  const tabs = [{ slug: undefined as string | undefined, name: "전체" }, ...BLOG_CATEGORIES];

  return (
    <nav aria-label="블로그 카테고리">
      <ul className="flex flex-wrap gap-2">
        {tabs.map((tab) => {
          const isActive = tab.slug === activeSlug;
          return (
            <li key={tab.slug ?? "all"}>
              <Link
                href={`${buildListHref(tab.slug)}#posts`}
                aria-current={isActive ? "page" : undefined}
                className={`inline-flex items-center rounded-full border px-5 py-2.5 text-sm font-black transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f7d680] ${
                  isActive
                    ? "border-[#f7d680] bg-[#f7d680] text-[#08080a]"
                    : "border-white/15 bg-white/[0.04] text-white/70 hover:border-[#f7d680]/60 hover:text-[#f7d680]"
                }`}
              >
                {tab.name}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

// 페이지 번호 목록: 페이지가 많으면 현재 페이지 주변과 처음/끝만 남기고 생략한다.
function getPageItems(current: number, totalPages: number): Array<number | "gap"> {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const items: Array<number | "gap"> = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(totalPages - 1, current + 1);
  if (start > 2) items.push("gap");
  for (let page = start; page <= end; page++) items.push(page);
  if (end < totalPages - 1) items.push("gap");
  items.push(totalPages);
  return items;
}

const paginationItemClass =
  "inline-flex h-10 min-w-10 items-center justify-center rounded-lg border px-3 text-sm font-black transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#f7d680]";
const paginationLinkClass = `${paginationItemClass} border-white/15 bg-white/[0.04] text-white/70 hover:border-[#f7d680]/60 hover:text-[#f7d680]`;
const paginationDisabledClass = `${paginationItemClass} border-white/10 text-white/20`;

function Pagination({
  current,
  totalPages,
  categorySlug
}: {
  current: number;
  totalPages: number;
  categorySlug?: string;
}) {
  if (totalPages <= 1) {
    return null;
  }

  // #posts: 페이지 이동 후 목록 시작 지점(카테고리 탭)으로 이동
  const hrefFor = (page: number) => `${buildListHref(categorySlug, page)}#posts`;

  return (
    <nav aria-label="블로그 페이지 이동" className="mt-10">
      <ul className="flex flex-wrap items-center justify-center gap-2">
        <li>
          {current > 1 ? (
            <Link href={hrefFor(current - 1)} rel="prev" aria-label="이전 페이지" className={paginationLinkClass}>
              &lt;
            </Link>
          ) : (
            <span aria-hidden="true" className={paginationDisabledClass}>
              &lt;
            </span>
          )}
        </li>
        {getPageItems(current, totalPages).map((item, index) =>
          item === "gap" ? (
            <li key={`gap-${index}`} aria-hidden="true" className="px-1 text-white/40">
              …
            </li>
          ) : (
            <li key={item}>
              {item === current ? (
                <span
                  aria-current="page"
                  aria-label={`${item}페이지 (현재 페이지)`}
                  className={`${paginationItemClass} border-[#f7d680] bg-[#f7d680] text-[#08080a]`}
                >
                  {item}
                </span>
              ) : (
                <Link href={hrefFor(item)} aria-label={`${item}페이지`} className={paginationLinkClass}>
                  {item}
                </Link>
              )}
            </li>
          )
        )}
        <li>
          {current < totalPages ? (
            <Link href={hrefFor(current + 1)} rel="next" aria-label="다음 페이지" className={paginationLinkClass}>
              &gt;
            </Link>
          ) : (
            <span aria-hidden="true" className={paginationDisabledClass}>
              &gt;
            </span>
          )}
        </li>
      </ul>
    </nav>
  );
}

// 목록 하단 "함께 읽어보세요": 현재 페이지에 보이는 글과 겹치지 않게, 같은 목록의
// 다음 페이지(마지막 페이지면 1페이지) 글을 우선 사용하고 부족하면 전체 최신 글로
// 채운다. 요청마다 바뀌는 랜덤 요소가 없어 서버 렌더링 결과가 안정적이다.
async function getListRelatedPosts(
  shown: BlogPostSummary[],
  page: number,
  totalPages: number,
  categorySlug?: string
) {
  const related: BlogPostSummary[] = [];
  const seen = new Set(shown.map((post) => post.id));

  const add = (candidates: BlogPostSummary[] | undefined) => {
    for (const candidate of candidates ?? []) {
      if (related.length >= RELATED_POSTS_COUNT) break;
      if (seen.has(candidate.id)) continue;
      seen.add(candidate.id);
      related.push(candidate);
    }
  };

  if (totalPages > 1) {
    const otherPage = page < totalPages ? page + 1 : 1;
    add((await getBlogPostsPage(otherPage, categorySlug))?.posts);
  }
  if (related.length < RELATED_POSTS_COUNT && categorySlug) {
    add((await getBlogPostsPage(1))?.posts);
  }

  return related;
}

export default async function BlogList({
  category,
  page
}: {
  category?: BlogCategory;
  page: number;
}) {
  // 현재 페이지의 20개만 WordPress pagination으로 가져온다.
  // WordPress API 호출이 실패하면 여기서 예외가 위로 전파되어(빈 배열로
  // 대체되지 않음) Next.js가 실패 결과를 정상 캐시로 저장하지 않고
  // 직전에 성공한 페이지를 계속 서빙한다.
  const [postsPage, categoryCounts] = await Promise.all([
    getBlogPostsPage(page, category?.slug),
    getBlogCategoryCounts()
  ]);

  // 존재하지 않는 페이지 번호
  if (!postsPage || (page > 1 && postsPage.posts.length === 0)) {
    notFound();
  }

  const { posts, totalPages } = postsPage;
  const relatedPosts = await getListRelatedPosts(posts, page, totalPages, category?.slug);
  const listTitle = category ? category.name : "전체 글";
  const totalCount = BLOG_CATEGORIES.reduce(
    (sum, item) => sum + (categoryCounts[item.slug] ?? 0),
    0
  );

  return (
    <main className="min-h-screen bg-transparent text-[#fffaf7]">
      <JsonLd data={blogSchema} />
      <JsonLd data={breadcrumbSchema} />
      {/* 최상단 인트로 섹션 */}
      <section className="border-b border-white/10 bg-white/[0.02] py-16 md:py-20">
        <div className="mx-auto max-w-7xl px-5">
          <nav aria-label="breadcrumb" className="mb-4 text-xs font-medium text-white/50">
            <ol className="flex items-center gap-2">
              <li>
                <Link href="/" className="hover:text-[#f7d680] transition">홈</Link>
              </li>
              <li aria-hidden="true">/</li>
              <li aria-current="page" className="text-white/70">블로그</li>
            </ol>
          </nav>
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
              대전호빠를 처음 찾는 분들을 위한 이용 안내부터 대전톰바 방문 후기까지,
              카테고리별 최신 소식을 한눈에 확인하세요.
            </p>
          </div>
        </div>
      </section>

      {/* 본문: 카테고리 탭 + 4열 카드 목록 + 오른쪽 사이드 */}
      <section className="mx-auto max-w-7xl px-5 py-10 md:py-14">
        <div id="posts" className="scroll-mt-28">
          <CategoryTabs activeSlug={category?.slug} />
        </div>

        <div className="mt-8 grid gap-10 xl:grid-cols-[minmax(0,1fr)_240px] xl:gap-8">
          <div className="min-w-0">
            <div className="flex items-end justify-between gap-4 border-b border-white/10 pb-4">
              <h2 className="text-2xl font-black tracking-tight text-[#f7d680] md:text-3xl">
                {listTitle}
              </h2>
              {totalPages > 1 ? (
                <span className="text-xs font-bold text-white/50">
                  {page} / {totalPages} 페이지
                </span>
              ) : null}
            </div>

            {posts.length === 0 ? (
              <div className="mt-6">
                <ColumnFallback title={category?.name ?? "블로그"} />
              </div>
            ) : (
              <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
                {posts.map((post) => (
                  <PostCard key={post.slug} post={post} />
                ))}
              </div>
            )}

            <Pagination current={page} totalPages={totalPages} categorySlug={category?.slug} />
          </div>

          {/* 오른쪽 사이드: 기존 좌/우 카테고리 컬럼 헤더와 상담 안내를 한쪽으로 정리 */}
          <aside aria-label="블로그 사이드 메뉴" className="xl:sticky xl:top-28 xl:self-start">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
              <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
                <h2 className="text-sm font-black uppercase tracking-[0.18em] text-[#f7d680]">
                  카테고리
                </h2>
                <ul className="mt-4 flex flex-col gap-1 text-sm font-bold">
                  {[{ slug: undefined as string | undefined, name: "전체", count: totalCount }, ...BLOG_CATEGORIES.map((item) => ({
                    slug: item.slug as string | undefined,
                    name: item.name as string,
                    count: categoryCounts[item.slug] ?? 0
                  }))].map((item) => (
                    <li key={item.slug ?? "all"}>
                      <Link
                        href={`${buildListHref(item.slug)}#posts`}
                        className={`flex items-center justify-between rounded-lg px-3 py-2 transition hover:bg-white/[0.06] hover:text-[#f7d680] ${
                          item.slug === category?.slug ? "text-[#f7d680]" : "text-white/70"
                        }`}
                      >
                        <span>{item.name}</span>
                        <span className="text-xs text-white/40">{item.count}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-xl border border-[#f7d680]/30 bg-white/[0.03] p-5">
                <h2 className="text-sm font-black uppercase tracking-[0.18em] text-[#f7d680]">
                  예약 상담
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-white/60">
                  예약과 이용 문의는 전화 또는 카카오톡으로 편하게 연락해 주세요.
                </p>
                <a
                  href={phoneHref}
                  className="mt-4 flex items-center justify-center rounded-full border border-white/20 bg-gradient-to-r from-[#94762c] to-[#b89436] px-4 py-2.5 text-sm font-bold tracking-widest text-white transition hover:from-[#a88632] hover:to-[#cca43d]"
                >
                  {phoneDisplay}
                </a>
                <a
                  href={kakaoOpenChatHref}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-2 flex items-center justify-center rounded-full border border-[#f7d680]/40 px-4 py-2.5 text-sm font-bold text-[#f7d680] transition hover:border-[#f7d680] hover:bg-[#f7d680]/10"
                >
                  카카오톡 상담
                </a>
              </div>
            </div>
          </aside>
        </div>

        <div className="mt-14 md:mt-16">
          <RelatedPosts posts={relatedPosts} />
        </div>
      </section>
    </main>
  );
}
