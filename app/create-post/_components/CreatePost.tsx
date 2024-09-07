"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { PostValidation } from "@/lib/schema/post";
import { createPost } from "@/lib/actions/post.actions";
import { useForm } from "react-hook-form";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "../../../components/ui/textarea";

export default function CreatePost({ userId }: { userId: string }) {
  const router = useRouter();
  const pathname = usePathname();

  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof PostValidation>>({
    resolver: zodResolver(PostValidation),

    defaultValues: {
      post: "",
      accountId: userId,
    },
  });

  const onSubmit = async (values: z.infer<typeof PostValidation>) => {
    setLoading(true);

    try {
      await createPost({
        text: values.post,
        author: userId,
        path: pathname,
      });

      router.push("/");

      form.reset();
    } catch (error) {
      console.error("Failed to create post:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        autoComplete="off"
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col justify-start gap-10"
      >
        <FormField
          control={form.control}
          name="post"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormControl>
                <Textarea rows={10} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={loading}>
          {loading ? "Posting..." : "Post"}
        </Button>
      </form>
    </Form>
  );
}
