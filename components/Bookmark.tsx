"use client";

import { useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { addBookmark, deleteBookmark } from "@/lib/actions/post.actions";

import { Button } from "./ui/button";
import { BookmarkCheck, Loader2 } from "lucide-react";

export default function Bookmark({
  userId,
  postId,
}: {
  userId: string;
  postId: string;
}) {
  const pathname = usePathname();
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isBookmarking, setIsBookmarking] = useState(false);

  const parseUserId = JSON.parse(userId);
  const parsePostId = JSON.parse(postId);

  return (
    <Button
      variant="outline"
      className="size-[24px] p-0"
      disabled={isBookmarking}
      onClick={async () => {
        setIsBookmarking(true);

        if (isBookmarked) {
          await deleteBookmark(parseUserId, parsePostId, pathname);
          setIsBookmarked(false);
        } else {
          await addBookmark(parseUserId, parsePostId, pathname);
          setIsBookmarked(true);
        }

        setIsBookmarking(false);
      }}
    >
      {isBookmarking ? (
        <Loader2 width={16} height={16} className="animate-spin" />
      ) : isBookmarked ? (
        <BookmarkCheck width={20} height={20} />
      ) : (
        <Image src="/assets/bookmark.svg" alt="" width={20} height={20} />
      )}
    </Button>
  );
}
