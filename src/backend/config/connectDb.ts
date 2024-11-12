import mongoose from "mongoose";

const connectToDb = async (dbName = "datasets") => {
  const DB_URI = process.env.DB_URI as string;

  if (!DB_URI) throw new Error("Missing database uri");

  const connection = mongoose.createConnection(DB_URI, {
    dbName,
    appName: dbName,
  });

  return new Promise<mongoose.Connection>((resolve, reject) => {
    connection.on("connecting", function () {
      console.log("Connecting to database...");
    });

    connection.on("connected", function () {
      console.log("Connected to database", connection.name);
      resolve(connection);
    });

    connection.on("error", function (err) {
      console.error("Error in database connection: " + err);
      reject(err);
    });

    connection.on("disconnected", function () {
      console.log("Disconnected from database");
      reject("disconnected");
    });
  });
};

export default connectToDb;
