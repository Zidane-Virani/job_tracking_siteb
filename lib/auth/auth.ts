import { betterAuth } from "better-auth";
import { MongoClient, Db } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import initializeBoard from "../intial-board";

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let clientPromise: Promise<MongoClient>;

if (process.env.NODE_ENV === "production") {
  clientPromise = new MongoClient(process.env.MONGODB_URI!).connect();
} else {
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = new MongoClient(process.env.MONGODB_URI!).connect();
  }
  clientPromise = global._mongoClientPromise;
}

const client = await clientPromise;
const db: Db = client.db();

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client
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

export async function getSession(){
  const result = await auth.api.getSession({
    headers: await headers()
  });

  return result;
}

export async function signOut(){
  const result = await auth.api.signOut({
    headers: await headers()
  });

  if (result.success){
    redirect("/sign-in");
  }


  return result;
}