import { getAuth } from "@/lib/auth/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const GET = async (req: Request) => {
  const auth = await getAuth();
  const handler = toNextJsHandler(auth);
  return handler.GET(req);
};

export const POST = async (req: Request) => {
  const auth = await getAuth();
  const handler = toNextJsHandler(auth);
  return handler.POST(req);
};
