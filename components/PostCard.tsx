import Image from "next/image";
import Link from "next/link";

import DeletePost from "./DeletePost";
import { Card } from "./ui/card";
import { buttonVariants } from "./ui/button";
import Bookmark from "./Bookmark";
import { cn } from "@/lib/utils";

type Props = {
  id: string;
  content: string;
  author: {
    _id?: string;
    id: string;
    name: string;
    image: string;
  };
  comments: {
    author: {
      image: string;
    };
  }[];
  isComment?: boolean;
};

export default function PostCard({
  id,
  content,
  author,
  comments,
  isComment,
}: Props) {
  return (
    <Card className="flex w-full flex-col rounded-xl p-6">
      <div className="flex items-center justify-between">
        <div className="flex w-full flex-1 flex-row gap-4">
          <div className="flex flex-col items-center">
            <Link href={`/profile/${author.id}`} className="relative h-11 w-11">
              <Image
                src={author.image}
                alt="Profile Image"
                fill
                className="cursor-pointer rounded-full"
              />
            </Link>

            <div className="post-card_bar" />
          </div>

          <div className="flex w-full flex-col">
            <div className="flex justify-between">
              <Link href={`/profile/${author.id}`} className="w-fit">
                <h4 className="text-base-semibold text-light-1 cursor-pointer">
                  {author.name}
                </h4>
              </Link>

              <DeletePost postId={JSON.stringify(id)} />
            </div>
            <p className="text-small-regular text-light-2 mt-2">{content}</p>

            <div className="mt-5 flex flex-col gap-3">
              <div className="flex gap-3.5">
                <Link
                  href={`/post/${id}`}
                  className={cn(
                    buttonVariants({ variant: "secondary" }),
                    "size-[24px] p-0",
                  )}
                >
                  <Image
                    src="/assets/reply.svg"
                    alt=""
                    width={24}
                    height={24}
                  />
                </Link>

                <Bookmark
                  userId={JSON.stringify(author._id)}
                  postId={JSON.stringify(id)}
                />
              </div>

              {isComment && comments.length > 0 && (
                <Link href={`/post/${id}`}>
                  <p className="text-subtle-medium text-gray-1 mt-1">
                    {comments.length} replies
                  </p>
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
