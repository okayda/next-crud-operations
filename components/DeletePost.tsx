"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { deleteChildPost, deleteParentPost } from "@/lib/actions/post.actions";
import { Loader2, Trash } from "lucide-react";
import { Button } from "./ui/button";

export default function DeletePost({
  postId,
  isComment,
}: {
  postId: string;
  isComment?: string;
}) {
  const id = JSON.parse(postId);

  const [isDeleting, setIsDeleting] = useState(false);

  const pathname = usePathname();
  const router = useRouter();

  return (
    <Button
      variant="outline"
      className="px-3"
      disabled={isDeleting}
      onClick={async () => {
        setIsDeleting(true);
        if (!isComment) {
          await deleteParentPost(id, pathname);

          if (pathname.split("/").includes("post")) router.push("/");
        } else {
          await deleteChildPost(id, pathname);
        }
        setIsDeleting(false);
      }}
    >
      {isDeleting ? (
        <Loader2 width={18} height={18} className="animate-spin" />
      ) : (
        <Trash width={18} height={18} />
      )}
    </Button>
  );
}
