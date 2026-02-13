import { betterAuth } from "better-auth";
import { MongoClient, Db } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import initializeBoard from "../intial-board";

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

let _clientPromise: Promise<MongoClient> | null = null;

function getClientPromise(): Promise<MongoClient> {
  if (process.env.NODE_ENV === "production") {
    if (!_clientPromise) {
      _clientPromise = new MongoClient(process.env.MONGODB_URI!).connect();
    }
    return _clientPromise;
  } else {
    if (!global._mongoClientPromise) {
      global._mongoClientPromise = new MongoClient(process.env.MONGODB_URI!).connect();
    }
    return global._mongoClientPromise;
  }
}

let _auth: ReturnType<typeof betterAuth> | null = null;

async function getAuth() {
  if (_auth) return _auth;

  const client = await getClientPromise();
  const db: Db = client.db();

  _auth = betterAuth({
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