import Image from "next/image";
import { Separator } from "@/components/ui/separator";

type Props = {
  name: string;
  username: string;
  imgUrl: string;
  bio: string;
};

export default function DifferentUserHeader({
  name,
  username,
  imgUrl,
  bio,
}: Props) {
  return (
    <div className="flex w-full flex-col justify-start">
      <div className={`flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          <div className="relative h-20 w-20 object-cover">
            <Image
              src={imgUrl}
              alt=""
              fill
              className="rounded-full object-cover shadow-2xl"
            />
          </div>

          <div className="flex flex-col">
            <h2 className="text-2xl font-bold">{name}</h2>
            <p className="text-base-medium text-muted-foreground">
              @{username}
            </p>
          </div>
        </div>
      </div>
      <p className="mb-10 mt-6 font-semibold">{bio}</p>
      <Separator />
    </div>
  );
}
