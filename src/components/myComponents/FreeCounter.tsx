"use client";
import { maxCount, userIsSubscribed } from "@/lib/api-limit";
import { useProModalStore } from "@/lib/useProModal";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

const FreeCounter = ({
  count,
  isPro = false,
}: {
  count: number;
  isPro?: boolean;
}) => {
  if (isPro) {
    return null;
  }

  return (
    <div className="flex-1 flex flex-col justify-end">
      <p className="text-white">
        {count} / {maxCount} generations left
      </p>
      <div className="h-4 bg-slate-200  mt-2 rounded-3xl ">
        <div
          className={cn("h-full bg-purple-400 rounded-tl-3xl rounded-bl-3xl")}
          style={{
            width: `${(count / maxCount) * 100}%`,
          }}
        ></div>
      </div>
    </div>
  );
};

export default FreeCounter;
