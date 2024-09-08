"use client";

import { useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "./ui/input";

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

  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(CommentValidation),

    defaultValues: {
      post: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof CommentValidation>) => {
    setLoading(true);

    try {
      await addCommentToPost(
        postId,
        values.post,
        JSON.parse(currentUserId),
        pathname,
      );

      form.reset();
    } catch (error) {
      console.error("Failed to commen:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        autoComplete="off"
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex items-center gap-4 border-y border-border py-5"
      >
        <div className="xs-md:flex-row xs-md:gap-0 flex w-full flex-col gap-8">
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

                <FormControl className="!mt-0 border-none bg-transparent">
                  <Input
                    type="text"
                    placeholder="Your comment..."
                    {...field}
                    className="outline-none focus-visible:ring-0 focus-visible:ring-transparent focus-visible:ring-offset-0"
                  />
                </FormControl>
              </FormItem>
            )}
          />

          <Button
            variant="default"
            type="submit"
            className="font-semibold"
            disabled={loading}
          >
            {loading ? (
              <Loader2 width={18} height={18} className="animate-spin" />
            ) : (
              "Submit"
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
