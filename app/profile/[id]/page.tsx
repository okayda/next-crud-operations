import { Suspense } from "react";

import Loader from "@/components/Loader";
import AsyncDifferentUserProfile from "./_components/AsyncDifferentUserProfile";

export default function page({ params }: { params: { id: string } }) {
  return (
    <section>
      <div className="mx-auto max-w-4xl">
        <div className="mb-14">
          <h2 className="text-bold text-4xl text-foreground">User Profile</h2>
        </div>

        <Suspense fallback={<Loader />}>
          <AsyncDifferentUserProfile viewUserId={params.id} />
        </Suspense>
      </div>
    </section>
  );
}
