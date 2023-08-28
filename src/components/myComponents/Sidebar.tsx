"use client";
import React from "react";
import { usePathname } from "next/navigation";
import { Montserrat } from "next/font/google";
import Image from "next/image";
import { cn } from "@/lib/utils";
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
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";

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

const mont = Montserrat({
  weight: "700",
  subsets: ["latin"],
});

const Sidebar = ({ isOpen = false }: { isOpen?: boolean }) => {
  const pathname = usePathname();
  return (
    <div className={cn("flex-col bg-gray-900 p-4 w-full h-screen")}>
      <div className="flex space-x-4">
        <Image src={"/logo.png"} width={32} height={32} alt="logo" />
        <h1 className={cn("text-2xl font-bold text-white", mont.className)}>
          Genius
        </h1>
      </div>
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
      <div className="p-2 rounded-full w-fit flex items-center gap-4">
        <UserButton afterSignOutUrl="/" />
        <p className="text-white font-semibold">My Profile</p>
      </div>
    </div>
  );
};

export default Sidebar;
