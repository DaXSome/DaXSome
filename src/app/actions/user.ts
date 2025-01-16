"use server";

import { clerkClient } from "@clerk/clerk-sdk-node";

export async function getUser(id: string) {
  const user = await clerkClient.users.getUser(id);

  return { username: user.username, avatar: user.imageUrl };
}
