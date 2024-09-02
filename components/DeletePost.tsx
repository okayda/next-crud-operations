"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  deleteBookmark,
  deleteChildPost,
  deleteParentPost,
} from "@/lib/actions/post.actions";
import { Loader2, Trash } from "lucide-react";
import { Button } from "./ui/button";

export default function DeletePost({
  userId,
  postId,
  isComment,
  isBookmark,
}: {
  userId: string;
  postId: string;
  isComment?: string;
  isBookmark: boolean;
}) {
  const parseUserId = JSON.parse(userId);
  const parsePostId = JSON.parse(postId);

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
          // delete booksmarks already handled by the deleteParentPost
          await deleteParentPost(parseUserId, parsePostId, pathname);

          if (pathname.split("/").includes("post")) router.push("/");
        } else {
          await deleteChildPost(parsePostId, pathname);

          if (isBookmark) {
            await deleteBookmark(parseUserId, parsePostId, pathname);
          }
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
