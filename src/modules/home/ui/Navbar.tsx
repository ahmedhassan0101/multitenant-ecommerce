"use client";

import Link from "next/link";
import React, { useState } from "react";
import { Poppins } from "next/font/google";
import { usePathname } from "next/navigation";
import { MenuIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { NavbarSidebar } from "./NavbarSidebar";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";


const poppins = Poppins({
  subsets: ["latin"],
  weight: ["700"],
  preload: true,
});

const navbarItems = [
  { href: "/", page: "Home" },
  { href: "/about", page: "About" },
  { href: "/features", page: "Features" },
  { href: "/pricing", page: "Pricing" },
  { href: "/contact", page: "Contact" },
];

export default function Navbar() {
  const currentPath = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const trpc = useTRPC();
  const { data: session } = useQuery(trpc.auth.session.queryOptions());

  return (
    <nav className="flex justify-between h-20 font-medium bg-white border-b">
      <Link className="flex items-center pl-6" href="/">
        <span className={cn("text-5xl font-semibold", poppins.className)}>
          funRoad
        </span>
      </Link>
      <NavbarSidebar
        items={navbarItems}
        open={isSidebarOpen}
        onOpenChange={setIsSidebarOpen}
      />
      {/* links */}
      <div className="items-center hidden lg:flex gap-4">
        {navbarItems.map((item) => (
          <NavbarItem
            key={item.href}
            href={item.href}
            item={item.page}
            isActive={item.href === currentPath}
          />
        ))}
      </div>

      {session?.user ? (
        <div className="hidden lg:flex">
          <Button
            asChild
            className="h-full px-12 text-lg text-white transition-colors bg-black border-t-0 border-b-0 border-l border-r-0 rounded-none hover:bg-pink-400 hover:text-black"
          >
            <Link href="/admin">Dashboard</Link>
          </Button>
        </div>
      ) : (
        <div className="hidden lg:flex">
          <Button
            asChild
            variant={"secondary"}
            className="h-full px-12 text-lg transition-colors bg-white border-t-0 border-b-0 border-l border-r-0 rounded-none hover:bg-pink-400"
          >
            <Link prefetch href="/sign-in">
              Log in
            </Link>
          </Button>
          <Button
            asChild
            className="h-full px-12 text-lg text-white transition-colors bg-black border-t-0 border-b-0 border-l border-r-0 rounded-none hover:bg-pink-400 hover:text-black"
          >
            <Link prefetch href="/sign-up">
              Start Selling
            </Link>
          </Button>
        </div>
      )}

      <div className="flex items-center justify-center mr-4 lg:hidden">
        <Button
          variant={"ghost"}
          className="bg-white border-transparent size-12"
          onClick={() => setIsSidebarOpen(true)}
        >
          <MenuIcon />
        </Button>
      </div>
    </nav>
  );
}
interface NavbarItemProps {
  href: string;
  item: string;
  isActive?: boolean;
}

const NavbarItem = ({ href, item, isActive }: NavbarItemProps) => (
  <Button
    asChild
    variant={"outline"}
    className={cn(
      "hover:border-primary rounded-full border-transparent bg-transparent px-3.5 text-lg hover:bg-transparent",
      isActive && "bg-black text-white hover:bg-black hover:text-white"
    )}
  >
    <Link href={href}>{item}</Link>
  </Button>
);
