import { Loader2 } from "lucide-react";

export default function Loader() {
  return (
    <div className="container mt-20">
      <Loader2 className="mx-auto h-8 w-8 animate-spin" />
    </div>
  );
}
