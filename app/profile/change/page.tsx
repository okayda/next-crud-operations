import { Suspense } from "react";

import Loader from "@/components/Loader";
import { Card } from "@/components/ui/card";
import AsyncChange from "./_components/AsyncChange";

export default function page() {
  return (
    <section>
      <Card className="mx-auto flex max-w-2xl flex-col justify-start rounded-md bg-background px-6 py-10">
        <div className="mb-8">
          <h2 className="text-bold text-4xl text-foreground">Change</h2>
          <p className="mt-6">Complete now to change your account</p>
        </div>

        <Suspense fallback={<Loader />}>
          <AsyncChange />
        </Suspense>
      </Card>
    </section>
  );
}
