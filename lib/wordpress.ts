import { cache } from 'react';
import { siteUrl } from '@/lib/constants';

// 워드프레스 API URL (환경변수에서 읽어옴)
const WP_REST_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'https://wordpress-1628102-6522287.cloudwaysapps.com/wp-json/wp/v2';
const WP_ORIGIN = new URL(WP_REST_URL).origin;

export type BlogPostSummary = {
  id: number;
  title: string;
  slug: string;
  uri: string;
  date: string | null;
  modified: string | null;
  excerpt: string;
  author: string;
  categories: {
    name: string;
    slug: string;
  }[];
  featuredImage?: {
    sourceUrl: string;
    altText: string;
  } | null;
};

export type BlogPost = BlogPostSummary & {
  content: string;
};

export interface WpRestPost {
  id: number;
  date: string;
  modified: string;
  slug: string;
  title?: { rendered?: string };
  excerpt?: { rendered?: string };
  content?: { rendered?: string };
  featured_image_url?: string;
  yoast_head_json?: {
    og_image?: Array<{ url: string }>;
  };
  _embedded?: {
    author?: Array<{ name?: string }>;
    "wp:featuredmedia"?: Array<{
      source_url?: string;
      alt_text?: string;
      media_details?: {
        sizes?: {
          medium_large?: { source_url?: string };
          full?: { source_url?: string };
        };
      };
    }>;
    "wp:term"?: Array<Array<{ taxonomy?: string; name?: string; slug?: string }>>;
  };
}

function cleanText(html: string) {
  if (!html) return '';
  return html.replace(/<[^>]*>?/gm, '').replace(/&nbsp;/g, ' ').trim();
}

// 워드프레스 본문 안에 워드프레스 원본 도메인(cloudwaysapps.com)을 가리키는
// <a href> 링크가 그대로 들어있으면, 방문자와 구글이 실제 서비스 도메인이 아닌
// 워드프레스 백엔드 원본 주소로 이동/색인하게 된다. 게시글 permalink로 보이는
// 경로만 프론트엔드 /blog/{slug} 주소로 치환한다. 이미지 src(wp-content 업로드)는
// next.config.ts에 허용된 워드프레스 도메인을 그대로 사용하므로 건드리지 않는다.
function rewriteWordPressContentLinks(html: string) {
  if (!html) return html;
  const escapedOrigin = WP_ORIGIN.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const hrefPattern = new RegExp(`href="${escapedOrigin}(/[^"]*)"`, 'g');

  return html.replace(hrefPattern, (match, path: string) => {
    if (/^\/(wp-content|wp-json|wp-admin|wp-includes|feed)(\/|$)/.test(path)) {
      return match;
    }
    const slug = path.replace(/^\/+|\/+$/g, '');
    return slug ? `href="${siteUrl}/blog/${slug}"` : `href="${siteUrl}/"`;
  });
}

function normalizeRestPost(post: WpRestPost): BlogPost {
  const title = cleanText(post.title?.rendered || '');
  const slug = post.slug;
  const excerpt = cleanText(post.excerpt?.rendered || '');
  const content = rewriteWordPressContentLinks(post.content?.rendered || '');
  
  let author = "대전톰바";
  if (post._embedded?.author?.[0]?.name) {
    author = post._embedded.author[0].name;
  }

  let featuredImageSourceUrl = "";
  let featuredImageAltText = title;

  const embeddedMedia = post._embedded?.['wp:featuredmedia']?.[0];
  if (embeddedMedia?.source_url) {
    featuredImageSourceUrl = embeddedMedia.source_url;
    if (embeddedMedia.alt_text) featuredImageAltText = embeddedMedia.alt_text;
  } else if (embeddedMedia?.media_details?.sizes?.medium_large?.source_url) {
    featuredImageSourceUrl = embeddedMedia.media_details.sizes.medium_large.source_url;
  } else if (embeddedMedia?.media_details?.sizes?.full?.source_url) {
    featuredImageSourceUrl = embeddedMedia.media_details.sizes.full.source_url;
  } else if (post.featured_image_url) {
    featuredImageSourceUrl = post.featured_image_url;
  } else if (post.yoast_head_json?.og_image?.[0]?.url) {
    featuredImageSourceUrl = post.yoast_head_json.og_image[0].url;
  } else {
    const match = post.content?.rendered?.match(/<img[^>]+src=["']([^"']+)["']/);
    if (match?.[1]) {
      featuredImageSourceUrl = match[1];
    } else {
      featuredImageSourceUrl = "/images/tomba (1).webp"; // Fallback image
    }
  }

  // 절대경로 변환 (상대경로일 경우)
  if (featuredImageSourceUrl && featuredImageSourceUrl.startsWith('/')) {
    if (!featuredImageSourceUrl.startsWith('/images/')) {
      const wpHost = WP_REST_URL.split('/wp-json')[0];
      featuredImageSourceUrl = `${wpHost}${featuredImageSourceUrl}`;
    }
  }

  const featuredImage = {
    sourceUrl: featuredImageSourceUrl,
    altText: featuredImageAltText
  };

  const categories: {name: string, slug: string}[] = [];
  if (post._embedded?.['wp:term']) {
    const terms = post._embedded['wp:term'];
    for (const termArray of terms) {
      for (const term of termArray) {
        if (term.taxonomy === 'category' && term.name && term.slug) {
          categories.push({
            name: cleanText(term.name),
            slug: term.slug
          });
        }
      }
    }
  }

  return {
    id: post.id,
    title,
    slug,
    uri: `/blog/${slug}`,
    date: post.date,
    modified: post.modified,
    excerpt,
    content,
    author,
    categories,
    featuredImage
  };
}

// WordPress fetch가 실패(타임아웃/네트워크 오류/5xx 등)했을 때 던지는 오류.
// "정상 응답인데 게시글이 0건"인 경우와 구분하기 위해 사용한다.
// 이 오류를 던지면(catch해서 빈 배열/null로 바꾸지 않으면) Next.js가 실패한
// 결과를 정상 데이터처럼 캐시하지 않고, ISR 재검증 시 직전에 성공한
// 캐시를 계속 서빙한다.
export class WordPressFetchError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "WordPressFetchError";
  }
}

type WordPressResponse = {
  data: unknown;
  headers: Headers;
};

// invalidPageAsNull: 존재하지 않는 페이지 번호(page가 총 페이지 수 초과)를 요청하면
// WordPress가 400(rest_post_invalid_page_number)을 반환한다. 이는 API 장애가 아니라
// "그런 페이지가 없음"이므로 오류로 던지지 않고 null로 구분해 돌려준다.
async function fetchWordPress(
  url: string,
  options?: { invalidPageAsNull?: boolean }
): Promise<WordPressResponse | null> {
  const MAX_ATTEMPTS = 2;
  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    try {
      const res = await fetch(url, {
        next: { revalidate: 300 },
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (!res.ok) {
        if (options?.invalidPageAsNull && res.status === 400) {
          const body = (await res.json().catch(() => null)) as { code?: string } | null;
          if (body?.code === "rest_post_invalid_page_number") {
            return null;
          }
        }
        throw new WordPressFetchError(`WordPress API responded with ${res.status}`);
      }
      return { data: await res.json(), headers: res.headers };
    } catch (e) {
      clearTimeout(timeoutId);
      lastError = e;
      console.error(`WordPress API fetch failed (attempt ${attempt}/${MAX_ATTEMPTS}) for ${url}:`, e);
      if (attempt < MAX_ATTEMPTS) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new WordPressFetchError("WordPress API request failed");
}

async function fetchWordPressJSON(url: string): Promise<unknown> {
  const response = await fetchWordPress(url);
  return response?.data;
}

function toSummary(post: BlogPost): BlogPostSummary {
  return {
    id: post.id,
    title: post.title,
    slug: post.slug,
    uri: post.uri,
    date: post.date,
    modified: post.modified,
    excerpt: post.excerpt,
    author: post.author,
    categories: post.categories,
    featuredImage: post.featuredImage
  };
}

export async function getBlogPosts(first = 12): Promise<BlogPostSummary[]> {
  const data = await fetchWordPressJSON(`${WP_REST_URL}/posts?_embed=1&per_page=${first}`);
  const posts = data as WpRestPost[];
  return posts.map(normalizeRestPost).map(toSummary);
}

// 블로그에서 사용하는 WordPress 카테고리 (slug / ID는 WordPress 실제 값과 동일)
export const BLOG_CATEGORIES = [
  { slug: "aaa", id: 2, name: "대전호빠" },
  { slug: "bbb", id: 3, name: "대전톰바" }
] as const;

export const BLOG_POSTS_PER_PAGE = 20;

const CATEGORY_MAP: Record<string, number> = Object.fromEntries(
  BLOG_CATEGORIES.map((category) => [category.slug, category.id])
);

export async function getBlogPostsByCategory(
  categorySlug: string,
  first = 18
): Promise<BlogPostSummary[]> {
  const categoryId = CATEGORY_MAP[categorySlug];
  let url = `${WP_REST_URL}/posts?_embed=1&per_page=${first}&orderby=date&order=desc`;

  if (categoryId) {
    url += `&categories=${categoryId}`;
  }

  const data = await fetchWordPressJSON(url);
  const posts = data as WpRestPost[];
  return posts.map(normalizeRestPost).map(toSummary);
}

export type BlogPostsPage = {
  posts: BlogPostSummary[];
  total: number;
  totalPages: number;
};

// 블로그 목록 한 페이지(최신순 20개)를 WordPress pagination으로 가져온다.
// 존재하지 않는 페이지 번호면 null을 반환한다(API 실패는 예외로 전파).
export async function getBlogPostsPage(
  page = 1,
  categorySlug?: string
): Promise<BlogPostsPage | null> {
  let url = `${WP_REST_URL}/posts?_embed=1&per_page=${BLOG_POSTS_PER_PAGE}&page=${page}&orderby=date&order=desc`;

  const categoryId = categorySlug ? CATEGORY_MAP[categorySlug] : undefined;
  if (categoryId) {
    url += `&categories=${categoryId}`;
  }

  const response = await fetchWordPress(url, { invalidPageAsNull: true });
  if (!response) return null;

  const posts = (response.data as WpRestPost[]).map(normalizeRestPost).map(toSummary);
  const total = Number(response.headers.get("x-wp-total")) || posts.length;
  const totalPages = Number(response.headers.get("x-wp-totalpages")) || 1;

  return { posts, total, totalPages };
}

// 카테고리별 게시글 수 (slug -> count)
export async function getBlogCategoryCounts(): Promise<Record<string, number>> {
  const ids = BLOG_CATEGORIES.map((category) => category.id).join(",");
  const data = await fetchWordPressJSON(
    `${WP_REST_URL}/categories?include=${ids}&_fields=id,slug,count`
  );
  const counts: Record<string, number> = {};
  for (const category of data as Array<{ slug?: string; count?: number }>) {
    if (category.slug) counts[category.slug] = category.count ?? 0;
  }
  return counts;
}

export const RELATED_POSTS_COUNT = 5;

// 상세 페이지 관련글: 같은 카테고리 최신 글 우선, 현재 글 제외, 부족하면
// 전체 최신 글로 채운다. 현재 글 1개를 빼고도 5개가 남도록 6개씩 가져온다.
export async function getRelatedPosts(post: BlogPostSummary): Promise<BlogPostSummary[]> {
  const related: BlogPostSummary[] = [];
  const seen = new Set<number>([post.id]);

  const add = (candidates: BlogPostSummary[]) => {
    for (const candidate of candidates) {
      if (related.length >= RELATED_POSTS_COUNT) break;
      if (seen.has(candidate.id)) continue;
      seen.add(candidate.id);
      related.push(candidate);
    }
  };

  const categorySlug = post.categories.find((category) => CATEGORY_MAP[category.slug])?.slug;
  if (categorySlug) {
    add(await getBlogPostsByCategory(categorySlug, RELATED_POSTS_COUNT + 1));
  }
  if (related.length < RELATED_POSTS_COUNT) {
    add(await getBlogPosts(RELATED_POSTS_COUNT + 1));
  }

  return related;
}

export const getBlogPostBySlug = cache(async (slug: string): Promise<BlogPost | null> => {
  const data = await fetchWordPressJSON(`${WP_REST_URL}/posts?_embed=1&slug=${slug}`);
  const posts = data as WpRestPost[];
  if (posts && posts.length > 0) {
    return normalizeRestPost(posts[0]);
  }
  return null;
});

export async function getBlogPostSlugs(first = 100) {
  const posts = await getBlogPosts(first);
  return posts.map(post => ({
    slug: post.slug,
    modified: post.modified
  }));
}
