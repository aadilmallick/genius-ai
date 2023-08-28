import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";
import { auth } from "@clerk/nextjs";
import { API, RequestBodyTypes, ResponseTypes } from "@/lib/fetcher";

const openAi = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

export async function POST(req: NextRequest) {
  const { userId } = auth();
  const { messages }: RequestBodyTypes[API.CONVERSATION] = await req.json();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const response = await openAi.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages,
  });

  return NextResponse.json({
    response: response.choices[0].message.content,
  } as ResponseTypes[API.CONVERSATION]);
}
