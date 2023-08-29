import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { auth } from "@clerk/nextjs";
import { motion } from "framer-motion";
import MotionPractice from "./MotionPractice";
import Image from "next/image";
import TypeWriterComponent from "@/components/myComponents/TypeWriterComponent";
const Landing = () => {
  const session = auth();
  return (
    <section className="min-h-screen bg-slate-900">
      <div className="max-w-6xl mx-auto p-2 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <div className="relative w-10 h-10">
            <Image src={"/logo.png"} fill alt="logo" sizes="2.5w" />
          </div>
          <p className="text-white text-lg font-bold">Genius AI</p>
        </div>
        <div>
          <Link
            href="/dashboard"
            className="bg-white/25 text-white/75 px-4 py-2 rounded-3xl font-semibold tracking-tight"
          >
            Get started
          </Link>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 pt-32 text-center">
        <h1 className="text-white text-4xl md:text-7xl font-bold capitalize text-center">
          the best AI tool for
          <br />
          <div className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-500 py-4">
            <TypeWriterComponent />
          </div>
        </h1>
        <Button variant={"gradient"}>Get Started</Button>
      </div>
    </section>
  );
};

export default Landing;
