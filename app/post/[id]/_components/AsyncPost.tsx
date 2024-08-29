import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

import { fetchPostById } from "@/lib/actions/post.actions";
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

  return (
    <>
      <PostCard
        key={post._id}
        id={post._id}
        content={post.text}
        author={post.author}
        comments={post.children}
      />

      <div className="mt-6">
        <Comment
          postId={post.id}
          currentUserImg={userInfo.image}
          currentUserId={JSON.stringify(userInfo._id)}
        />
      </div>

      <div className="mt-8 flex flex-col gap-8">
        {post.children.map((childItem: any) => (
          <PostCard
            key={childItem._id}
            id={childItem._id}
            content={childItem.text}
            author={childItem.author}
            comments={childItem.children}
            isComment
          />
        ))}
      </div>
    </>
  );
}
