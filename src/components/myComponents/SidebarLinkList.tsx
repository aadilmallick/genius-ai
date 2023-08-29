"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import {
  LayoutDashboard,
  LucideIcon,
  MessageSquare,
  ImageIcon,
  VideoIcon,
  MusicIcon,
  Code,
  SettingsIcon,
} from "lucide-react";

const links: ISidebarLink[] = [
  {
    label: "Dashboard",
    Icon: LayoutDashboard,
    link: "/dashboard",
    color: "text-blue-400",
  },
  {
    label: "Conversation",
    Icon: MessageSquare,
    link: "/conversation",
    color: "text-purple-400",
  },
  {
    label: "Images",
    Icon: ImageIcon,
    link: "/image",
    color: "text-red-400",
  },
  {
    label: "Videos",
    Icon: VideoIcon,
    link: "/video",
    color: "text-orange-400",
  },
  {
    label: "Music",
    Icon: MusicIcon,
    link: "/music",
    color: "text-green-400",
  },
  {
    label: "Code",
    Icon: Code,
    link: "/code",

    color: "text-green-800",
  },
  {
    label: "Settings",
    Icon: SettingsIcon,
    link: "/settings",
    color: "text-white",
  },
];

export interface ISidebarLink {
  label: string;
  Icon: LucideIcon;
  link: string;
  color: string;
}

const SidebarLinkList = () => {
  const pathname = usePathname();

  return (
    <div className="space-y-2 mt-4 border-b border-b-slate-400/75 pb-2 mb-4">
      {links.map((link) => (
        <Link key={link.label} href={link.link}>
          <div
            className={cn(
              "flex items-center gap-4 p-2 hover:bg-slate-600/75 rounded-lg",
              link.link === pathname && "bg-slate-600/50"
            )}
          >
            <link.Icon className={cn("w-6 h-6", link.color)} />
            <span className={cn("text-white")}>{link.label}</span>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default SidebarLinkList;
