"use server";

import { revalidatePath } from "next/cache";
import { connectToDB } from "../database/mongoose";
import User from "../models/user.model";
import Post from "../models/post.model";

type Params = {
  text: string;
  author: string;
  path: string;
};

export async function createPost({ text, author, path }: Params) {
  try {
    await connectToDB();

    const createdPost = await Post.create({
      text,
      author,
    });

    // Update User model
    await User.findByIdAndUpdate(author, {
      $push: { posts: createdPost._id },
    });

    console.log("The pathname is: " + path);

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to create post: ${error.message}`);
  }
}
