import { Suspense } from "react";
import AsyncAccountProfile from "./_components/AsyncAccountProfile";
import Loader from "@/components/Loader";
import { Card } from "@/components/ui/card";

export default function page() {
  return (
    <section>
      <Card className="mx-auto flex max-w-2xl flex-col justify-start rounded-md bg-background px-6 py-10">
        <div className="mb-8">
          <h2 className="text-bold text-4xl text-foreground">Onboarding</h2>
          <p className="mt-6">Complete now to use your account</p>
        </div>

        <Suspense fallback={<Loader />}>
          <AsyncAccountProfile />
        </Suspense>
      </Card>
    </section>
  );
}
