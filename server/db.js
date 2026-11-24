import "dotenv/config";
import { MongoClient } from "mongodb";

const client = new MongoClient(process.env.MONGO_URI || "mongodb://127.0.0.1:27017");
await client.connect();

export const db = client.db(process.env.DB_NAME || "nativePlantDB");
export const plants = db.collection("plants");
export const admins = db.collection("admins");

// Usernames must be unique
await admins.createIndex({ username: 1 }, { unique: true });
console.log(`Connected to MongoDB: ${db.databaseName}`);
