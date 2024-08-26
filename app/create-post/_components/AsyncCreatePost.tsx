import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { fetchUser } from "@/lib/actions/user.actions";
import CreatePost from "./CreatePost";

export default async function AsyncCreatePost() {
  const user = await currentUser();

  if (!user) return null;

  const userInfo = await fetchUser(user.id);

  if (!userInfo?.onboarded) redirect("/onboarding");

  const userId = userInfo._id;

  return <CreatePost userId={String(userId)} />;
}
