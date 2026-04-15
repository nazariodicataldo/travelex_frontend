import CreatePostForm from "@/features/post/components/CreatePostForm";

const CreatePost = () => {
  return (
    <section className="flex flex-col gap-6">
      <h1 className="text-primary text-center h2">Create new Post</h1>

      <CreatePostForm />
    </section>
  );
};

export default CreatePost;
