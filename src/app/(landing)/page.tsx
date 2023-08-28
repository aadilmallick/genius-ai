import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import { auth } from "@clerk/nextjs";
import { motion } from "framer-motion";
import MotionPractice from "./MotionPractice";
const Landing = () => {
  const session = auth();
  return (
    <div>
      <p>landing</p>
      {!session.userId ? (
        <Link href="/sign-in">
          <Button>Login</Button>
        </Link>
      ) : (
        <Link href="/dashboard">Dashboard</Link>
      )}
      <MotionPractice />
    </div>
  );
};

export default Landing;
