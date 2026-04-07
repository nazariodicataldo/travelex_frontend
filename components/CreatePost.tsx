import Link from "next/link";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";

const CreatePost = () => {
  return (
    <Button
      className={"fixed right-8 bottom-8 size-12"}
      /* size={"icon-lg"} */
      nativeButton={false}
      render={
        <Link
          title="Create new post"
          href={"/create-post"}
          aria-label="Create new post"
        >
          <Plus className="size-6" />
        </Link>
      }
    ></Button>
  );
};

export default CreatePost;
