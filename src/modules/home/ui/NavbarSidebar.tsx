"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@radix-ui/react-scroll-area";
import Link from "next/link";

interface NavbarSidebarProps {
  items: { href: string; page: string }[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
export function NavbarSidebar({
  items,
  open,
  onOpenChange,
}: NavbarSidebarProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side={"left"}>
        <SheetHeader className="border-b p-4">
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>

        <ScrollArea className="flex h-full flex-col overflow-y-auto pb-2">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center w-full p-4 text-left text-base font-medium text-black hover:bg-black hover:text-white"
              onClick={() => onOpenChange(false)}
            >
              {item.page}
            </Link>
          ))}

          <div className="border-t">
            <Link
              href="/sign-in"
              className="flex w-full items-center p-4 text-left text-base font-medium hover:bg-black hover:text-white"
              onClick={() => onOpenChange(false)}
            >
              Log in
            </Link>
            <Link
              href="/sign-up"
              className="flex w-full items-center p-4 text-left text-base font-medium hover:bg-black hover:text-white"
              onClick={() => onOpenChange(false)}
            >
              Start Selling
            </Link>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
