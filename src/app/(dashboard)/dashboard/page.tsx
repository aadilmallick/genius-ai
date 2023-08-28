import React from "react";
import { UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import CardsArray from "@/components/myComponents/dashboard/CardsArray";
const page = () => {
  return (
    <section className="py-12">
      <div className="text-center">
        <h2 className="text-2xl font-bold md:text-4xl">
          Explore the power of AI
        </h2>
        <p className="text-gray-400">Chat with the smartest AI</p>
      </div>
      <CardsArray />
    </section>
  );
};

export default page;
