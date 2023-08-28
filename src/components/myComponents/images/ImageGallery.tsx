import React from "react";
import Image from "next/image";
import { DownloadIcon } from "lucide-react";
import DownloadLink from "./DownloadLink";

const ImageGallery = ({ images }: { images: string[] }) => {
  if (images.length === 0) {
    return (
      <div className="max-w-[30rem] mx-auto p-4">
        <Image
          src={"/empty.png"}
          width={2160}
          height={2160}
          alt=""
          className="object-cover"
        />
        <p className="text-center">No Images generated</p>
      </div>
    );
  }

  return (
    <div className="p-2 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
      {images.map((image) => (
        <div
          className="aspect-square relative border-2 border-gray-600 rounded-lg overflow-hidden"
          key={image}
        >
          <Image src={image} alt="image" fill />
          <div className="absolute inset-0 bg-gray-600/25 transition-opacity opacity-0 hover:opacity-100">
            <a href={image} download="generatedimg.jpg" target="_blank">
              <DownloadIcon
                width={32}
                height={32}
                className="text-gray-100 cursor-pointer hover:text-gray-700 transition-colors"
              />
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ImageGallery;
