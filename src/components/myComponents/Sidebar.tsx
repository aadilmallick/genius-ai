import React from "react";
import { Montserrat } from "next/font/google";
import Image from "next/image";
import { cn } from "@/lib/utils";

import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import SidebarLinkList from "./SidebarLinkList";
import { getApiLimitCount, maxCount, userIsSubscribed } from "@/lib/api-limit";
import ProModal from "./ProModal";
import FreeCounter from "./FreeCounter";

const mont = Montserrat({
  weight: "700",
  subsets: ["latin"],
});

const Sidebar = async ({ isOpen = false }: { isOpen?: boolean }) => {
  const count = await getApiLimitCount();
  const isPro = await userIsSubscribed();
  return (
    <div className={cn("flex flex-col bg-gray-900 p-4 w-full h-screen")}>
      <div className="flex space-x-4">
        <Image src={"/logo.png"} width={32} height={32} alt="logo" />
        <h1 className={cn("text-2xl font-bold text-white", mont.className)}>
          Genius
        </h1>
      </div>
      <SidebarLinkList />
      <div className="p-2 rounded-full w-fit flex items-center gap-4">
        <UserButton afterSignOutUrl="/" />
        <p className="text-white font-semibold">My Profile</p>
      </div>
      <FreeCounter count={count || 0} isPro={isPro} />
      <ProModal isPro={isPro}/>
    </div>
  );
};

export default Sidebar;
