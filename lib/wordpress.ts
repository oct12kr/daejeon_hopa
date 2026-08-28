import { cache } from 'react';

// 워드프레스 API URL (환경변수에서 읽어옴)
const WP_REST_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL || 'https://wordpress-1628102-6522287.cloudwaysapps.com/wp-json/wp/v2';

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

function normalizeRestPost(post: WpRestPost): BlogPost {
  const title = cleanText(post.title?.rendered || '');
  const slug = post.slug;
  const excerpt = cleanText(post.excerpt?.rendered || '');
  const content = post.content?.rendered || '';
  
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

async function fetchWordPressJSON(url: string): Promise<unknown> {
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
        throw new WordPressFetchError(`WordPress API responded with ${res.status}`);
      }
      return await res.json();
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

export async function getBlogPostsByCategory(
  categorySlug: string,
  first = 18
): Promise<BlogPostSummary[]> {
  const CATEGORY_MAP: Record<string, number> = {
    'aaa': 2,
    'bbb': 3
  };

  const categoryId = CATEGORY_MAP[categorySlug];
  let url = `${WP_REST_URL}/posts?_embed=1&per_page=${first}`;

  if (categoryId) {
    url += `&categories=${categoryId}`;
  }

  const data = await fetchWordPressJSON(url);
  const posts = data as WpRestPost[];
  return posts.map(normalizeRestPost).map(toSummary);
}

export const getBlogPostBySlug = cache(async (slug: string): Promise<BlogPost | null> => {
  const data = await fetchWordPressJSON(`${WP_REST_URL}/posts?_embed=1&slug=${slug}`);
  const posts = data as WpRestPost[];
  if (posts && posts.length > 0) {
    return normalizeRestPost(posts[0]);
  }
  return null;
});

export async function getBlogPostSlugs(first = 50) {
  const posts = await getBlogPosts(first);
  return posts.map(post => ({
    slug: post.slug,
    modified: post.modified
  }));
}
