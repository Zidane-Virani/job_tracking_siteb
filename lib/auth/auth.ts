import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import type { Db, MongoClient } from "mongodb";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import connectDB from "../db";
import initializeBoard from "../intial-board";

let _auth: ReturnType<typeof betterAuth> | null = null;

function getOrigin(value?: string | null) {
  if (!value) return null;

  try {
    return new URL(value).origin;
  } catch {
    return null;
  }
}

function getTrustedOrigins(request?: Request) {
  const defaults = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3001",
  ];

  const envOrigins = [
    getOrigin(process.env.BETTER_AUTH_URL),
    getOrigin(process.env.NEXT_PUBLIC_BETTER_AUTH_URL),
  ];
  const requestOrigin = request ? getOrigin(request.url) : null;

  return [...new Set([...defaults, ...envOrigins, requestOrigin].filter(Boolean))] as string[];
}

async function getAuth() {
  if (_auth) return _auth;

  const mongooseInstance = await connectDB();
  // Mongoose and better-auth may resolve different mongodb type packages,
  // so cast through unknown to keep runtime object while avoiding type conflicts.
  const client = mongooseInstance.connection.getClient() as unknown as MongoClient;
  const db = client.db() as Db;

  _auth = betterAuth({
    baseURL: process.env.BETTER_AUTH_URL || process.env.NEXT_PUBLIC_BETTER_AUTH_URL,
    trustedOrigins: async (request) => getTrustedOrigins(request),
    database: mongodbAdapter(db, {
      client,
    }),
    session: {
      cookieCache: {
        enabled: true,
        maxAge: 60 * 60
      }
    },
    emailAndPassword: {
      enabled: true,
    },
    databaseHooks: {
      user: {
        create: {
          after: async (user) => {
            if (!user.id) return;
            await initializeBoard(user.id);
          }
        }
      }
    }
  });

  return _auth;
}

export { getAuth };

export async function getSession(){
  const auth = await getAuth();
  const result = await auth.api.getSession({
    headers: await headers()
  });

  return result;
}

export async function signOut(){
  const auth = await getAuth();
  const result = await auth.api.signOut({
    headers: await headers()
  });

  if (result.success){
    redirect("/sign-in");
  }


  return result;
}
