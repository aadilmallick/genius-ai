"use client";
import Typewriter from "typewriter-effect";

import React from "react";

const TypeWriterComponent = () => {
  return (
    <Typewriter
      options={{
        strings: ["Images", "Music", "Code"],
        autoStart: true,
        loop: true,
      }}
    />
  );
};

export default TypeWriterComponent;
