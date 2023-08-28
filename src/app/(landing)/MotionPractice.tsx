"use client";
import { motion } from "framer-motion";
import React from "react";

const MotionPractice = () => {
  const [isRedGuyVisible, setIsRedGuyVisible] = React.useState(true);

  const slideIn = {
    hidden: {
      opacity: 0,
      y: "-100%",
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 1,
        type: "spring",
        bounce: 0.5,
      },
    },
    exit: {
      opacity: 0,
      y: "100%",
    },
  };

  return (
    <>
      <button
        onClick={() => setIsRedGuyVisible(!isRedGuyVisible)}
        className="bg-blue-400 px-4 py-2"
      >
        toggle red guy
      </button>
      <motion.div
        className="bg-blue-400 h-56 w-56 m-8 rounded-lg"
        animate={{ scale: 1, x: 100 }}
        initial={{ scale: 0, x: 0 }}
        transition={{ duration: 3, type: "spring", bounce: 0.5 }}
      ></motion.div>
      <motion.div
        className="bg-red-400 h-56 w-56 m-8 rounded-lg"
        variants={slideIn}
        animate={isRedGuyVisible ? "visible" : "hidden"}
        initial="hidden"
        exit="exit"
      ></motion.div>
    </>
  );
};

export default MotionPractice;
