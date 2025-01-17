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

export const getCollections = async (db: string) => {
  const conn = await connectToDb(db);

  if (!conn.db) throw new Error("Database connection failed");

  const cursor = conn.db.listCollections();
  const collections = await cursor.toArray();

  return collections.map((collection) => collection.name);
};

export const getData = async (db: string, collection: string) => {
  const conn = await connectToDb(db);

  if (!conn.db) throw new Error("Database connection failed");

  const cursor = conn.db.collection(collection).find().limit(10);

  try {
    const data = await cursor.toArray();

    return {
      data: data.map((data) => ({ ...data, _id: data._id.toString() })),
      count: await conn.db.collection(collection).countDocuments(),
    };
  } catch (e) {
    console.log(e);
    return { data: [], count: 0 };
  }
};
