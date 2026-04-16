"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Image from "next/image";
import logo from "../public/globe.svg";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "./ui/sheet";
import { ChevronDown, LogOut, Menu, UserCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import NavLink from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { deleteAuthToken } from "@/features/auth/auth.actions";
import { useAuthUserStore } from "@/features/auth/auth.store";
import { User } from "@/features/user/user.type";
import { Button } from "./ui/button";
import { Dispatch, SetStateAction, useState } from "react";

const links = [
  {
    title: "Home",
    href: "/",
  },
  {
    title: "Hot",
    href: "/hot",
  },
] as const;

type LoggedViewProps = {
  user: User;
  handleLogout: () => void;
  closeSheet: Dispatch<SetStateAction<boolean>>;
};

const LoggedView = ({ user, handleLogout, closeSheet }: LoggedViewProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={
          "font-semibold duration-300 px-4 py-3 text-2xl text-primary flex justify-between cursor-pointer"
        }
      >
        <p>Hello, {user.username}</p>
        <ChevronDown />
      </DropdownMenuTrigger>
      <DropdownMenuContent className={"text-[1rem]"}>
        <DropdownMenuItem className={'cursor-pointer'}>
          <Link
            href={"/me"}
            className="flex gap-1 w-full"
            onClick={() => closeSheet(false)}
          >
            <UserCircle /> Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem className="flex gap-1" onClick={() => handleLogout()}>
          <LogOut /> Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

type UnloggedViewProps = {
  closeSheet: Dispatch<SetStateAction<boolean>>;
};

const UnloggedView = ({ closeSheet }: UnloggedViewProps) => {
  return (
    <div className="flex gap-2 px-4 py-3">
      <Button
        variant={"outline"}
        nativeButton={false}
        onClick={() => closeSheet(false)}
        render={<Link href={"/login"} />}
      >
        Log in
      </Button>
      <Button
        nativeButton={false}
        onClick={() => closeSheet(false)}
        render={<Link href={"/register"} />}
      >
        Sign in
      </Button>
    </div>
  );
};

const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const { user, logout } = useAuthUserStore();

  async function handleLogout() {
    /* Elimino il cookie con il token */
    await deleteAuthToken();
    /* Svuoto lo store con il token e le info sull'utente */
    logout();

    //redirect sulla home
    router.push("/");
  }

  return (
    <header className="w-full bg-white py-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between px-4">
        <Link
          href={"/"}
          aria-label="Ritorna alla home"
          className="flex items-center gap-2"
        >
          <Image
            src={logo}
            alt="Logo di TravelEx"
            className="size-8"
            width={64}
            height={64}
          />
          <p className="text-primary h6 italic">TravelEx</p>
        </Link>

        {/* Hamburger */}
        <Sheet
          open={open}
          defaultOpen={open}
          onOpenChange={() => setOpen(!open)}
        >
          <SheetTrigger className="p-2 text-primary cursor-pointer">
            <Menu size={24} />
          </SheetTrigger>
          <SheetContent side="right" className="w-full pt-12">
            <SheetTitle className="sr-only">Menù di navigazione</SheetTitle>
            <nav className="flex flex-col">
              {/* Link di navigazione */}
              {links.map((obj) => (
                <NavLink
                  className={cn(
                    "font-semibold duration-300 px-4 py-3 text-2xl",
                    pathname === obj.href &&
                      "bg-primary text-primary-foreground",
                    pathname !== obj.href && "hover:text-secondary",
                  )}
                  onClick={() => setOpen(false)}
                  key={obj.title}
                  href={obj.href}
                >
                  {obj.title}
                </NavLink>
              ))}
              {/* Mostro pulsanti di registrazione/login per non loggati */}
              {/* Mostro l'utente per i loggati */}
              {user !== undefined ? (
                <LoggedView
                  user={user}
                  handleLogout={handleLogout}
                  closeSheet={setOpen}
                />
              ) : (
                <UnloggedView closeSheet={setOpen} />
              )}
            </nav>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;
