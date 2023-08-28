import { API, RequestBodyTypes, ResponseTypes } from "@/lib/fetcher";
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";
import Replicate from "replicate";

type ReplicateResponse = string[];

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});
export async function POST(req: NextRequest) {
  const { userId } = auth();
  const { prompt }: RequestBodyTypes[API.VIDEO] = await req.json();

  if (!userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const response = (await replicate.run(
    "anotherjesse/zeroscope-v2-xl:9f747673945c62801b13b84701c783929c0ee784e4748ec062204894dda1a351",
    {
      input: {
        prompt: prompt,
      },
    }
  )) as ReplicateResponse;

  return NextResponse.json({
    response: response[0],
  } as ResponseTypes[API.VIDEO]);
}
