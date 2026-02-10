import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import initializeBoard from "../intial-board";

const client = new MongoClient(process.env.MONGODB_URI!);
const db = client.db();

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client
  }),
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