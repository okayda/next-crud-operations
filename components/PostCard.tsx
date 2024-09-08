import Image from "next/image";
import Link from "next/link";

import DeletePost from "./DeletePost";
import { Card } from "./ui/card";
import { buttonVariants } from "./ui/button";
import Bookmark from "./Bookmark";
import { cn, formatDateString } from "@/lib/utils";

type Props = {
  postId: string; // (mongodb) _id --> ObjectId()
  currentUserId: string; // (clerk auth) id

  authorInfo: {
    _id?: string;
    id: string;
    name: string;
    image: string;
  };

  isBookmark: boolean;
  hasDelete: boolean;

  content: string;
  createdAt: string;

  comments?: {
    author: {
      image: string;
    };
  }[];
  isComment?: boolean;
};

export default function PostCard({
  postId,
  currentUserId,
  authorInfo,
  isBookmark,
  hasDelete,
  content,
  createdAt,
  comments,
  isComment,
}: Props) {
  return (
    <Card className="rounded-md p-6">
      <div className="flex items-center justify-between">
        <Link href={`/profile/${authorInfo.id}`}>
          <div className="flex items-center gap-4">
            <div className="relative size-[52px] object-cover">
              <Image
                src={authorInfo.image}
                alt="Profile Image"
                fill
                className="cursor-pointer rounded-full bg-slate-900 object-cover"
              />
            </div>

            <h4 className="cursor-pointer text-[18px] font-semibold">
              {authorInfo.name}
            </h4>
          </div>
        </Link>

        {hasDelete && <DeletePost postId={JSON.stringify(postId)} />}
      </div>

      <p className="text-small-regular text-light-2 mt-4 border-l-4 pl-4">
        {content}
      </p>

      <div className="mt-5 flex flex-col gap-3">
        <div className="flex gap-3">
          <Link
            href={`/post/${postId}`}
            className={cn(
              buttonVariants({ variant: "outline" }),
              "size-[24px] p-0",
            )}
          >
            <Image src="/assets/reply.svg" alt="" width={24} height={24} />
          </Link>

          <Bookmark
            postId={JSON.stringify(postId)}
            currentUserId={JSON.stringify(currentUserId)}
            isBookmark={isBookmark}
          />
        </div>

        {isComment && comments && comments.length > 0 && (
          <div className="mb-1 flex items-center gap-2">
            {comments.slice(0, 2).map((comment, index) => (
              <Image
                key={index}
                src={comment.author.image}
                alt={`user_${index}`}
                width={22}
                height={22}
                className={`${
                  index !== 0 && "-ml-5"
                } rounded-full bg-slate-900 object-cover`}
              />
            ))}

            <Link href={`/post/${postId}`}>
              <p className="text-sm font-semibold text-muted-foreground">
                {comments.length} repl{comments.length > 1 ? "ies" : "y"}
              </p>
            </Link>
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          {formatDateString(createdAt)}
        </p>
      </div>
    </Card>
  );
}
