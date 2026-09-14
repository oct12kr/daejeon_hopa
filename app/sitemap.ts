import type { MetadataRoute } from "next";
import { getBlogPostSlugs } from "@/lib/wordpress";
import { siteUrl } from "@/lib/constants";

// 홈페이지 콘텐츠가 실제로 마지막으로 수정된 시점. 매 요청마다 현재 시간으로
// 바뀌지 않도록 고정값으로 관리하고, 홈페이지 콘텐츠를 실제로 바꿀 때만 갱신한다.
const HOME_LAST_MODIFIED = new Date("2026-09-09");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const blogPosts = await getBlogPostSlugs().catch(() => []);

  // /blog 목록은 새 글이 올라올 때 실제로 바뀌므로, 가장 최근에 수정된
  // 게시글의 실제 modified 시각을 사용한다(요청 시각을 그대로 쓰지 않는다).
  const latestPostModified = blogPosts.reduce<Date>((latest, post) => {
    if (!post.modified) return latest;
    const modified = new Date(post.modified);
    return modified > latest ? modified : latest;
  }, HOME_LAST_MODIFIED);

  return [
    {
      url: siteUrl,
      lastModified: HOME_LAST_MODIFIED,
      changeFrequency: "weekly",
      priority: 1
    },
    {
      url: `${siteUrl}/blog`,
      lastModified: latestPostModified,
      changeFrequency: "daily",
      priority: 0.8
    },
    ...blogPosts.map((post) => ({
      url: `${siteUrl}/blog/${post.slug}`,
      lastModified: post.modified ? new Date(post.modified) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.7
    }))
  ];
}
