import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

import { fetchUser } from "@/lib/actions/user.actions";
import ProfileHeader from "./ProfileHeader";

export default async function AsyncProfile() {
  const user = await currentUser();

  if (!user) return null;

  const userInfo = await fetchUser(user.id);

  if (!userInfo?.onboarded) redirect("/onboarding");

  return (
    <ProfileHeader
      name={userInfo.name}
      username={userInfo.username}
      imgUrl={userInfo.image}
      bio={userInfo.bio}
    />
  );
}
