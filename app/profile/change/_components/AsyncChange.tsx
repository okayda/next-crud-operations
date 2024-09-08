import { redirect } from "next/navigation";
import { currentUser } from "@clerk/nextjs/server";

import { fetchUser } from "@/lib/actions/user.actions";
import AccountProfile from "@/components/AccountProfile";

export default async function AsyncChange() {
  const getCurrentUser = await currentUser();
  if (!getCurrentUser) return null;

  const currentUserInfo = await fetchUser(getCurrentUser.id);
  if (!currentUserInfo?.onboarded) redirect("/onboarding");

  const userData = {
    id: getCurrentUser?.id,

    username: currentUserInfo
      ? currentUserInfo?.username
      : getCurrentUser?.username,
    name: currentUserInfo
      ? currentUserInfo?.name
      : getCurrentUser?.firstName || "",
    bio: currentUserInfo ? currentUserInfo?.bio : "",
    image: currentUserInfo ? currentUserInfo?.image : getCurrentUser?.imageUrl,
  };

  return <AccountProfile user={userData} />;
}
