import PostCard from "@/components/PostCard";
import { fetchPosts } from "@/lib/actions/post.actions";

export default async function AsyncPost() {
  const result = await fetchPosts(1, 30);

  return (
    <>
      {result.posts.length === 0 ? (
        <p className="text-xl tracking-wide">No Posts found</p>
      ) : (
        <>
          {result.posts.map((post) => (
            <PostCard
              key={post._id}
              id={post._id}
              content={post.text}
              author={post.author}
              comments={post.children}
            />
          ))}
        </>
      )}
    </>
  );
}
