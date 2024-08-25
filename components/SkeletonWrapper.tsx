import { Skeleton } from "./ui/skeleton";

export default function SkelettonWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Skeleton className="w-full">
      <div className="opacity-0">{children}</div>
    </Skeleton>
  );
}
