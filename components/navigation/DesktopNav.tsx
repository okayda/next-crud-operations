"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { navigation } from "@/constants";
import { cn } from "@/lib/utils";
import { buttonVariants } from "../ui/button";

export default function DesktopNav() {
  const pathname = usePathname();

  return (
    <nav>
      <ul className="flex h-full gap-3">
        {navigation.map((nav) => (
          <li key={nav.label} className="flex items-center">
            <Link
              href={nav.route}
              className={cn(
                buttonVariants({ variant: "ghost" }),
                "w-full justify-start text-sm",
                pathname === nav.route && "bg-accent font-semibold",
              )}
            >
              {nav.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
