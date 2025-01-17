"use server";

import { currentUser } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/clerk-sdk-node";
import mongoose from "mongoose";
import connectToDb from "@/backend/config/connectDb";
import { entriesSchema } from "@/backend/models/databases";

export async function getUser(id: string) {
  const user = await clerkClient.users.getUser(id);

  return { username: user.username, avatar: user.imageUrl };
}

export async function getUserDbs() {
  const connection = await connectToDb("databases");

  const user = await currentUser();

  if (!user) return;

  const databases = await connection.model("entries", entriesSchema).find();

  return databases;
}
