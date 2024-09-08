"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { cn } from "@/lib/utils";

import { Separator } from "@/components/ui/separator";
import { buttonVariants } from "@/components/ui/button";

type Props = {
  name: string;
  username: string;
  imgUrl: string;
  bio: string;
};

export default function CurrentUserHeader({
  name,
  username,
  imgUrl,
  bio,
}: Props) {
  const pathname = usePathname();

  return (
    <div className="flex w-full flex-col justify-start">
      <div className={`flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <div className="relative size-[80px] object-cover">
            <Image
              src={imgUrl}
              alt=""
              fill
              className="rounded-full bg-slate-900 object-cover shadow-2xl"
            />
          </div>

          <div className="flex flex-col">
            <h2 className="text-2xl font-bold">{name}</h2>
            <p className="text-base-medium text-muted-foreground">
              @{username}
            </p>
          </div>
        </div>

        <Link
          href={`${pathname}/change`}
          className={cn(
            "!font-semibold",
            buttonVariants({ variant: "default" }),
          )}
        >
          Change
        </Link>
      </div>
      <p className="mb-10 mt-6 font-semibold">{bio}</p>
      <Separator />
    </div>
  );
}
