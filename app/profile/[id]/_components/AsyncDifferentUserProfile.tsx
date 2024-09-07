import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

import { checkBookmark } from "@/lib/actions/post.actions";
import { fetchUser, fetchUserPosts } from "@/lib/actions/user.actions";

import DifferentUserHeader from "./DifferentUserHeader";
import PostCard from "@/components/PostCard";

export default async function AsyncDifferentUserProfile({
  viewUserId,
}: {
  viewUserId: string;
}) {
  const getCurrentUser = await currentUser();
  if (!getCurrentUser) return null;

  const currentUserInfo = await fetchUser(getCurrentUser.id);
  if (!currentUserInfo?.onboarded) redirect("/onboarding");

  const viewUser = await fetchUser(viewUserId);
  const viewUserPosts = await fetchUserPosts(viewUserId);

  return (
    <>
      <DifferentUserHeader
        name={viewUser.name}
        username={viewUser.username}
        imgUrl={viewUser.image}
        bio={viewUser.bio}
      />

      <div className="mt-8">
        <h3 className="mb-10 text-2xl font-semibold">User posts</h3>

        <div className="flex flex-col gap-8">
          {viewUserPosts.posts.map(async (post: any) => {
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
        </div>
      </div>
    </>
  );
}
