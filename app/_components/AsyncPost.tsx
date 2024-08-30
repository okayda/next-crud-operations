import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import {
  fetchPosts,
  checkBookmark,
  FetchPostByIdReturnType,
} from "@/lib/actions/post.actions";
import { fetchUser } from "@/lib/actions/user.actions";

import PostCard from "@/components/PostCard";

export default async function AsyncPost() {
  const result = await fetchPosts(1, 30);

  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  return (
    <>
      {result.posts.length === 0 ? (
        <p className="text-xl tracking-wide">No Posts found</p>
      ) : (
        <>
          {result.posts.map(async (post) => {
            const parentPostBookmark = await checkBookmark(post);

            return (
              <PostCard
                key={post._id}
                postId={post._id}
                isBookmark={parentPostBookmark}
                content={post.text}
                author={post.author}
                createdAt={post.createdAt}
                comments={post.children}
                isComment
              />
            );
          })}
        </>
      )}
    </>
  );
}
