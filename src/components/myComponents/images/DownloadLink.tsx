"use client";
import { DownloadIcon } from "lucide-react";
import React, { use, useEffect } from "react";

async function convertURLToFile(url: string) {
  const response = await fetch(url);
  if (response.status !== 200) {
    throw new Error(`Unable to download file. HTTP status: ${response.status}`);
  }

  // Get the Blob data
  const blob = await response.blob();
  const blobUrl = URL.createObjectURL(blob);
  return blobUrl;
}

const DownloadLink = ({ image }: { image: string }) => {
  const [downloadLink, setDownloadLink] = React.useState<string>("");

  // useEffect(() => {
  //   async function bruh() {
  //     const url = await convertURLToFile(image);
  //     setDownloadLink(url);
  //   }

  //   bruh();

  //   return () => {
  //     URL.revokeObjectURL(downloadLink);
  //   };
  // }, []);

  return (
    <a href={downloadLink || image} download="generatedimg.jpg">
      <DownloadIcon
        width={32}
        height={32}
        className="text-gray-400 cursor-pointer hover:text-gray-700 transition-colors"
      />
    </a>
  );
};

export default DownloadLink;
