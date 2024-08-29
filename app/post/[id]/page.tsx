import { Suspense } from "react";
import Loader from "@/components/Loader";
import AsyncPost from "./_components/AsyncPost";

export default function page({ params }: { params: { id: string } }) {
  return (
    <section>
      <div className="mx-auto max-w-4xl">
        <div className="mb-14">
          <h2 className="text-bold text-4xl text-foreground">Post</h2>
        </div>

        <div className="flex flex-col gap-8">
          <Suspense fallback={<Loader />}>
            <AsyncPost postId={params.id} />
          </Suspense>
        </div>
      </div>
    </section>
  );
}
