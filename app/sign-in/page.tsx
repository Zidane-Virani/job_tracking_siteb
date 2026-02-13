"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth/auth-client";
import { getAuthErrorMessage } from "@/lib/auth/get-auth-error-message";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";


export default function SignIn() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>){
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const result = await signIn.email({
                email,
                password,
                callbackURL: "/dashboard",
            });

            if (result.error) {
                setError(getAuthErrorMessage(result.error, "Failed to sign in"));
            } else {
                router.refresh();
                router.push("/dashboard");
            }
        } catch (error) {
            console.error("Failed to sign in:", error);
            setError(getAuthErrorMessage(error, "Failed to sign in"));
        } finally {
            setLoading(false);
        }

    }
    return (
        <div className = "flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gray-50 p-4">
            <Card className="w-full max-w-md shadow-lg border border-gray-200">
                <CardHeader className="space-y-1 pb-6">
                    <CardTitle className="text-2xl font-bold"> Sign In </CardTitle>
                        <CardDescription className="text-muted-foreground">
                            Welcome back! Sign in to your account
                        </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                            <Input value={email} onChange={(e) => setEmail(e.target.value)} id="email"type="email" placeholder="Enter your email" required className="h-10 rounded-md border-gray-300 focus:border-black focus:ring-black"/>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                            <Input value={password} onChange={(e) => setPassword(e.target.value)} id="password"type="password" placeholder="Enter your password" required className="h-10 rounded-md border-gray-300 focus:border-black focus:ring-black"/>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4 pt-2">
                        <Button disabled={loading} type="submit" className="w-full h-10 bg-black text-white hover:bg-gray-800 rounded-md font-medium">{loading ? "Signing In..." : "Sign In"}</Button>
                        <p className="text-sm text-center text-muted-foreground">
                            Don&apos;t have an account?<Link href="/sign-up" className="ml-1 text-black font-medium hover:underline">Sign Up</Link>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
