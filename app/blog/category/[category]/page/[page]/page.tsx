import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogList, {
  buildBlogListMetadata,
  findBlogCategory,
  parsePageNumber
} from "@/components/BlogList";

export const revalidate = 300;

// 빌드 시 미리 만들지 않고, 첫 요청 때 생성한 뒤 ISR로 캐시한다.
export function generateStaticParams() {
  return [];
}

type BlogCategoryListPageProps = {
  params: Promise<{ category: string; page: string }>;
};

export async function generateMetadata({ params }: BlogCategoryListPageProps): Promise<Metadata> {
  const { category: categorySlug, page: pageParam } = await params;
  const category = findBlogCategory(categorySlug);
  const page = parsePageNumber(pageParam);
  return category && page ? buildBlogListMetadata(category, page) : {};
}

export default async function BlogCategoryListPage({ params }: BlogCategoryListPageProps) {
  const { category: categorySlug, page: pageParam } = await params;
  const category = findBlogCategory(categorySlug);
  const page = parsePageNumber(pageParam);
  if (!category || !page) {
    notFound();
  }

  return <BlogList category={category} page={page} />;
}
