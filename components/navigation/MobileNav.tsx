"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { Menu } from "lucide-react";
import { Button, buttonVariants } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";

import { navigation } from "@/constants";
import { cn } from "@/lib/utils";

export default function MobileNav() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav>
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant={"ghost"} size={"icon"}>
            <Menu />
          </Button>
        </SheetTrigger>

        <SheetContent side="left">
          <ul className="flex flex-col gap-4 pt-12">
            {navigation.map((nav) => (
              <li key={nav.label} className="flex items-center">
                <Link
                  href={nav.route}
                  className={cn(
                    buttonVariants({ variant: "ghost" }),
                    "w-full justify-start text-base md:text-sm",
                    pathname === nav.route && "bg-accent font-semibold",
                  )}
                >
                  {nav.label}
                </Link>
              </li>
            ))}
          </ul>
        </SheetContent>
      </Sheet>
    </nav>
  );
}
