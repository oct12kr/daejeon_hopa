import { getBlogPosts } from "@/lib/wordpress";
import { siteUrl } from "@/lib/constants";

export const revalidate = 3600;

export async function GET() {
  const posts = await getBlogPosts(20);

  const rssFeed = `<?xml version="1.0" encoding="UTF-8" ?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>대전톰바 대전호빠 | 소식 및 가이드</title>
    <link>${siteUrl}</link>
    <description>대전호빠 대전톰바. 프라이빗한 공간, 완벽한 서비스. 베테랑 유진실장이 잊지 못할 최고의 순간을 만들어 드립니다.</description>
    <language>ko</language>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml"/>
${posts
  .map((post) => {
    const pubDate = new Date(post.date || new Date()).toUTCString();
    return `    <item>
      <title><![CDATA[${post.title}]]></title>
      <link>${siteUrl}/blog/${post.slug}</link>
      <guid isPermaLink="true">${siteUrl}/blog/${post.slug}</guid>
      <description><![CDATA[${post.excerpt}]]></description>
      <pubDate>${pubDate}</pubDate>
    </item>`;
  })
  .join("\n")}
  </channel>
</rss>`;

  return new Response(rssFeed, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
