import { Button } from "@/components/ui/button";
import { ArrowRight, BriefcaseIcon, TrendingUp, CheckCircle } from "lucide-react";
import Link from "next/link";
import TabsWithImage from "@/components/tabs-with-image";

export default function Home() {
  return <div className = "flex min-h-screen flex-col bg-white">
    <main className = "flex-1">
      <section className = "container mx-auto px-4 py-32">
        <div className = "mx-auto text-center max-w-4xl">
          <h1 className = "text-black mb-6 text-6xl font-bold">Tracking Your Job Applications</h1>
          <p className = "text-muted-foreground mb-8 text-xl">Stay organized and never miss a Job Application.</p>
        <div className = "flex flex-col items-center gap-4c">
          <Link href="/sign-up">
            <Button size="lg" className="h-12 px-8 text-lg font-medium bg-[oklch(0.205_0_0)]">
                Start for free <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <p className = "text-sm text-muted-foreground mt-4">Free Forever. No Credit Card Required.</p>
        </div>
        </div>
      </section>
      <TabsWithImage />

      <section className="container mx-auto px-4 py-24">
        <div className="mx-auto max-w-4xl space-y-16">
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-pink-50 p-3">
              <BriefcaseIcon className="h-6 w-6 text-pink-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-black">Organize Applications</h3>
              <p className="mt-2 text-muted-foreground">
                Create custom boards and columns to track your job applications at every stage of the process.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-pink-50 p-3">
              <TrendingUp className="h-6 w-6 text-pink-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-black">Track Progress</h3>
              <p className="mt-2 text-muted-foreground">
                Monitor your application status from applied to interview to offer with visual Kanban boards.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-pink-50 p-3">
              <CheckCircle className="h-6 w-6 text-pink-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-black">Stay Organized</h3>
              <p className="mt-2 text-muted-foreground">
                Never lose track of an application. Keep all your job search information in one centralized place.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>;
}
