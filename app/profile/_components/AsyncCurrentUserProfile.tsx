import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

import {
  fetchBookmarks,
  FetchBookmarksReturnType,
} from "@/lib/actions/post.actions";
import { fetchUser } from "@/lib/actions/user.actions";

import CurrentUserHeader from "./CurrentUserHeader";
import PostCard from "@/components/PostCard";

export default async function AsyncCurrentUserProfile() {
  const getCurrentUser = await currentUser();
  if (!getCurrentUser) return null;

  const currentUserInfo = await fetchUser(getCurrentUser.id);
  if (!currentUserInfo?.onboarded) redirect("/onboarding");

  const bookmarks = await fetchBookmarks(currentUserInfo._id);

  return (
    <>
      <CurrentUserHeader
        name={currentUserInfo.name}
        username={currentUserInfo.username}
        imgUrl={currentUserInfo.image}
        bio={currentUserInfo.bio}
      />

      <div className="mt-8">
        <h3 className="mb-10 text-2xl font-semibold">Your Bookmarks</h3>

        <div className="flex flex-col gap-8">
          {bookmarks.map((post: FetchBookmarksReturnType) => {
            const currentUserHasDelete = currentUserInfo.id === post.author.id;

            return (
              <PostCard
                key={post._id}
                postId={post._id}
                currentUserId={currentUserInfo._id}
                authorInfo={post.author}
                isBookmark={true}
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
