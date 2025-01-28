"use server";

import { clerkClient } from "@clerk/express";

/**
 * Given a Clerk user ID, returns a simple object with the username and avatar image URL.
 * @param id The Clerk user ID.
 * @returns An object with `username` and `avatar` properties.
 */
export async function getUser(id: string) {
  const user = await clerkClient.users.getUser(id);

  return { username: user.username, avatar: user.imageUrl };
}

