import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import connectDB from "../db";
import initializeBoard from "../intial-board";

let _auth: ReturnType<typeof betterAuth> | null = null;

async function getAuth() {
  if (_auth) return _auth;

  const mongooseInstance = await connectDB();
  const client = mongooseInstance.connection.getClient() as any;
  const db = client.db();

  _auth = betterAuth({
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