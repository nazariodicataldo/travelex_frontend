"use client";

import Image from "next/image";
import logo from "../public/globe.svg";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "./ui/sheet";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import NavLink from "next/link";
import { usePathname } from "next/navigation";

const links = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "Hot",
    href: "/hot",
  },
  {
    title: "Account",
    href: "/me",
  },
] as const;

const Header = () => {
  const pathname = usePathname();

  return (
    <header className="w-full bg-white py-4 sticky top-0">
      <div className="container mx-auto flex justify-between px-4">
        <Link href={"/"} aria-label="Ritorna alla home" className="flex items-center gap-2">
          <Image src={logo} alt="Logo di TravelEx" className="size-8" width={64} height={64} />
          <p className="text-primary h6 italic">TravelEx</p>
        </Link>

        {/* Hamburger */}
        <Sheet>
          <SheetTrigger className="p-2 text-primary cursor-pointer">
            <Menu size={24} />
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-full pt-12"
          >
            <SheetTitle className="sr-only">Menù di navigazione</SheetTitle>
            <nav className="flex flex-col">
              {/* Link di navigazione */}
              {links.map((obj) => (
                <NavLink
                  className={cn(
                    "font-semibold duration-300 px-4 py-3 text-2xl",
                    pathname === obj.href && "bg-primary text-primary-foreground",
                    pathname !== obj.href && "hover:text-secondary",
                  )}
                  key={obj.title}
                  href={obj.href}
                >
                  {obj.title}
                </NavLink>
              ))}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;
