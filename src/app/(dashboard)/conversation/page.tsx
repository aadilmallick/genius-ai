import Heading from "@/components/myComponents/Heading";
import PromptForm from "@/components/myComponents/conversation/PromptForm";
import { MessageCircle } from "lucide-react";
import React from "react";

const ConversationPage = () => {
  return (
    <section className="py-12">
      <div className="max-w-4xl mx-auto">
        <Heading
          title="Conversation"
          description="This is the conversation page"
          color="purple"
          Icon={MessageCircle}
        />
        <PromptForm />
      </div>
    </section>
  );
};

export default ConversationPage;
