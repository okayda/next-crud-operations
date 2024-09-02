import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

import { fetchUser } from "@/lib/actions/user.actions";
import ProfileHeader from "./ProfileHeader";
import {
  fetchBookmarks,
  FetchBookmarksReturnType,
} from "@/lib/actions/post.actions";
import PostCard from "@/components/PostCard";

export default async function AsyncProfile() {
  const user = await currentUser();

  if (!user) return null;

  const userInfo = await fetchUser(user.id);

  if (!userInfo?.onboarded) redirect("/onboarding");

  const bookmarks = await fetchBookmarks(userInfo._id);

  return (
    <>
      <ProfileHeader
        name={userInfo.name}
        username={userInfo.username}
        imgUrl={userInfo.image}
        bio={userInfo.bio}
      />

      <div className="mt-8">
        <h3 className="mb-10 text-2xl font-semibold">Your Bookmarks</h3>

        <div className="flex flex-col gap-8">
          {bookmarks.map((post: FetchBookmarksReturnType) => {
            return (
              <PostCard
                key={post._id}
                postId={post._id}
                isBookmark={true}
                content={post.text}
                author={post.author}
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
