import Heading from "@/components/myComponents/Heading";
import MusicForm from "@/components/myComponents/music/MusicForm";
import { Music2Icon, Video } from "lucide-react";
import React from "react";

const page = () => {
  return (
    <section className="py-12">
      <div className="max-w-4xl mx-auto">
        <Heading
          title="Video"
          description="This is the video page"
          color="violet"
          Icon={Video}
        />
        <MusicForm page="video"/>
      </div>
    </section>
  );
};

export default page;
