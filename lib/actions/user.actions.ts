"use server";

import { revalidatePath } from "next/cache";

import { connectToDB } from "../database/mongoose";
import Post from "../models/post.model";
import User from "../models/user.model";

export async function fetchUser(userId: string) {
  try {
    await connectToDB();

    const user = await User.findOne({ id: userId });

    return user;
  } catch (error) {
    throw new Error(`Failed to fetch user: ${error}`);
  }
}

type Params = {
  userId: string;
  username: string;
  name: string;
  bio: string;
  image: string;
  path: string;
};

export async function upsertUser({
  userId,
  bio,
  name,
  path,
  username,
  image,
}: Params): Promise<void> {
  try {
    await connectToDB();

    await User.findOneAndUpdate(
      { id: userId },
      {
        username: username.toLowerCase(),
        name,
        bio,
        image,
        onboarded: true,
      },
      { upsert: true },
    );

    if (path === "/profile/edit") revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to create/update user: ${error.message}`);
  }
}

export async function fetchUserPosts(userId: string) {
  try {
    connectToDB();

    const posts = await User.findOne({ id: userId }).populate({
      path: "posts",
      populate: [
        {
          path: "author",
          model: User,
          select: "_id id name parentId image",
        },
        {
          path: "children",
          model: Post,

          populate: {
            path: "author",
            model: User,
            select: "name image id",
          },
        },
      ],
    });

    return posts;
  } catch (error) {
    throw new Error(`Error fetching user threads: ${error}`);
  }
}
