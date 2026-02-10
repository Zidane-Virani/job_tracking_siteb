import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./lib/auth/auth";

export default async function proxy(req: NextRequest){
    const session = await getSession();


    const isDashBoard = req.nextUrl.pathname.startsWith("/dashboard");
    if (isDashBoard &&!session?.user){
        return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    const isSignIn = req.nextUrl.pathname.startsWith("/sign-in");
    const isSignUp = req.nextUrl.pathname.startsWith("/sign-up");

    if (isSignIn || isSignUp && session?.user){
        return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
}