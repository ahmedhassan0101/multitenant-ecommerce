"use client";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import Link from "next/link";
import React from "react";
import { registerSchema } from "../schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { toast } from "sonner";
import { poppins } from "@/modules/home/ui/Navbar";

type SignUpFormData = z.infer<typeof registerSchema>;

export default function SignUpForm() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const trpc = useTRPC();

  const register = useMutation(
    trpc.auth.register.mutationOptions({
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

  const form = useForm<SignUpFormData>({
    mode: "all",
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: "",
      password: "",
      username: "",
    },
  });
  const onSubmit = (formData: z.infer<typeof registerSchema>) => {
    register.mutate(formData);
  };

  const username = form.watch("username");
  const usernameErrors = form.formState.errors.username;
  const showPreview = username && !usernameErrors;
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
            <Link href="/sign-in" prefetch>
              Sign in
            </Link>
          </Button>
        </div>
        <h1 className="text-4xl font-medium">
          Join over 1,508 creators earning money on funRoad
        </h1>
        <FormField
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base">Username</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription className={cn("hidden", showPreview && "block")}>
                Your store will be available at&nbsp;{" "}
                <strong>{username}</strong>
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

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
          disabled={register.isPending}
        >
          Create account
        </Button>
      </form>
    </Form>
  );
}
