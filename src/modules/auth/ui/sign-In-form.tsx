"use client";
import { Poppins } from "next/font/google";
import React from "react";
import { useForm } from "react-hook-form";
import { loginSchema } from "../schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["700"],
  preload: true,
});
type LoginFormData = z.infer<typeof loginSchema>;

export default function SignInForm() {
  const router = useRouter();

  const queryClient = useQueryClient();
  const trpc = useTRPC();

  const login = useMutation(
    trpc.auth.login.mutationOptions({
      onError: (error) => {
        toast.error(error.message, {
          position: "bottom-left",
        });
      },
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.auth.session.queryFilter());
        router.push("/");
      },
    })
  );

  const form = useForm<LoginFormData>({
    mode: "all",
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (formData: LoginFormData) => {
    login.mutate(formData);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-8 p-4 lg:p-16"
      >
        <div className="flex items-center justify-between mb-8">
          <Link href="/">
            <span className={cn("text-2xl font-semibold", poppins.className)}>
              funRoad
            </span>
          </Link>
          <Button
            variant={"ghost"}
            size={"sm"}
            className="text-base underline border-none"
            asChild
          >
            <Link href="/sign-up" prefetch>
              Sign up
            </Link>
          </Button>
        </div>
        <h1 className="text-4xl font-medium">Welcome back to Funroad.</h1>
        <FormField
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">Password</FormLabel>
              <FormControl>
                <Input {...field} type="password" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          variant={"elevated"}
          size={"lg"}
          className="text-white bg-black hover:text-primary hover:bg-pink-400"
          disabled={login.isPending}
        >
          Login
        </Button>
      </form>
    </Form>
  );
}
