import dns from "node:dns";
import mongoose, { type Mongoose } from "mongoose";

// This machine's local dev DNS stub (127.0.0.1) refuses the SRV query
// mongodb+srv:// needs, even though the OS resolver handles it fine.
// Not an issue on Vercel (proper DNS there) — dev-only workaround.
const isDev = process.env.NODE_ENV !== "production";
if (isDev) {
  dns.setServers(["8.8.8.8", "1.1.1.1"]);
}

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) throw new Error("MONGODB_URI is not defined");

const MONGODB_DB = process.env.MONGODB_DB;
if (!MONGODB_DB) throw new Error("MONGODB_DB is not defined");

type MongooseCache = {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
};

declare global {
  var mongoose: MongooseCache | undefined;
}

const cached: MongooseCache = global.mongoose ?? { conn: null, promise: null };
global.mongoose = cached;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function connect(): Promise<Mongoose> {
  // On this machine, the first DNS query right after dns.setServers() above
  // can still land on the old (refusing) resolver — a plain wait-and-retry
  // isn't enough (verified empirically), but re-calling dns.setServers()
  // again before retrying reliably forces c-ares to pick up the new servers.
  // Dev-only; irrelevant on Vercel where the OS resolver works fine.
  const attempts = isDev ? 4 : 1;
  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await mongoose.connect(MONGODB_URI!, { dbName: MONGODB_DB });
    } catch (error) {
      if (attempt === attempts) throw error;
      if (isDev) dns.setServers(["8.8.8.8", "1.1.1.1"]);
      await sleep(300);
    }
  }
  throw new Error("unreachable");
}

export async function dbConnect(): Promise<Mongoose> {
  if (cached.conn) return cached.conn;
  cached.promise ??= connect().catch((error) => {
    // Don't let a failed attempt poison the cache — global.mongoose survives
    // hot reload on purpose, so a stuck rejected promise would otherwise
    // fail every request forever until the dev server process restarts.
    cached.promise = null;
    throw error;
  });
  cached.conn = await cached.promise;
  return cached.conn;
}
