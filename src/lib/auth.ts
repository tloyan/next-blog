import db from "@/db";
import { APIError, betterAuth } from "better-auth";
import { createAuthMiddleware, magicLink, openAPI } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { Resend } from "resend";
import MagicLinkEmailTemplate from "@/components/emails/magic-link";
import ResetPasswordTemplate from "@/components/emails/reset-password";
import z from "zod";

const resend = new Resend(process.env.RESEND_API_KEY!);

const passwordSchema = z.object({
  password: z
    .string()
    .min(8, "At least  8 character expected")
    .max(30, "Could not exceed 30 characters")
    .regex(/[A-Z]/, "At least one uppercase expected")
    .regex(/[a-z]/, "At least one lowercase expected")
    .regex(/[0-9]/, "At least one digit expected")
    .regex(/[!@#$%^&*]/, "At least one symbol expected"),
});

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
    async sendResetPassword({ user, url }) {
      await resend.emails.send({
        from: `next-blog <${process.env.SENDER_MAIL}>`,
        to: [user.email],
        subject: "next-blog reset password link",
        react: ResetPasswordTemplate({ url }),
      });
    },
  },
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  plugins: [
    magicLink({
      async sendMagicLink({ email, url }) {
        try {
          const res = await resend.emails.send({
            from: `next-blog <${process.env.SENDER_MAIL}>`,
            to: [email],
            subject: "next-blog Magic Link",
            react: MagicLinkEmailTemplate({ url: url }),
          });
        } catch (error) {
          console.error(error);
        }
      },
    }),
    openAPI(),
  ],
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/sign-up/email") {
        const password = ctx.body?.password;
        const res = passwordSchema.safeParse({ password });
        if (!res.success) {
          throw new APIError("BAD_REQUEST", {
            message: "Invalid request",
          });
        }
      }
    }),
  },
});
