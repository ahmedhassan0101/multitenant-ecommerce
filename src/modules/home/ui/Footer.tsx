import Link from "next/link";
import { poppins } from "./Navbar";
import { cn } from "@/lib/utils";

export default function Footer() {
  return (
    <footer className="border-t font-medium bg-white">
      <div className="max-w-(--breakpoint-xl) mx-auto flex items-center h-full gap-2 px-4 py-6 lg:px-12">
        {/* Branding text and link to main site */}
        <p>Power by</p>
        <Link href={"/"}>
          <span className={cn("text-2xl font-semibold", poppins.className)}>
            funroad
          </span>
        </Link>
      </div>
    </footer>
  );
}
