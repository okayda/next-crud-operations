import Image from "next/image";
import Link from "next/link";
import { Card } from "./ui/card";

type Props = {
  id: string;
  content: string;
  author: {
    name: string;
    image: string;
    id: string;
  };
  comments: {
    author: {
      iamge: string;
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
            <Link href={`/profile/${author.id}`} className="w-fit">
              <h4 className="text-base-semibold text-light-1 cursor-pointer">
                {author.name}
              </h4>
            </Link>
            <p className="text-small-regular text-light-2 mt-2">{content}</p>

            <div className={`${isComment && "mb-10"} mt-5 flex flex-col gap-3`}>
              <div className="flex gap-3.5">
                <Image
                  src="/assets/heart-gray.svg"
                  alt=""
                  width={24}
                  height={24}
                  className="cursor-pointer object-contain"
                />

                <Link href={`/post/${id}`}>
                  <Image
                    src="/assets/reply.svg"
                    alt=""
                    width={24}
                    height={24}
                    className="cursor-pointer object-contain"
                  />
                </Link>

                <Image
                  src="/assets/bookmark.svg"
                  alt=""
                  width={20}
                  height={20}
                  className="cursor-pointer object-contain"
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
