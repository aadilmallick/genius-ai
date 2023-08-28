"use client";
import CodeBlock from "@/components/myComponents/CodeBlock";
import Heading from "@/components/myComponents/Heading";
import ImageForm from "@/components/myComponents/images/ImageForm";
import { ImageIcon } from "lucide-react";
import React from "react";
const page = () => {
  return (
    <section className="py-12">
      <div className="max-w-4xl mx-auto">
        <Heading
          title="Image"
          description="This is the image page"
          color="orange"
          Icon={ImageIcon}
        />
        <ImageForm />
      </div>
    </section>
  );
};

export default page;
