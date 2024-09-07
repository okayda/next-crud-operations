import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { fetchPosts, checkBookmark } from "@/lib/actions/post.actions";
import { fetchUser } from "@/lib/actions/user.actions";

import PostCard from "@/components/PostCard";

export default async function AsyncHomePost() {
  // All Parent posts created by the all users
  const result = await fetchPosts(1, 30);

  const getCurrentUser = await currentUser();
  if (!getCurrentUser) return null;

  const currentUserInfo = await fetchUser(getCurrentUser.id);
  if (!currentUserInfo?.onboarded) redirect("/onboarding");

  return (
    <>
      {result.posts.length === 0 ? (
        <p className="text-xl tracking-wide">No Posts found</p>
      ) : (
        <>
          {result.posts.map(async (post) => {
            const isBookmark = await checkBookmark(post, currentUserInfo._id);

            const currentUserHasDelete = currentUserInfo.id === post.author.id;

            return (
              <PostCard
                key={post._id}
                postId={post._id}
                currentUserId={currentUserInfo._id}
                authorInfo={post.author}
                isBookmark={isBookmark}
                hasDelete={currentUserHasDelete}
                content={post.text}
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
