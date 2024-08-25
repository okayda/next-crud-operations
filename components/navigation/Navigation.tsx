import { UserButton } from "@clerk/nextjs";
import { ThemeSwitcherBtn } from "../ThemeSwitcherBtn";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";

export default function Navigation() {
  return (
    <div className="border-b bg-background py-4">
      <div className="container flex items-center justify-between px-3 md:px-8">
        <div className="md:hidden">
          <MobileNav />
        </div>

        <div className="hidden md:block">
          <DesktopNav />
        </div>

        <div className="flex items-center gap-2">
          <ThemeSwitcherBtn />

          <UserButton />
        </div>
      </div>
    </div>
  );
}
