/* eslint-disable @typescript-eslint/no-explicit-any */
// This file is used to connect to MongoDB using the MongoDB Node.js driver.
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI as string;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your MongoDB URI to .env.local");
}

if (process.env.NODE_ENV === "development") {
  if (!(global as any)._MongoClientPromise) {
    client = new MongoClient(uri, options);
    (global as any)._MongoClientPromise = client.connect();
  }
  clientPromise = (global as any)._MongoClientPromise;
} else {
  client = new MongoClient(uri, options);
  clientPromise = client.connect();
}

export async function getDb() {
  const client = await clientPromise;
  return client.db("barcode_inventory");
}
