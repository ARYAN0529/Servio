import mongoose from "mongoose";

const uri = process.env.MONGODB_URI;
if (!uri) throw new Error("MONGODB_URI is not set in .env");

// Next.js hot-reloads in dev and serverless functions reuse warm instances.
// Caching the connection on globalThis stops us from opening a new
// connection to Atlas on every reload or request.
const cache = (globalThis as any)._mongoose ?? { conn: null, promise: null };
(globalThis as any)._mongoose = cache;

export async function connectDB() {
  if (cache.conn) return cache.conn; // reuse the existing connection
  cache.promise ??= mongoose.connect(uri!, { bufferCommands: false });
  cache.conn = await cache.promise;
  return cache.conn;
}