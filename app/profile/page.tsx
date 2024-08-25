import { Suspense } from "react";
import AsyncProfile from "./_components/AsyncProfile";
import Loader from "@/components/Loader";

export default function page() {
  return (
    <section>
      <div className="mx-auto max-w-4xl">
        <div className="mb-14">
          <h2 className="text-bold text-4xl text-foreground">
            Account Profile
          </h2>
        </div>

        <Suspense fallback={<Loader />}>
          <AsyncProfile />
        </Suspense>
      </div>
    </section>
  );
}
