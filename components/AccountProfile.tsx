"use client";

import { ChangeEvent, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Image from "next/image";
import * as z from "zod";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserValidation } from "@/lib/schema/user";

import { Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import { isBase64Image } from "@/lib/utils";
import { useUploadThing } from "@/lib/uploadthing";
import { upsertUser } from "@/lib/actions/user.actions";

type Props = {
  user: {
    id: string;
    username: string;
    name: string;
    bio: string;
    image: string;
  };
};

const AccountProfile = ({ user }: Props) => {
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const { startUpload } = useUploadThing("imageUploader");

  const router = useRouter();
  const pathname = usePathname();

  const form = useForm<z.infer<typeof UserValidation>>({
    resolver: zodResolver(UserValidation),

    defaultValues: {
      profile_photo: user?.image ? user.image : "",
      name: user?.name ? user.name : "",
      username: user?.username ? user.username : "",
      bio: user?.bio ? user.bio : "",
    },
  });

  const handleImage = function (
    e: ChangeEvent<HTMLInputElement>,
    fieldChange: (value: string) => void,
  ) {
    e.preventDefault();

    const fileReader = new FileReader();

    // validating if the new profile picture is applied
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];

      setFiles(Array.from(e.target.files));

      if (!file.type.includes("image")) return;

      fileReader.onload = async (event) => {
        const imageDataUrl = event.target?.result?.toString() || "";

        fieldChange(imageDataUrl);
      };

      fileReader.readAsDataURL(file);
    }
  };

  const onSubmit = async (values: z.infer<typeof UserValidation>) => {
    setLoading(true);

    const blob = values.profile_photo;
    const hasImageChanged = isBase64Image(blob);

    try {
      if (hasImageChanged) {
        const imgRes = await startUpload(files);

        if (imgRes && imgRes[0].url) {
          values.profile_photo = imgRes[0].url;
        }
      }

      await upsertUser({
        userId: user.id,
        username: values.username,
        name: values.name,
        bio: values.bio,
        image: values.profile_photo,
        path: pathname,
      });

      if (pathname.split("/").includes("change")) {
        router.push("/profile");
        router.refresh();
      } else {
        router.push("/");
      }
    } catch (error) {
      console.log("Failed to submit user form: ", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form
        autoComplete="off"
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col justify-start gap-8"
      >
        <FormField
          control={form.control}
          name="profile_photo"
          render={({ field }) => (
            <FormItem className="flex items-center gap-2">
              <FormLabel>
                <div className="relative size-[72px] object-cover">
                  <Image
                    src={field.value}
                    alt="profile photo"
                    fill
                    priority
                    className="rounded-full bg-slate-900 object-cover"
                  />
                </div>
              </FormLabel>

              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  placeholder="Upload a photo"
                  className="cursor-pointer border-none bg-transparent pl-0 text-base outline-none file:text-base file:font-semibold file:text-cyan-500"
                  onChange={(e) => handleImage(e, field.onChange)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem className="">
              <FormLabel className="">Name</FormLabel>

              <FormControl>
                <Input type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="">Username</FormLabel>

              <FormControl>
                <Input type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="">Bio</FormLabel>

              <FormControl>
                <Textarea rows={10} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          variant="default"
          className="tracking-wide"
          disabled={loading}
        >
          {loading ? (
            <Loader2 width={18} height={18} className="animate-spin" />
          ) : (
            "Submit"
          )}
        </Button>
      </form>
    </Form>
  );
};

export default AccountProfile;
