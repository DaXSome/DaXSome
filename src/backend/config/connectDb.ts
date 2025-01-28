import { MongoClient, Db } from "mongodb";

let client: MongoClient | null = null;
let db: Db | null = null;

const connectToDb = async (): Promise<Db> => {
  if (db) {
    console.log("Reusing existing database connection.");
    return db;
  }

  try {
    console.log("Connecting to MongoDB...");
    client = new MongoClient(process.env.DB_URI as string);
    await client.connect();

    db = client.db("entries");
    console.log("Successfully connected to MongoDB.");
    return db;
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
    throw error;
  }
};

export default connectToDb;
