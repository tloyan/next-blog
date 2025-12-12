import db from "@/db";
import { betterAuth } from "better-auth";
import { magicLink } from "better-auth/plugins";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { Resend } from "resend";
import MagicLinkEmailTemplate from "@/components/emails/magic-link";

const resend = new Resend(process.env.RESEND_API_KEY!);

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
  }),
  emailAndPassword: {
    enabled: true,
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
          console.log("resend result", res);
        } catch (error) {
          console.error(error);
        }
      },
    }),
  ],
});
