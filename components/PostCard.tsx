import Image from "next/image";
import Link from "next/link";

import DeletePost from "./DeletePost";
import { Card } from "./ui/card";
import { buttonVariants } from "./ui/button";
import Bookmark from "./Bookmark";
import { cn, formatDateString } from "@/lib/utils";

type Props = {
  postId: string;
  isBookmark: boolean;
  content: string;

  author: {
    _id?: string;
    id: string;
    name: string;
    image: string;
  };

  createdAt: string;

  comments: {
    author: {
      image: string;
    };
  }[];

  isComment?: boolean;
};

export default function PostCard({
  postId,
  isBookmark,
  content,
  author,
  createdAt,
  comments,
  isComment,
}: Props) {
  return (
    <Card className="rounded-md p-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href={`/profile/${author.id}`}>
            <Image
              src={author.image}
              alt="Profile Image"
              width={52}
              height={52}
              className="cursor-pointer rounded-full"
            />
          </Link>

          <Link href={`/profile/${author.id}`}>
            <h4 className="cursor-pointer text-[18px] font-semibold">
              {author.name}
            </h4>
          </Link>
        </div>

        <DeletePost postId={JSON.stringify(postId)} />
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
            isBookmark={isBookmark}
            userId={JSON.stringify(author._id)}
            postId={JSON.stringify(postId)}
          />
        </div>

        {isComment && comments.length > 0 && (
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
                } rounded-full object-cover`}
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
