"use client";

import React from "react";

import * as z from "zod";
import { formSchema, amountOptions, resolutionOptions } from "./constants";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { OpenAI } from "openai";
import { API, fetcher } from "@/lib/fetcher";
import Loader from "../Loader";
import Image from "next/image";
import OptionsList from "../OptionsList";
import ImageGallery from "./ImageGallery";

type FormData = z.infer<typeof formSchema>;

const ImageForm = () => {
  const [loading, setLoading] = React.useState(false);
  const [images, setImages] = React.useState<string[]>([]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
      amount: 1,
      resolution: "256x256",
    },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    console.log(data);
    const res = await fetcher({
      method: "POST",
      url: API.IMAGE,
      body: {
        prompt: data.prompt,
        amount: data.amount,
        resolution: data.resolution,
      },
    });
    setImages(res.response);
    setLoading(false);
    form.reset();
  };

  return (
    <div className="p-4">
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="rounded-lg w-full p-4 border max-w-[75ch] space-y-4"
      >
        <input
          type="text"
          {...form.register("prompt")}
          className="w-full px-4 py-2 rounded-md border"
          placeholder="Prompt"
        />
        {/* working with error messages */}
        {form.formState.errors.prompt && (
          <p className="text-red-400 font-semibold text-sm">
            {form.formState.errors.prompt.message}
          </p>
        )}
        <select
          {...form.register("amount", { valueAsNumber: true })}
          className="w-full px-4 py-2 rounded-md border"
          placeholder="Amount"
        >
          <OptionsList options={amountOptions} />
        </select>
        <select
          {...form.register("resolution")}
          className="w-full px-4 py-2 rounded-md border"
          placeholder="Resolution"
        >
          <OptionsList options={resolutionOptions} />
        </select>
        <button
          className="w-full px-4 py-2 font-semibold bg-black rounded-md text-white mt-4"
          disabled={loading}
        >
          Generate
        </button>
      </form>
      {loading && <Loader />}
      <ImageGallery images={images} />
    </div>
  );
};

export default ImageForm;
