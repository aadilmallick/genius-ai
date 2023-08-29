import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";
import { auth } from "@clerk/nextjs";
import { API, RequestBodyTypes, ResponseTypes } from "@/lib/fetcher";
import {
  checkApiLimit,
  checkFreeTrial,
  increaseApiLimit,
  userIsSubscribed,
} from "@/lib/api-limit";

const openAi = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

export async function POST(req: NextRequest) {
  const { userId } = auth();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const freeTrial = await checkApiLimit();
  if (!freeTrial) {
    return new NextResponse(
      JSON.stringify({
        message: "You have exceeded your free trial limit.",
      }),
      {
        status: 403,
      }
    );
  }
  const isPro = await userIsSubscribed();
  if (!isPro) {
    await increaseApiLimit();
  }

  const { messages }: RequestBodyTypes[API.CONVERSATION] = await req.json();

  const response = await openAi.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages,
  });

  return NextResponse.json({
    response: response.choices[0].message.content,
  } as ResponseTypes[API.CONVERSATION]);
}
