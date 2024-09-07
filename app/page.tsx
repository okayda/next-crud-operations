import { Suspense } from "react";

import Loader from "@/components/Loader";
import AsyncHomePost from "./_components/AsyncHomePost";

export default function Home() {
  return (
    <section>
      <div className="mx-auto max-w-4xl">
        <div className="mb-14">
          <h2 className="text-bold text-4xl text-foreground">
            All Posts shown here
          </h2>
        </div>

        <div className="flex flex-col gap-8">
          <Suspense fallback={<Loader />}>
            <AsyncHomePost />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
