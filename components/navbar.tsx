"use client";

import { BriefcaseIcon, LogOutIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { getSession } from "@/lib/auth/auth";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuItem } from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";
import SignOutBtn from "./sign-out-btn";
import { useSession } from "@/lib/auth/auth-client";


export default function Navbar() {
    const { data: session } = useSession();
    return (
        <nav className = "border-b border-gray-200 bg-white">
            <div className = "container mx-auto flex h-16 items-center justify-between">
                <Link
                  href="/"
                  className="flex items-center gap-2 text-xl font-semibold"
                  style={{ color: "oklch(0.205 0 0)" }}
                >
                  <BriefcaseIcon className="w-6 h-6" />
                </Link>

                {!session?.user ? (
                  <>
                    <div className="flex items-center gap-4">
                        <Link href="/sign-in">
                            <Button variant="ghost" className="text-gray-700 hover:text-gray-900">
                                Log In
                            </Button>
                        </Link>
                        <Link href="/sign-up">
                            <Button className="bg-primary text-white hover:bg-primary/90">
                                Start for Free
                            </Button>
                        </Link>
                    </div>
                  </>
                ) : (
                  <>
                    <Link href="/dashboard">
                        <Button variant="ghost">
                            Dashboard
                        </Button>
                    </Link>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="rounded-full h-10 w-10 p-0">
                                <Avatar className="h-9 w-9 bg-black">
                                    <AvatarFallback className="bg-black text-white font-semibold text-sm">
                                        {session?.user?.name?.charAt(0)}
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuLabel>
                                <div>
                                        <p>{session.user.name!}</p>
                                        <p>{session.user.email!}</p>
                                </div>
                            </DropdownMenuLabel>
                            <SignOutBtn />
                        </DropdownMenuContent>
                    </DropdownMenu>
                  </>
                )}
            </div>
        </nav>
    );
}
