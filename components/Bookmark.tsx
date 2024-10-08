"use client";

import { useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { addBookmark, deleteBookmark } from "@/lib/actions/post.actions";

import { Button } from "./ui/button";
import { BookmarkCheck, Loader2 } from "lucide-react";

export default function Bookmark({
  postId,
  currentUserId,
  isBookmark,
}: {
  postId: string;
  currentUserId: string;
  isBookmark: boolean;
}) {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  const parsePostId = JSON.parse(postId);
  const parseCurrentUserId = JSON.parse(currentUserId);

  return (
    <Button
      variant="outline"
      className="size-[24px] p-0"
      disabled={loading}
      onClick={async () => {
        setLoading(true);

        try {
          if (isBookmark) {
            await deleteBookmark(parseCurrentUserId, parsePostId, pathname);
          } else {
            await addBookmark(parseCurrentUserId, parsePostId, pathname);
          }
        } catch (error) {
          console.error("Failed to bookmark:", error);
        } finally {
          setLoading(false);
        }
      }}
    >
      {loading ? (
        <Loader2 width={16} height={16} className="animate-spin" />
      ) : isBookmark ? (
        <BookmarkCheck width={20} height={20} />
      ) : (
        <Image src="/assets/bookmark.svg" alt="" width={20} height={20} />
      )}
    </Button>
  );
}
