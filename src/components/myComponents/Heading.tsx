import { LucideIcon } from "lucide-react";
import React from "react";

interface HeadingProps {
  title: string;
  description: string;
  Icon: LucideIcon;
  // we will automatically refactor to tailwind class of text-blue-400 and bg-blue-400/10
  color: string;
}

const Heading = ({ title, description, Icon, color }: HeadingProps) => {
  const bgColor = `bg-${color}-400/25`;

  const textColor = `text-${color}-400`;
  return (
    <div className={`flex items-center gap-x-2 px-4`}>
      <div className={`${bgColor} p-2 rounded-lg`}>
        <Icon className={`${textColor} w-8 h-8`} />
      </div>
      <div>
        <h1 className="text-2xl font-extrabold">{title}</h1>
        <p className="text-gray-400 text-sm font-light -mt-1">{description}</p>
      </div>
    </div>
  );
};

export default Heading;
