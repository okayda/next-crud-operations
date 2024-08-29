"use client";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "./ui/input";
import Image from "next/image";
import { usePathname } from "next/navigation";

import { CommentValidation } from "@/lib/schema/post";
import { addCommentToPost } from "@/lib/actions/post.actions";

type Props = {
  postId: string;
  currentUserImg: string;
  currentUserId: string;
};

export default function Comment({
  postId,
  currentUserImg,
  currentUserId,
}: Props) {
  const pathname = usePathname();

  const form = useForm({
    resolver: zodResolver(CommentValidation),

    defaultValues: {
      post: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
    await addCommentToPost(
      postId,
      values.post,
      JSON.parse(currentUserId),
      pathname,
    );

    form.reset();
  };

  return (
    <Form {...form}>
      <form
        autoComplete="off"
        onSubmit={form.handleSubmit(onSubmit)}
        className="mt-10 flex items-center gap-4 border-y border-border py-5"
      >
        <FormField
          control={form.control}
          name="post"
          render={({ field }) => (
            <FormItem className="flex w-full items-center gap-3">
              <FormLabel>
                <Image
                  src={currentUserImg}
                  alt="Profile Image"
                  width={48}
                  height={48}
                  className="rounded-full object-cover"
                />
              </FormLabel>

              <FormControl className="border-none bg-transparent">
                <Input
                  type="text"
                  placeholder="Make a comment"
                  {...field}
                  className="outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
                />
              </FormControl>
            </FormItem>
          )}
        />

        <Button variant="secondary" type="submit">
          Reply
        </Button>
      </form>
    </Form>
  );
}
