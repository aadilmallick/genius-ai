"use client";

import React from "react";

import * as z from "zod";
import { formSchema } from "./constants";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { OpenAI } from "openai";
import { API, fetcher } from "@/lib/fetcher";
import Chat from "./Chat";
import Loader from "../Loader";

type FormData = z.infer<typeof formSchema>;

interface Props {
  forPage?: "code" | "conversation";
}

const PromptForm = ({ forPage = "conversation" }: Props) => {
  const [loading, setLoading] = React.useState(false);
  const [messages, setMessages] = React.useState<
    OpenAI.Chat.CompletionCreateParams["messages"]
  >([]);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: "",
    },
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    const newMessages: OpenAI.Chat.CompletionCreateParams["messages"] = [
      ...messages,
      { content: data.prompt, role: "user" },
    ];
    setMessages(newMessages);
    console.log(data);

    if (forPage === "code") {
      const aiResponse = await fetcher({
        url: API.CODE,
        body: { messages: newMessages },
        method: "POST",
      });
      setMessages([
        ...newMessages,
        {
          content: aiResponse.response,
          role: "system",
        },
      ]);
    }

    if (forPage === "conversation") {
      const aiResponse = await fetcher({
        url: API.CONVERSATION,
        body: { messages: newMessages },
        method: "POST",
      });
      setMessages([
        ...newMessages,
        {
          content: aiResponse.response,
          role: "system",
        },
      ]);
    }
    // console.log(aiResponse);
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
                    placeholder="enter prompt..."
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
      <Chat messages={messages} />
    </div>
  );
};

export default PromptForm;
