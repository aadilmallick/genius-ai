import { OpenAI } from "openai";
import Image from "next/image";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useUser } from "@clerk/nextjs";
import ReactMarkdown from "react-markdown";
// import remarkPrism from "remark-prism";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
// import { dark } from "react-syntax-highlighter/dist/esm/styles/prism";

interface Props {
  messages: OpenAI.Chat.CompletionCreateParams["messages"];
}

const Chat = ({ messages }: Props) => {
  if (messages.length === 0) {
    return (
      <div className="max-w-[30rem] mx-auto p-4">
        <Image
          src={"/empty.png"}
          width={2160}
          height={2160}
          alt=""
          className="object-cover"
        />
        <p className="text-center">No chats started</p>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-y-4 mt-8">
      {messages.map((message, i) => (
        <ChatMessage key={i} role={message.role} content={message.content!} />
      ))}
    </div>
  );
};

type ChatMessageProps = OpenAI.Chat.CompletionCreateParams["messages"][0];

function ChatMessage({ content, role }: ChatMessageProps) {
  const user = useUser();
  return (
    <div className="flex space-x-4 items-start max-w-[75ch] p-4 py-8 border rounded-md">
      <Avatar>
        <AvatarImage
          src={role === "user" ? user.user?.imageUrl : "/logo.png"}
          className="object-contain"
        />
        <AvatarFallback>USER</AvatarFallback>
      </Avatar>
      <div>
        <ReactMarkdown
          components={{
            pre: ({ node, lang, children, ...props }) => {
              console.log({
                node,
                children,
                lang,
              });
              return (
                <div className="bg-gray-800 p-4 rounded-md overflow-x-auto w-full text-white my-2">
                  <pre {...props}>
                    <code className={`language-${lang}`}>{children}</code>
                  </pre>
                </div>
              );
            },
            code: ({ node, inline, lang, children, ...props }) => {
              return (
                <code
                  className="bg-black/10 rounded-lg text-red-400 p-1"
                  {...props}
                >
                  {children}
                </code>
              );
            },
            p: ({ node, children, ...props }) => {
              return <p className="mb-4 leading-[150%]">{children}</p>;
            },
          }}
        >
          {content || ""}
        </ReactMarkdown>
      </div>
    </div>
  );
}

export default Chat;
