import Link from "next/link";
import Image from "next/image";
import type { BlogPostSummary } from "@/lib/wordpress";

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

// 블로그 목록/상세 하단의 "함께 읽어보세요" 내부링크 영역 (최대 5개)
export default function RelatedPosts({ posts }: { posts: BlogPostSummary[] }) {
  if (posts.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="related-posts-title" className="border-t border-white/10 pt-12 md:pt-14">
      <p className="text-xs font-black uppercase tracking-[0.18em] text-[#f7d680]">
        Related Posts
      </p>
      <h2 id="related-posts-title" className="mt-2 text-2xl font-black tracking-tight md:text-3xl">
        함께 읽어보세요
      </h2>
      <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-5">
        {posts.map((post) => (
          <li key={post.slug} className="flex">
            <Link
              href={`/blog/${post.slug}`}
              className="group flex w-full flex-col overflow-hidden rounded-xl border border-white/10 bg-white/[0.03] transition-all duration-300 hover:-translate-y-1 hover:border-[#f7d680]/60 hover:shadow-[0_8px_30px_rgba(247,214,128,0.08)] focus:outline-none focus-visible:border-[#f7d680]"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-gradient-to-br from-[#f7d680]/15 to-[#ff5f7a]/15">
                {post.featuredImage?.sourceUrl ? (
                  <Image
                    src={post.featuredImage.sourceUrl}
                    alt={post.featuredImage.altText || post.title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : null}
              </div>
              <div className="flex flex-1 flex-col p-3">
                {post.categories[0] ? (
                  <span className="text-[10px] font-black text-[#f7d680]">
                    {post.categories[0].name}
                  </span>
                ) : null}
                <h3 className="mt-1 line-clamp-2 break-keep text-sm font-black leading-snug text-[#fffaf7] transition-colors duration-300 group-hover:text-[#f7d680]">
                  {post.title}
                </h3>
                <time className="mt-auto pt-2 text-[11px] font-medium text-white/40">
                  {formatDate(post.date)}
                </time>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
