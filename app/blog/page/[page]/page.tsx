import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogList, { buildBlogListMetadata, parsePageNumber } from "@/components/BlogList";

export const revalidate = 300;

// 빌드 시 미리 만들지 않고, 첫 요청 때 생성한 뒤 ISR로 캐시한다.
export function generateStaticParams() {
  return [];
}

type BlogListPageProps = {
  params: Promise<{ page: string }>;
};

export async function generateMetadata({ params }: BlogListPageProps): Promise<Metadata> {
  const page = parsePageNumber((await params).page);
  return page ? buildBlogListMetadata(undefined, page) : {};
}

export default async function BlogListPage({ params }: BlogListPageProps) {
  const page = parsePageNumber((await params).page);
  if (!page) {
    notFound();
  }

  return <BlogList page={page} />;
}
