"use client";

import React from "react";

import * as z from "zod";
import { formSchema } from "./constants";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { API, fetcher } from "@/lib/fetcher";
import Loader from "../Loader";

type FormData = z.infer<typeof formSchema>;

interface Props {
  page?: "music" | "video";
}

const MusicForm = ({ page = "music" }: Props) => {
  const [loading, setLoading] = React.useState(false);
  const [music, setMusic] = React.useState<string>("");

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    if (page === "video") {
      const res = await fetcher({
        url: API.VIDEO,
        method: "POST",
        body: {
          prompt: data.prompt,
        },
      });
      console.log(res);
      setMusic(res.response);
    }
    if (page === "music") {
      const res = await fetcher({
        url: API.MUSIC,
        method: "POST",
        body: {
          prompt: data.prompt,
        },
      });
      console.log(res);
      setMusic(res.response);
    }

    setLoading(false);
    form.reset();
  };

  return (
    <div className="p-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="rounded-lg w-full p-4 border max-w-[75ch]"
        >
          <FormField
            name="prompt"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    placeholder={`enter prompt to generate ${page}...`}
                    {...field}
                    disabled={loading}
                    multiple
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <button
            className="w-full px-4 py-2 font-semibold bg-black rounded-md text-white mt-4"
            disabled={loading}
          >
            Generate
          </button>
        </form>
      </Form>
      {loading && <Loader />}
      {music && page === "music" && (
        <audio src={music} controls className="w-full" />
      )}
      {music && page === "video" && (
        <video src={music} controls className="max-w-full aspect-video" />
      )}
    </div>
  );
};

export default MusicForm;
