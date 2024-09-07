"use server";

import { revalidatePath } from "next/cache";

import { connectToDB } from "../database/mongoose";
import Post from "../models/post.model";
import User from "../models/user.model";

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

export async function fetchPostById(postId: string) {
  await connectToDB();

  try {
    const post = await Post.findById(postId)
      .populate({
        // Populate the author field with _id and username
        path: "author",
        model: User,
        select: "_id id name image",
      })
      .populate({
        path: "children", // Populate the children field
        populate: [
          {
            path: "author", // Populate the author field within children
            model: User,
            select: "_id id name parentId image", // Select only _id and username fields of the author
          },
          {
            path: "children", // Populate the children field within children
            model: Post, // The model of the nested children (assuming it's the same "Post" model)
            populate: {
              path: "author", // Populate the author field within nested children
              model: User,
              select: "_id id name parentId image", // Select only _id and username fields of the author
            },
          },
        ],
      })
      .exec();

    return post;
  } catch (err) {
    console.error("Error while fetching post:", err);
    throw new Error("Unable to fetch post");
  }
}

export type FetchPostByIdReturnType = Awaited<ReturnType<typeof fetchPostById>>;

export async function addCommentToPost(
  postId: string,
  commentText: string,
  userId: string,
  path: string,
) {
  await connectToDB();

  try {
    // Find the original post by its ID
    const originalPost = await Post.findById(postId);

    if (!originalPost) {
      throw new Error("Post not found");
    }

    // Create the new comment post
    const commentPost = new Post({
      text: commentText,
      author: userId,
      parentId: postId, // Set the parentId to the original posts ID
    });

    // Save the comment post to the database
    const savedCommentPost = await commentPost.save();

    // Add the comment posts ID to the original posts children array
    originalPost.children.push(savedCommentPost._id);

    // Save the updated original post to the database
    await originalPost.save();

    revalidatePath(path);
  } catch (err) {
    console.error("Error while adding comment:", err);
    throw new Error("Unable to add comment");
  }
}

export async function fetchBookmarks(userId: string) {
  await connectToDB();

  const user = await User.findById(userId)
    .populate({
      path: "bookmarks",
      options: { sort: { _id: -1 } },
      populate: [
        {
          path: "author",
          model: User,
          select: "_id id name parentId image",
        },

        {
          path: "children",
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
                select: "_id id name parentId image",
              },
            },
          ],
        },
      ],
    })
    .exec();

  if (!user) {
    throw new Error("User not found");
  }

  return user.bookmarks;
}

export type FetchBookmarksReturnType = Awaited<
  ReturnType<typeof fetchBookmarks>
>;

export async function addBookmark(
  userId: string,
  postId: string,
  path: string,
) {
  await connectToDB();

  await User.findByIdAndUpdate(userId, {
    $addToSet: { bookmarks: postId },
  });

  revalidatePath(path);
}

export async function deleteBookmark(
  userId: string,
  postId: string,
  path: string,
) {
  await connectToDB();

  await User.findByIdAndUpdate(userId, {
    $pull: { bookmarks: postId },
  });

  revalidatePath(path);
}

export async function checkBookmark(
  post: FetchPostByIdReturnType,
  currentUserId: string,
) {
  await connectToDB();

  const user = await User.findById(currentUserId).select("bookmarks").exec();

  if (!user) {
    throw new Error("User not found");
  }

  const isBookmarked = user.bookmarks.includes(post._id);

  return isBookmarked;
}

async function fetchAllChildPosts(postId: string): Promise<any[]> {
  const childPosts = await Post.find({ parentId: postId });

  const descendantPosts = [];
  for (const childPost of childPosts) {
    const descendants = await fetchAllChildPosts(childPost._id);
    descendantPosts.push(childPost, ...descendants);
  }

  return descendantPosts;
}

export async function deletePost(postId: string, path: string): Promise<void> {
  try {
    await connectToDB();

    const mainPost = await Post.findById(postId);

    if (!mainPost) {
      throw new Error("Parent Post not found");
    }

    // Fetch all child post and their descendants recursively
    const descendantPosts = await fetchAllChildPosts(postId);

    // Get all descendant post IDs including the main post ID and child post IDs
    const descendantPostIds = [
      postId,
      ...descendantPosts.map((post) => post._id),
    ];

    // Extract the authorIds to update User models respectively
    const uniqueAuthorIds = new Set(
      [
        ...descendantPosts.map((post) => post.author?._id?.toString()),
        mainPost.author?._id?.toString(),
      ].filter((id) => id !== undefined),
    );

    // Recursively delete child post and their descendants
    await Post.deleteMany({ _id: { $in: descendantPostIds } });

    // Update User model
    await User.updateMany(
      { _id: { $in: Array.from(uniqueAuthorIds) } },
      { $pull: { posts: { $in: descendantPostIds } } },
    );

    // Fetch all users who have any of the descendant postIds in their bookmarks
    const usersWithBookmarks = await User.find({
      bookmarks: { $in: descendantPostIds },
    });

    if (usersWithBookmarks.length > 0) {
      // Remove the deleted posts from all users bookmarks array
      await User.updateMany(
        { bookmarks: { $in: descendantPostIds } },
        { $pull: { bookmarks: { $in: descendantPostIds } } },
      );
    }

    revalidatePath(path);
  } catch (error: any) {
    throw new Error(`Failed to delete post: ${error.message}`);
  }
}
