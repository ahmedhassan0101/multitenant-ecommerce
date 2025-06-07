import SignInForm from "@/modules/auth/ui/sign-In-form";
import { caller } from "@/trpc/server";
import { redirect } from "next/navigation";

export default async function SignInPage() {
    const session = await caller.auth.session();

  if (session.user) {
    redirect("/");
  }
  return <SignInForm/>
}