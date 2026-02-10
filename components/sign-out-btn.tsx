"use client";

import { DropdownMenuItem } from "./ui/dropdown-menu";
import { signOut } from "@/lib/auth/auth-client";
import { LogOutIcon } from "lucide-react";
import { useRouter } from "next/navigation";


export default function SignOutBtn() {
    const router = useRouter();
    return (
        <DropdownMenuItem 
            onClick={async () => {
                const result = await signOut();
                if (result.data) {
                    router.push("/sign-in");
                }
            }}
        >
            <LogOutIcon className="w-4 h-4 mr-2" />
            Log Out
        </DropdownMenuItem>
    )
}