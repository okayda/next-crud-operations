import { Suspense } from "react";
import AsyncCreatePost from "./_components/AsyncCreatePost";
import Loader from "@/components/Loader";

export default function page() {
  return (
    <section>
      <div className="mx-auto max-w-4xl">
        <div className="mb-10">
          <h2 className="text-bold text-4xl text-foreground">
            Make a post something
          </h2>
        </div>

        <Suspense fallback={<Loader />}>
          <AsyncCreatePost />
        </Suspense>
      </div>
    </section>
  );
}
