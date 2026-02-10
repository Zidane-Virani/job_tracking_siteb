"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signUp } from "@/lib/auth/auth-client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";


export default function SignUp() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");


    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const router = useRouter();

    async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>){
        e.preventDefault();

        setError("");
        setLoading(true);

        try{
            const result = await signUp.email({
                name,
                email,
                password,
            })
            if(result.error){
                setError(result.error.message || "Failed to sign up");
            }else{
                router.push("/dashboard");
            }

        }catch(error){
            setError("Failed to sign up");
        }finally{
            setLoading(false);
        }

    }
 
    return (
        <div className = "flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gray-50 p-4">
            <Card className="w-full max-w-md shadow-lg border border-gray-200">
                <CardHeader className="space-y-1 pb-6">
                    <CardTitle className="text-2xl font-bold"> Sign Up </CardTitle>
                        <CardDescription className="text-muted-foreground">
                            Create an account to start tracking your job applications
                        </CardDescription>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        {error && <p className="text-red-500 text-sm">{error}</p>}
                        <div className="space-y-2">
                            <Label htmlFor="name" className="text-sm font-medium">Name</Label>
                            <Input value={name} onChange={(e) => setName(e.target.value)} id="name"type="text" placeholder="Enter your name" required className="h-10 rounded-md border-gray-300 focus:border-black focus:ring-black"/>
                        </div>
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
                        <Button type="submit" className="w-full h-10 bg-black text-white hover:bg-gray-800 rounded-md font-medium" disabled={loading}>{loading ? "Signing Up..." : "Sign Up"}</Button>
                        <p className="text-sm text-center text-muted-foreground">
                            Already have an account?<Link href="/sign-in" className="ml-1 text-black font-medium hover:underline">Sign In</Link>
                        </p>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
