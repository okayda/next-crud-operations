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

export default async function AsyncCurrentPost({ postId }: { postId: string }) {
  if (!postId) return null;

  const getCurrentUser = await currentUser();
  if (!getCurrentUser) return null;

  const currentUserInfo = await fetchUser(getCurrentUser.id);
  if (!currentUserInfo?.onboarded) redirect("/onboarding");

  const currentPost = await fetchPostById(postId);

  const isBookmark = await checkBookmark(currentPost, currentUserInfo._id);

  const currentUserHasDelete = currentUserInfo.id === currentPost.author.id;

  return (
    <>
      <PostCard
        key={currentPost._id}
        postId={currentPost._id}
        currentUserId={currentUserInfo._id}
        authorInfo={currentPost.author}
        isBookmark={isBookmark}
        hasDelete={currentUserHasDelete}
        content={currentPost.text}
        createdAt={currentPost.createdAt}
      />

      <div className="mt-12">
        <Comment
          postId={currentPost.id}
          currentUserImg={currentUserInfo.image}
          currentUserId={JSON.stringify(currentUserInfo._id)}
        />
      </div>

      <div className="mt-8 flex flex-col gap-8">
        {currentPost.children.map(async (comment: FetchPostByIdReturnType) => {
          const commentIsBookmark = await checkBookmark(
            comment,
            currentUserInfo._id,
          );

          const currentUserCommentHasDelete =
            currentUserInfo.id === comment.author.id;

          return (
            <PostCard
              key={comment._id}
              postId={comment._id}
              currentUserId={currentUserInfo._id}
              authorInfo={comment.author}
              isBookmark={commentIsBookmark}
              hasDelete={currentUserCommentHasDelete}
              content={comment.text}
              createdAt={comment.createdAt}
              comments={comment.children}
              isComment
            />
          );
        })}
      </div>
    </>
  );
}
