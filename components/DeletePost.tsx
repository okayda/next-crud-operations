"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { deletePost } from "@/lib/actions/post.actions";
import { Loader2, Trash } from "lucide-react";
import { Button } from "./ui/button";

export default function DeletePost({ postId }: { postId: string }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const pathname = usePathname();

  const parsePostId = JSON.parse(postId);

  return (
    <Button
      variant="default"
      className="size-[32px] p-0"
      disabled={isDeleting}
      onClick={async () => {
        setIsDeleting(true);

        await deletePost(parsePostId, pathname);

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
