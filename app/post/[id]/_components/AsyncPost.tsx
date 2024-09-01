import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

import {
  fetchPostById,
  checkBookmark,
  FetchPostByIdReturnType,
} from "@/lib/actions/post.actions";
import { fetchUser } from "@/lib/actions/user.actions";
import Comment from "@/components/Comment";
import PostCard from "@/components/PostCard";

export default async function AsyncPost({ postId }: { postId: string }) {
  if (!postId) return null;

  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const post = await fetchPostById(postId);

  const parentPostBookmark = await checkBookmark(post);

  return (
    <>
      <PostCard
        key={post._id}
        postId={post._id}
        isBookmark={parentPostBookmark}
        content={post.text}
        author={post.author}
        createdAt={post.createdAt}
        comments={post.children}
      />

      <div className="mt-12">
        <Comment
          postId={post.id}
          currentUserImg={userInfo.image}
          currentUserId={JSON.stringify(userInfo._id)}
        />
      </div>

      <div className="mt-8 flex flex-col gap-8">
        {post.children.map(async (childPost: FetchPostByIdReturnType) => {
          const childPostBookmark = await checkBookmark(childPost);

          return (
            <PostCard
              key={childPost._id}
              postId={childPost._id}
              isBookmark={childPostBookmark}
              content={childPost.text}
              author={childPost.author}
              createdAt={childPost.createdAt}
              comments={childPost.children}
              isComment
            />
          );
        })}
      </div>
    </>
  );
}
