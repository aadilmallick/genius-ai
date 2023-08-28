import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";
import { auth } from "@clerk/nextjs";
import { API, RequestBodyTypes, ResponseTypes } from "@/lib/fetcher";

const openAi = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

export async function POST(req: NextRequest) {
  const { userId } = auth();
  const { amount, prompt, resolution }: RequestBodyTypes[API.IMAGE] =
    await req.json();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  if (!prompt || !amount || amount < 0 || !resolution) {
    return new NextResponse("Invalid fields", { status: 400 });
  }

  const response = await openAi.images.generate({
    prompt,
    n: Number(amount),
    size: resolution as OpenAI.ImageGenerateParams["size"],
    response_format: "url",
  });
  return NextResponse.json({
    response: response.data.map((obj) => obj.url),
  } as ResponseTypes[API.IMAGE]);
}
