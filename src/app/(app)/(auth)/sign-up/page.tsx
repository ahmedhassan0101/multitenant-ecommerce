import SignUpForm from "@/modules/auth/ui/sign-up-form";
import { caller } from "@/trpc/server";
import { redirect } from "next/navigation";
export const dynamic = "force-dynamic";
export default async function SignUpPage() {
    const session = await caller.auth.session();

  if (session.user) {
    redirect("/");
  }
  return <SignUpForm />;
}
