import Heading from "@/components/myComponents/Heading";
import PromptForm from "@/components/myComponents/conversation/PromptForm";
import { Code } from "lucide-react";
import React from "react";

const CodingPage = () => {
  return (
    <section className="py-12">
      <div className="max-w-4xl mx-auto">
        <Heading
          title="Code Generation"
          description="This is the coding page"
          color="green"
          Icon={Code}
        />
        <PromptForm forPage="code" />
      </div>
    </section>
  );
};

export default CodingPage;
