import React from "react";
import Image from "next/image";

const Loader = () => {
  return (
    <div className="w-full flex justify-center items-center bg-gray-300 p-4 my-4 rounded-lg">
      <div className=" flex flex-col gap-y-4 items-center justify-center">
        <div className="w-10 h-10 relative animate-spin">
          <Image src="/logo.png" fill alt="logo" />
        </div>
        <p className="text-gray-400">Genius is thinking...</p>
      </div>
    </div>
  );
};

export default Loader;
