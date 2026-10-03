import BlogList, { buildBlogListMetadata } from "@/components/BlogList";

export const revalidate = 300;

export const metadata = buildBlogListMetadata(undefined, 1);

export default function BlogPage() {
  return <BlogList page={1} />;
}
