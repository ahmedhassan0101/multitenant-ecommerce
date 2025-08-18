import { baseProcedure, createTRPCRouter } from "@/trpc/init";
import { headers as getHeaders } from "next/headers";
import { loginSchema, registerSchema } from "../schemas";
import { TRPCError } from "@trpc/server";
import { cookies as getCookies } from "next/headers";
import { stripe } from "@/lib/stripe";

const ERROR_MESSAGES = {
  USERNAME_TAKEN: "Username already taken",
  INVALID_CREDENTIALS: "Invalid email or password",
};

export const authRouter = createTRPCRouter({
  session: baseProcedure.query(async ({ ctx }) => {
    const headers = await getHeaders();

    // const headersObj = Object.fromEntries(headers.entries());
    const session = await ctx.payload.auth({ headers });

    // console.log("📦 Headers:", JSON.stringify(headersObj, null, 2));
    // console.log("👤 Session:", JSON.stringify(session, null, 2));

    return session;
  }),

  register: baseProcedure
    .input(registerSchema)
    .mutation(async ({ ctx, input }) => {
      const { username, email, password } = input;
      // Check if username already exists
      const existingUser = await ctx.payload.find({
        collection: "users",
        limit: 1,
        where: { username: { equals: username } },
      });

      if (existingUser?.docs[0]) {
        throw new TRPCError({
          code: "CONFLICT",
          message: ERROR_MESSAGES.USERNAME_TAKEN,
        });
      }

      // Create a new Stripe account for the user
      const account = await stripe.accounts.create({});

      // If the Stripe account creation fails, throw an error
      if (!account) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create Stripe account",
        });
      }

      // Create a new tenant for the user

      const tenant = await ctx.payload.create({
        collection: "tenants",
        data: {
          name: username,
          slug: username,
          stripeAccountId: account.id,
        },
      });

      // Create new user
      await ctx.payload.create({
        collection: "users",
        data: {
          email: email,
          password: password,
          username: username,
          tenants: [{ tenant: tenant.id }], // Link the created tenant to the user
        },
      });

      // Log in the user after registration
      const data = await ctx.payload.login({
        collection: "users",
        data: {
          email: email,
          password: password,
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
    const { email, password } = input;
    // Authenticate user
    const data = await ctx.payload.login({
      collection: "users",
      data: {
        email: email,
        password: password,
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

  logout: baseProcedure.mutation(async ({ ctx }) => {
    try {
      // Clear the authentication cookie (this effectively logs out the user)
      await clearAuthCookie({
        prefix: ctx.payload.config.cookiePrefix,
      });

      return { success: true };
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: `Failed to logout: ${error}`,
      });
    }
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

const clearAuthCookie = async ({ prefix }: { prefix: string }) => {
  const cookies = await getCookies();
  cookies.delete(`${prefix}-token`);
};
