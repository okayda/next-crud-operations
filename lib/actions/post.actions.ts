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

export async function fetchPosts(pageNumber = 1, pageSize = 20) {
  await connectToDB();

  // Calculate the number of posts to skip based on the page number and page size.
  const skipAmount = (pageNumber - 1) * pageSize;

  // Create a query to fetch the posts that have no parent (top-level posts) (a post that is not a comment/reply).
  const postsQuery = Post.find({ parentId: { $in: [null, undefined] } })
    .sort({ createdAt: "desc" })
    .skip(skipAmount)
    .limit(pageSize)
    .populate({
      path: "author",
      model: User,
    })
    .populate({
      path: "children", // Populate the children field
      populate: {
        path: "author", // Populate the author field within children
        model: User,
        select: "_id name parentId image", // Select only _id and username fields of the author
      },
    });

  // Count the total number of top-level posts i.e., posts that are not comments.
  const totalPostsCount = await Post.countDocuments({
    parentId: { $in: [null, undefined] },
  }); // Get the total count of posts

  const posts = await postsQuery.exec();

  const isNext = totalPostsCount > skipAmount + posts.length;

  return { posts, isNext };
}
