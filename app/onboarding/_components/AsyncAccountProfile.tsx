import { currentUser } from "@clerk/nextjs/server";

import { fetchUser } from "@/lib/actions/user.actions";

import AccountProfile from "../../../components/AccountProfile";

export default async function AsyncAccountProfile() {
  const getCurrentUser = await currentUser();
  if (!getCurrentUser) return null;

  const currentUserInfo = await fetchUser(getCurrentUser.id);

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
