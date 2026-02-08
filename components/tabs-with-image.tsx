"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { useState } from "react";

export default function TabsWithImage() {
  const [activeTab, setActiveTab] = useState("organize");

  return (
    <section className="container mx-auto px-4">
      <div className="mx-auto max-w-4xl">
        <div className="flex gap-2 justify-center mb-8">
          <Button
            variant={activeTab === "organize" ? "default" : "outline"}
            onClick={() => setActiveTab("organize")}
            className={`rounded-lg px-6 py-3 text-sm font-medium 
              ${activeTab === "organize" 
                ? "bg-primary text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
          >
            Organize Applications
          </Button>
          <Button
            variant={activeTab === "hired" ? "default" : "outline"}
            onClick={() => setActiveTab("hired")}
            className={`rounded-lg px-6 py-3 text-sm font-medium 
              ${activeTab === "hired" 
                ? "bg-primary text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
          >
            Get Hired
          </Button>
          <Button
            variant={activeTab === "boards" ? "default" : "outline"}
            onClick={() => setActiveTab("boards")}
            className={`rounded-lg px-6 py-3 text-sm font-medium 
              ${activeTab === "boards" 
                ? "bg-primary text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
          >
            Manage Boards
          </Button>
        </div>
        <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-lg">
          {activeTab === "organize" && (
            <Image src="/hero-images/hero1.png" alt="Organize Applications" fill className="object-cover" />
          )}
          {activeTab === "hired" && (
            <Image src="/hero-images/hero2.png" alt="Get Hired" fill className="object-cover" />
          )}
          {activeTab === "boards" && (
            <Image src="/hero-images/hero3.png" alt="Manage Boards" fill className="object-cover" />
          )}
        </div>
      </div>
    </section>
  );
}
