import { OpenAI } from "openai";

export enum API {
  CONVERSATION = "/api/conversation",
  CODE = "/api/code",
  IMAGE = "/api/image",
  MUSIC = "/api/music",
  VIDEO = "/api/video",
  PAY = "/api/pay",
}

export interface RequestBodyTypes {
  [API.CONVERSATION]: {
    messages: OpenAI.Chat.CompletionCreateParams["messages"];
  };
  [API.CODE]: {
    messages: OpenAI.Chat.CompletionCreateParams["messages"];
  };
  [API.IMAGE]: {
    prompt: string;
    amount: number;
    resolution: string;
  };
  [API.MUSIC]: {
    prompt: string;
  };
  [API.VIDEO]: {
    prompt: string;
  };
}

export interface ResponseTypes {
  [API.CONVERSATION]: {
    response: string;
  };
  [API.CODE]: {
    response: string;
  };
  [API.IMAGE]: {
    response: string[];
  };
  [API.MUSIC]: {
    response: string;
  };
  [API.VIDEO]: {
    response: string;
  };
  [API.PAY]: {
    url: string;
  };
}

interface FetcherProps {
  url: API.CONVERSATION | API.CODE | API.IMAGE | API.MUSIC | API.VIDEO | string;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  body?: any;
  json?: boolean;
}

export async function fetcher({
  url,
  method = "POST",
  body,
  json,
}: {
  url: API.CONVERSATION;
  method: "POST";
  body: RequestBodyTypes[API.CONVERSATION];
  json?: boolean;
}): Promise<ResponseTypes[API.CONVERSATION]>;

export async function fetcher({
  url,
  method = "POST",
  body,
  json,
}: {
  url: API.CODE;
  method: "POST";
  body: RequestBodyTypes[API.CODE];
  json?: boolean;
}): Promise<ResponseTypes[API.CODE]>;

export async function fetcher({
  url,
  method = "POST",
  body,
  json,
}: {
  url: API.MUSIC;
  method: "POST";
  body: RequestBodyTypes[API.MUSIC];
  json?: boolean;
}): Promise<ResponseTypes[API.MUSIC]>;

export async function fetcher({
  url,
  method = "POST",
  body,
  json,
}: {
  url: API.VIDEO;
  method: "POST";
  body: RequestBodyTypes[API.VIDEO];
  json?: boolean;
}): Promise<ResponseTypes[API.VIDEO]>;

export async function fetcher({
  url,
  method = "POST",
  body,
  json,
}: {
  url: API.IMAGE;
  method: "POST";
  body: RequestBodyTypes[API.IMAGE];
  json?: boolean;
}): Promise<ResponseTypes[API.IMAGE]>;

export async function fetcher({
  url,
  method = "GET",
  body = null,
  json,
}: {
  url: API.PAY;
  method: "GET";
  body?: null;
  json?: boolean;
}): Promise<ResponseTypes[API.PAY]>;

export async function fetcher({
  url,
  method,
  body,
  json = true,
}: FetcherProps) {
  const res = await fetch(url, {
    method,
    body: body && JSON.stringify(body),
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  });

  if (!res.ok) {
    throw new Error("API Error");
  }

  if (json) {
    const data = await res.json();
    return data;
  }
}
