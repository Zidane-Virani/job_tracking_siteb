import { BriefcaseIcon } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";


export default function Navbar() {
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
            </div>
        </nav>
    );
}
