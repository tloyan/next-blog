import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function isOwner(resourceOwnerId: string) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) return false;
  return session?.user.id === resourceOwnerId;
}
