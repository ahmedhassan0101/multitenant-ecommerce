import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { headers as getHeaders } from "next/headers";
import { loginSchema, registerSchema } from "../schemas";
import { TRPCError } from "@trpc/server";
import { cookies as getCookies } from "next/headers";

const ERROR_MESSAGES = {
  USERNAME_TAKEN: "Username already taken",
  INVALID_CREDENTIALS: "Invalid email or password",
};

export const authRouter = createTRPCRouter({
  session: baseProcedure.query(async ({ ctx }) => {
    const headers = await getHeaders();
    const session = await ctx.payload.auth({ headers });
    return session;
  }),

  register: baseProcedure
    .input(registerSchema)
    .mutation(async ({ ctx, input }) => {
      // Check if username already exists
      const existingUser = await ctx.payload.find({
        collection: "users",
        limit: 1,
        where: { username: { equals: input.username } },
      });

      if (existingUser?.docs[0]) {
        throw new TRPCError({
          code: "CONFLICT",
          message: ERROR_MESSAGES.USERNAME_TAKEN,
        });
      }

      // Create new user
      await ctx.payload.create({
        collection: "users",
        data: {
          email: input.email,
          password: input.password,
          username: input.username,
        },
      });

      // Log in the user after registration
      const data = await ctx.payload.login({
        collection: "users",
        data: {
          email: input.email,
          password: input.password,
        },
      });
      if (!data.token) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: ERROR_MESSAGES.INVALID_CREDENTIALS,
        });
      }

      // Set authentication cookie
      await generateAuthCookie({
        prefix: ctx.payload.config.cookiePrefix,
        value: data.token,
      });
    }),

  login: baseProcedure.input(loginSchema).mutation(async ({ ctx, input }) => {
    // Authenticate user
    const data = await ctx.payload.login({
      collection: "users",
      data: {
        email: input.email,
        password: input.password,
      },
    });
    if (!data.token) {
      throw new TRPCError({
        code: "UNAUTHORIZED",
        message: ERROR_MESSAGES.INVALID_CREDENTIALS,
      });
    }
    
    // Set authentication cookie
    await generateAuthCookie({
      prefix: ctx.payload.config.cookiePrefix,
      value: data.token,
    });

    return data;
  }),
});

interface AuthCookieProps {
  prefix: string;
  value: string;
}

const generateAuthCookie = async ({ prefix, value }: AuthCookieProps) => {
  const cookies = await getCookies();
  cookies.set({
    name: `${prefix}-token`,
    value,
    httpOnly: true,
    path: "/",
    // TODO: Ensure cross-domain cookie sharing
    // sameSite: "none",
    // domain: ""
  });
};
