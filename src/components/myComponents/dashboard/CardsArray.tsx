"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import React from "react";
import {
  LucideIcon,
  MessageSquare,
  ArrowRight,
  ImageIcon,
  Music,
  Code,
  Video,
} from "lucide-react";
import { useRouter } from "next/navigation";

interface Tool {
  label: string;
  Icon: LucideIcon;
  link: string;
  color: string;
}

const tools = [
  {
    label: "Conversation",
    Icon: MessageSquare,
    link: "/conversation",
    // we will automatically refactor this to tailwind class of bg-purple-400/10 and text-purple-400
    color: "purple",
  },
  {
    label: "Image generation",
    Icon: ImageIcon,
    link: "/image",
    color: "red",
  },
  {
    label: "Music generation",
    Icon: Music,
    link: "/music",
    color: "green",
  },
  {
    label: "Code generation",
    Icon: Code,
    link: "/code",
    color: "orange",
  },
  {
    label: "Video generation",
    Icon: Video,
    link: "/video",
    color: "blue",
  },
];

const CardsArray = () => {
  return (
    <div className="px-2 max-w-sm mx-auto mt-12 space-y-4">
      {tools.map((tool) => (
        <CardComponent key={tool.label} tool={tool} />
      ))}
    </div>
  );
};

interface ICardComponentProps {
  tool: Tool;
}

function CardComponent({ tool }: ICardComponentProps) {
  const bgColor = `bg-${tool.color}-400/10`;
  const textColor = `text-${tool.color}-400`;

  const router = useRouter();
  return (
    <Card
      className="p-2 px-4 hover:bg-slate-50 transition-colors cursor-pointer"
      onClick={() => router.push(tool.link)}
    >
      <div className="flex items-center gap-x-4">
        <div className={cn("p-2 w-fit rounded-md", bgColor)}>
          <tool.Icon className={cn("w-8 h-8", textColor)} />
        </div>
        <p className="font-bold flex-1">{tool.label}</p>
        <ArrowRight className="w-4 h-4" />
      </div>
    </Card>
  );
}

export default CardsArray;
