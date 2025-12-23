import BlogForm from "../../_components/BlogForm";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditBlogPage({ params }: Props) {
  const { id } = await params;
  return <BlogForm blogId={id} mode="edit" />;
}
