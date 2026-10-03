import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogList, { buildBlogListMetadata, findBlogCategory } from "@/components/BlogList";

export const revalidate = 300;

// 빌드 시 미리 만들지 않고, 첫 요청 때 생성한 뒤 ISR로 캐시한다.
export function generateStaticParams() {
  return [];
}

type BlogCategoryPageProps = {
  params: Promise<{ category: string }>;
};

export async function generateMetadata({ params }: BlogCategoryPageProps): Promise<Metadata> {
  const category = findBlogCategory((await params).category);
  return category ? buildBlogListMetadata(category, 1) : {};
}

export default async function BlogCategoryPage({ params }: BlogCategoryPageProps) {
  const category = findBlogCategory((await params).category);
  if (!category) {
    notFound();
  }

  return <BlogList category={category} page={1} />;
}
