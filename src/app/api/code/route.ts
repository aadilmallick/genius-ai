import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";
import { auth } from "@clerk/nextjs";
import { API, RequestBodyTypes, ResponseTypes } from "@/lib/fetcher";
import { ChatCompletionMessage } from "openai/resources/chat";

const openAi = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

const instructionMesaage: ChatCompletionMessage = {
  content: `You are a code generator. You must answer only in markdown code snippets. Use code comments for explanations. You may deliver a less than 500 word explanation after giving all the code, to help explain the code.`,
  role: "system",
};

export async function POST(req: NextRequest) {
  const { userId } = auth();
  const { messages }: RequestBodyTypes[API.CODE] = await req.json();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const response = await openAi.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [instructionMesaage, ...messages],
  });

  return NextResponse.json({
    response: response.choices[0].message.content,
  } as ResponseTypes[API.CODE]);
}
