import Heading from "@/components/myComponents/Heading";
import MusicForm from "@/components/myComponents/music/MusicForm";
import { Music2Icon } from "lucide-react";
import React from "react";

const page = () => {
  return (
    <section className="py-12">
      <div className="max-w-4xl mx-auto">
        <Heading
          title="Music"
          description="This is the  page"
          color="green"
          Icon={Music2Icon}
        />
        <MusicForm />
      </div>
    </section>
  );
};

export default page;
