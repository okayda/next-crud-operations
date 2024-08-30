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
      variant="default"
      className="size-[32px] p-0"
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
        <Loader2 width={16} height={16} className="animate-spin" />
      ) : (
        <Trash width={16} height={16} />
      )}
    </Button>
  );
}
