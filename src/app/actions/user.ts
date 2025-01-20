"use server";

import { currentUser } from "@clerk/nextjs/server";
import { clerkClient } from "@clerk/clerk-sdk-node";
import connectToDb from "@/backend/config/connectDb";
import { entriesSchema } from "@/backend/models/databases";

/**
 * Given a Clerk user ID, returns a simple object with the username and avatar image URL.
 * @param id The Clerk user ID.
 * @returns An object with `username` and `avatar` properties.
 */
export async function getUser(id: string) {
  const user = await clerkClient.users.getUser(id);

  return { username: user.username, avatar: user.imageUrl };
}

/**
 * Given a Clerk user ID, returns a list of databases that belong to that user.
 * @returns An array of objects with `user_id` and `database` properties.
 */
export async function getUserDbs() {
  const connection = await connectToDb("databases");

  const user = await currentUser();

  if (!user) return;

  const databases = await connection.model("entries", entriesSchema).find();

  return databases;
}

/**
 * Returns an array of strings representing the names of all collections
 * in a given MongoDB database.
 * @param db The name of the database.
 * @returns An array of strings.
 */
export const getCollections = async (db: string) => {
  const conn = await connectToDb(db);

  if (!conn.db) throw new Error("Database connection failed");

  const cursor = conn.db.listCollections();
  const collections = await cursor.toArray();

  return collections.map((collection) => collection.name);
};

/**
 * Retrieves a limited set of documents from a specified collection within a MongoDB database.
 *
 * @param db - The name of the database to connect to.
 * @param collection - The name of the collection from which to fetch documents.
 * @returns An object containing:
 *  - `data`: An array of documents from the collection, each with its `_id` field converted to a string.
 *  - `count`: The total number of documents in the collection.
 */
export const getData = async (databaseName: string, collectionName: string) => {
  const connection = await connectToDb(databaseName);

  if (!connection.db) {
    throw new Error("Database connection failed");
  }

  const collection = connection.db.collection(collectionName);

  const [data, count] = await Promise.all([
    collection.find().limit(10).toArray(),
    collection.countDocuments(),
  ]);

  return {
    data: data.map((document) => ({
      ...document,
      _id: document._id.toString(),
    })) as Record<string, unknown>[],
    count,
  };
};
