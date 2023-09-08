# ShadCN UI

- [ShadCN UI](#shadcn-ui)
  - [Tailwind Merge](#tailwind-merge)
  - [Components](#components)
    - [Card component](#card-component)
    - [Form component](#form-component)
    - [Icons](#icons)
- [Clerk](#clerk)
  - [`<UserButton />`](#userbutton-)
  - [`auth()`](#auth)
  - [`currentUser()`](#currentuser)
  - [`getAuth()`](#getauth)
- [Zod and React Hook Form](#zod-and-react-hook-form)
  - [Installation](#installation)
  - [Creating a Zod Schema](#creating-a-zod-schema)
  - [Creating a base type](#creating-a-base-type)
  - [Setting up react hook form](#setting-up-react-hook-form)
  - [All together](#all-together)
- [Fetcher anatomy](#fetcher-anatomy)
  - [Typing](#typing)
- [OpenAI API](#openai-api)
  - [Setup](#setup)
  - [Chat conversation](#chat-conversation)
    - [Messages](#messages)
  - [Image](#image)
- [Replicate AI](#replicate-ai)
- [Prisma and mongoose](#prisma-and-mongoose)
  - [Setup](#setup-1)
- [API limit for free users](#api-limit-for-free-users)
  - [Logic](#logic)
  - [Zustand store](#zustand-store)
- [Stripe](#stripe)
  - [Setup](#setup-2)
  - [Checkout logic](#checkout-logic)
  - [Creating a checkout link](#creating-a-checkout-link)
  - [Managing subscriptions with the billing portal](#managing-subscriptions-with-the-billing-portal)
  - [Stripe webhooks](#stripe-webhooks)
    - [Testing webhooks locally](#testing-webhooks-locally)
    - [Code](#code)
  - [Handling user subscription logic](#handling-user-subscription-logic)
- [Other](#other)
  - [Handling mount errors](#handling-mount-errors)

```bash
npx shadcn-ui@latest init
```

ShadCN UI is a library that allows us to download the components into our own code so we can modify them as we wish. They use class-variance-authority and clsx to proivde typescript typing for our props.

You can add individual components like so:

```bash
npx shadcn-ui@latest add button
```

## Tailwind Merge

With the installation of shadcn ui, we also get a handy tailwind class merger helper that allows us to conditionally merge classes:

```javascript
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

This is an example of how to use it:

```javascript
<div
  className={cn(
    "flex items-center gap-4 p-2 hover:bg-slate-600/75 rounded-lg",

    link.link === pathname && "bg-slate-600/50"
  )}
></div>
```

## Components

### Card component

```bash
npx shadcn-ui@latest add card
```

### Form component

```bash
npx shadcn-ui@latest add form
npx shadcn-ui@latest add input
```

### Icons

With shadcn, we get access to lucide react Icons, which even gives us type definition for those icons, with the `LucideIcon` type

```javascript
import { LucideIcon, MessageSquare } from "lucide-react";

interface Tool {
  label: string;
  Icon: LucideIcon;
  link: string;
  color: string;
}
```

# Clerk

1. Install clerk

   ```bash
   npm install @clerk/nextjs
   ```

2. Set up env variables by logging into clerk and then

   ```bash
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_b2JsaWdpbmctd2FscnVzLTI4LmNsZXJrLmFjY291bnRzLmRldiQ
   CLERK_SECRET_KEY=sk_test_HcA0i0usbPAJ7Sn2joMGJ28bDouOiH3a9WTJ2gZFaf
   ```

3. Wrap your root layout and entire app in a `<ClerkProvider>`, which is a server component provider that will allow us to use authentication throughout our app.

   ```javascript
   import { ClerkProvider } from "@clerk/nextjs";

   export default function RootLayout({
     children,
   }: {
     children: React.ReactNode,
   }) {
     return (
       <html lang="en">
         <body className={inter.className}>
           <ClerkProvider>{children}</ClerkProvider>
         </body>
       </html>
     );
   }
   ```

4. CREAte a `middleware.ts` file to protect all your routes, add add the specified code, exporting defualt the `authMiddleware()` function from clerk to protect all routes. We match all routes by default, and then specify which routes to make public through the `publicRoutes` array.

   ```javascript
   import { authMiddleware } from "@clerk/nextjs";
   // Matches all routes and protects them with the authMiddleware
   export default authMiddleware({
     publicRoutes: ["/"],
   });

   export const config = {
     matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
   };
   ```

5. Create a sign in page.tsx at `src\app\sign-in\[[...sign-in]]`

   ```javascript
   import { SignIn } from "@clerk/nextjs";
   export default function Page() {
     return <SignIn />;
   }
   ```

6. Create a sign up page.tsx at `src\app\sign-up\[[...sign-up]]`

   ```javascript
   import { SignUp } from "@clerk/nextjs";
   export default function Page() {
     return <SignUp />;
   }
   ```

7. Add environment variables specifying the auth flow for your app

```bash
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

### `<UserButton />`

Simply render the `<UserButton />` component for a nice profile pic and login actions.

### `auth()`

```javascript
import { auth } from "@clerk/nextjs";
const { userId } = await auth();
```

### `currentUser()`

```javascript
import { currentUser } from "@clerk/nextjs";
const user = await currentUser();
```

### `getAuth()`

Used for route handlers

```javascript
import { getAuth } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextRequest, res: NextResponse) {
  const { userId } = getAuth(req);
  // Load any data your application needs for the API route
  return NextResponse.next();
}
```

# Zod and React Hook Form

## Installation

We will install three libraries to have typescript-safe forms

```bash
npm i zod react-hook-form @hookform/resolvers
```

- `zod` : a type-safe schema completely integrated with TypeScript
- `react-hook-form` : a lightweight wrapper for working with forms in react
- `@hookform/resolvers` : a library of connectors (we're going to use the zod one) for integrating schema structure libraries with react hook form.

## Creating a Zod Schema

```javascript
import * as z from "zod";

export const formSchema = z
  .object({
    prompt: z
      .string()
      .nonempty({
        message: "Prompt is required",
      })
      .min(1)
      .max(1000),
    sayHi: z.string().min(1).max(1000),
    confirmHi: z.string().min(1).max(1000),
  })
  .refine((data) => data.sayHi === data.confirmHi, {
    message: "Say hi and confirm hi must be the same",
    path: ["confirmHi"],
  });
```

- `z.object()` : creates a zod object schema
- `z.string()` : creates a zod string schema
- `z.nonempty()` : ensures that the string is not empty
- `z.min()` : ensures that the string is at least a certain length or number is at least a certain value
- `z.max()` : ensures that the string is at most a certain length or number is at most a certain value
- `z.array()` : creates a zod array schema

If we want to have stuff like confirm password fields, we should chain on a `.refine()` at the end of the schema, which allows us to add custom validation logic. Here are the arguments:

- **First argument** : a callback function where we can access the data and return a boolean
- **Second argument** : an object with the following properties
  - **message** : the error message to display
  - **path** : the path to the field that we want to display the error message on

## Creating a base type

React hook form needs a typescript type if we need typing. We can create a type by inferring the type from a zod schema:

```javascript
export const formSchema = z.object({
  prompt: z
    .string()
    .nonempty({
      message: "Prompt is required",
    })
    .min(1)
    .max(1000),
});
```

```javascript
type FormData = z.infer<typeof formSchema>;
```

The `z.infer` function will infer the type from the zod schema, which is easy and great.

## Setting up react hook form

First import the zod resolver: `import { zodResolver } from "@hookform/resolvers/zod"`

Then use the base type as a generic for the `useForm()` hook

```typescript
const { register, handleSubmit } = useForm<FormData>({
  resolver: zodResolver(formSchema),
});
```

The rest is simple

```typescript
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

type FormData = z.infer<typeof formSchema>;

const PromptForm = () => {
  const {
    register,
    handleSubmit,
    formstate: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
  });

  const onSubmit = (data: FormData) => {};

  return null;
};
```

## All together

# Fetcher anatomy

This is the basic fetcher function, but we can make it better with typescript.

```javascript
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
```

## Typing

For the fetcher pattern, this is how it usually goes:

- Create an enum for all the api routes, to prevent mispellings.

  ```javascript
  export enum API {
    CONVERSATION = "/api/conversation",
    CODE = "/api/code",
    IMAGE = "/api/image",
    MUSIC = "/api/music",
    VIDEO = "/api/video",
  }
  ```

- Create an interface that has the request body types for all according routes. Make sure each key is a route from the enum.

  ```javascript
  export interface RequestBodyTypes {
    [API.CONVERSATION]: {
      messages: OpenAI.Chat.CompletionCreateParams["messages"],
    };
    [API.CODE]: {
      messages: OpenAI.Chat.CompletionCreateParams["messages"],
    };
    [API.IMAGE]: {
      prompt: string,
      amount: number,
      resolution: string,
    };
    [API.MUSIC]: {
      prompt: string,
    };
    [API.VIDEO]: {
      prompt: string,
    };
  }
  ```

- Create an interface that has the response body types for all according routes. Make sure each key is a route from the enum.

  ```javascript
  export interface ResponseBodyTypes {
    [API.CONVERSATION]: {
      response: OpenAI.Chat.CompletionCreateResponse,
    };
    [API.CODE]: {
      response: OpenAI.Chat.CompletionCreateResponse,
    };
    [API.IMAGE]: {
      response: string,
    };
    [API.MUSIC]: {
      response: string,
    };
    [API.VIDEO]: {
      response: string,
    };
  }
  ```

- Create an interface for the `fetcher` function:

  ```javascript
  interface FetcherProps {
    url:
      | API.CONVERSATION
      | API.CODE
      | API.IMAGE
      | API.MUSIC
      | API.VIDEO
      | string;
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
    body?: any;
    json?: boolean;
  }
  ```

- Create a function that takes in the route and the request body, and returns a promise of the response body. Make sure to type the function with the generic types.

  ```javascript
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
  ```

# OpenAI API

The OpenAI API should only be used on the server, since your API Key needs to be kept secret.

## Setup

The one import you need is `OpenAI` class from the `openai` package. You can then create an instance of the class with your api key. You can then use chat completion or image generation API.

```javascript
import { OpenAI } from "openai";

const openAi = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});
```

## Chat conversation

Use use the `openAi.chat.completions.create()` method to create a chat conversation. The method takes in an object with the following properties:

- `model` : the model to use, as a **string**.
- `messages` : an array of message objects, each with a `content` key to represent the message content and the `role` key to represent what role the message represents.

```javascript
const response = await openAi.chat.completions.create({
  model: "gpt-3.5-turbo",
  messages,
});

console.log(response.choices[0].message.content); // the AI response
```

This method returns a response.

The AI text response is in the `response.choices[0].message.content` property.

### Messages

The `messages` is an important property that you need for a chat completion because it represents the entire chat history.

```javascript
import { ChatCompletionMessage } from "openai/resources/chat";

const instructionMesaage: ChatCompletionMessage = {
  content: `You are a code generator. You must answer only in markdown code snippets. Use code comments for explanations. You may deliver a less than 500 word explanation after giving all the code, to help explain the code.`,
  role: "system",
};
```

Each message comes with a `content` and a `role` property you must fill. The `content` is just the message content, but `role` is more interesting:

- `system` : Use the `system` role when defining the behavior for the model, like when using **Act as** syntax.
- `user` : Use the `user` role when you are sending a message to chatGpt like asking it a question or just how you normally would.
- `assistant` : Use the `assistant` role whenever ChatGPT responds to you

```javascript
// add our message to the messages array
const newMessages: OpenAI.Chat.CompletionCreateParams["messages"] = [
  ...messages,
  { content: data.prompt, role: "user" },
];
setMessages(newMessages);
// make AI openAI request, passing messages array
const aiResponse = await fetcher({
  url: API.CONVERSATION,
  body: { messages: newMessages },
  method: "POST",
});
// add AI response to messages array
setMessages([
  ...newMessages,
  {
    content: aiResponse.response,
    role: "assistant",
  },
]);
```

## Image

The `openAi.images.generate()` method takes in an object with these properties:

- `prompt` : the image prompt, **String**
- `n` : the number of images to generate, **Number**
- `size` : the size of the image, must be square and one of these values: `"256x256"`, `"512x512"`, `"1024x1024"

```javascript
const { amount, prompt, resolution } = await req.json();
```

```javascript
  const response = await openAi.images.generate({
    prompt,
    n: Number(amount),
    size: resolution as OpenAI.ImageGenerateParams["size"],
  });
```

The response we get back will be an array of objects with a `url` property because of the ability to generate multiple images at a time, so the structure will be like so:

```typescript
type Response = { url: string }[];
```

```javascript
return NextResponse.json({
  response: response.data.map((obj) => obj.url),
} as ResponseTypes[API.IMAGE]);
```

# Replicate AI

Replicate AI is a platform where you can run open source models of any kind, easliy and on the cheap.

Here is how you get set up after installing with `npm i replicate` and getting your API token:

```javascript
import Replicate from "replicate";

const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN!,
});
```

You can then run various models by just searching up for how to use the model, and it will always be something like this:

```javascript
const response: { audio: string, spectogram: string } = await replicate.run(
  "riffusion/riffusion:8cf61ea6c56afd61d8f5b9ffd14d7c216c0a93844ce2d82ac1c9ecc9c7f24e05",
  {
    input: {
      prompt_a: prompt,
    },
  }
);

return NextResponse.json({
  response: response.audio,
} as ResponseTypes[API.MUSIC]);
```

The response structure will differ from model to model

# Prisma and mongoose

## Setup

1. Install prisma dependencies

```bash
npm i prisma -D
npm i -D @prisma/client
npx prisma init
```

2. Create a mongodb atlas database and get the connection string. Make sure to specify a database name in the connection string. Add it to the env
3. Have your schema prisma like this:

```prisma
datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}
```

4. Create the Schema

```prisma
model UserApiLimit {
  id String @id @default(auto()) @map("_id") @db.ObjectId
  userId String @unique
  count Int @default(0)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

For mongodb, we need to map ids to the `_id` field, like so:

```prisma
id String @id @default(auto()) @map("_id") @db.ObjectId
```

# API limit for free users

## Logic

On each API request, before running the openAI model, create/update a prisma object for the user representing a `UserApiLimit`, and keep track of the current free generations with a `count` property on the document.

When the `count` on a user api limit document surpasses the max limit on free generations we set, we return a 400 server error.

We then catch the server error and use a state-management library called Zustand to open a Pro Modal that prompts the user to upgrade their account.

## Zustand store

```typescript
import { create } from "zustand";

// 1. create an interface for type safety
interface useProModalStore {
  isOpen: boolean;
  closeModal: () => void;
  openModal: () => void;
}
// 2. create a store, and pass our interface as the generic type
// 3. Use the set function as a generic setter, where you can pass in state changes
export const useProModalStore = create<useProModalStore>((set) => ({
  isOpen: false,
  closeModal: () => set({ isOpen: false }),
  openModal: () => set({ isOpen: true }),
}));
```

# Stripe

## Setup

Follow these steps:

1. Go to stripe dashboard and set your dashboard to **test mode**.
2. Copy your publishable key and secret key from stripe into your env variables
3. Do `npm i stripe`
4. Create a stripe instance so you can use the stripe SDK

```javascript
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2023-08-16",
  typescript: true,
});

export default stripe;
```

## Checkout logic

1. User clicks on the upgrade button
2. Request the `/api/pay` route in our server
3. We check if the user already has a subscription by using Prisma.
   - If not, we create a checkout session with stripe, create products, generate a stripe checkout link and redirect the user to the checkout page.
   - If yes, we create a billing portal with stripe which allows the user to manage their subscription.
4. We return a response with the generated stripe URL, whether it's a checkout link or a billing portal link.

## Creating a checkout link

To create a checkout page with stripe, we need the following information:

- The link to redirect to when the purchase is complete successfully. (We'll just do the dashboard)
- The link to redirect to when the purchase is cancelled. (We'll just do the dashboard)
- Any products and the price associated with it

Here is the way we get the redirect link:

```javascript
const localUrl = "http://localhost:3000";
const productionUrl = process.env.NEXT_PUBLIC_URL;
const serverUrl =
  process.env.NODE_ENV === "production" ? productionUrl : localUrl;
```

When in developer mode, we can create products in the strip dashboard and use their `price_id` to refer to the products we created.

Regardless, we will use the `stripe.checkout.sessions.create()` method to generate a checkout stripe session.

But we can also create products programmatically, which is what we do below:

```javascript
const stripeSession = await stripe.checkout.sessions.create({
  success_url: `${serverUrl}/dashboard`,
  cancel_url: `${serverUrl}/dashboard`,
  payment_method_types: ["card", "paypal"],
  billing_address_collection: "auto",
  customer_email: session.user?.emailAddresses[0].emailAddress,
  line_items: [
    {
      price_data: {
        currency: "USD",
        product_data: {
          name: "Genius AI Subscription",
          description: "Genius AI Pro Subscription",
        },
        unit_amount: 2000,
        recurring: {
          interval: "month",
        },
      },
      quantity: 1,
    },
  ],
  metadata: {
    userId: session.userId,
  },
  mode: "subscription",
});
```

- `success_url` : the url to redirect to when the purchase is successful
- `cancel_url` : the url to redirect to when the purchase is cancelled
- `mode` : the mode of the checkout session, which can be `payment` for one-time purchases or `subscription`
- `payment_method_types` : the payment methods that are allowed. Here it's credit card and paypal
- `customer_email` : the email of the customer
- `metadata` : any metadata you want to add to the checkout session. Here we want to pass the user id for integration with our prisma database.
- `line_items` : the products to purchase. Here we only have one product, but we can have multiple products. Each product has a `price_data` object, which has the following properties:
  - `currency` : the currency of the product
  - `product_data` : the product data, which has the following properties:
    - `name` : the name of the product
    - `description` : the description of the product
  - `unit_amount` : the price of the product in cents
  - `recurring` : the recurring object, which has the following properties:
    - `interval` : the interval of the subscription, which can be `day`, `week`, `month`, `year`

The checkout session page url is now on the `stripeSession.url` property, which we return as the server's response

```javascript
return new NextResponse(JSON.stringify({ url: stripeSession.url }));
```

## Managing subscriptions with the billing portal

We see if the user in our database already has a subscription by using prisma. If they do, we create a billing portal session with stripe for them to manage their subscription, and return the portal url to the billing portal session.

```javascript
export async function GET(req: NextRequest) {
  // find user subscription in our database
  const userSub = await prisma.userSubscription.findUnique({
    where: {
      userId: session.userId,
    },
  });

  // if user subscription already exists, create a billing portal session to manage subscription
  if (userSub && userSub.stripeCustomerId) {
    const stripeSession = await stripe.billingPortal.sessions.create({
      customer: userSub.stripeCustomerId,
      return_url: `${serverUrl}/dashboard`,
    });

    return new NextResponse(JSON.stringify({ url: stripeSession.url }));
  }
}
```

```javascript
const stripeSession = await stripe.billingPortal.sessions.create({
  customer: userSub.stripeCustomerId,
  return_url: `${serverUrl}/dashboard`,
});
```

The `stripe.billlingPortal.sessions.create()` method creates a billing portal, returning an object with the link of the billing portal. It takes in an object with the following properties:

- `customer` : the stripe customer id
- `return_url` : the url to redirect to when the user is done managing their subscription

You can then access the billing portal URL with `stripeSession.url`

When in production, make sure to enable the billing portal by going to https://dashboard.stripe.com/test/settings/billing/portal

## Stripe webhooks

Stripe webhooks are used to run some logic immediately after a user pays or uses stripe on your website. This is good for automatically running logic and database calls related to user subscriptions.

### Testing webhooks locally

First install the stripe CLI. I already did this for you. You're welcome, me from the future.

1. Login with stripe using `stripe login`
2. Start the stripe webhook listener with `stripe listen --forward-to localhost:3000/<webhook-route-here>`.
   - I defined my webhook route as `/api/stripe/webhook`, so I would run `stripe listen --forward-to localhost:3000/api/stripe/webhook`
3. Running the command spits out a webhook secret. Copy the webhook signing secret and add it to your env variables
4. Your webhook should no be up and running.

### Code

The webhook route should be a POST request handler, which gets back information from `req.text()` body.

1. Get the request body text and the `stripe-signature` header, which are used to construct information about the stripe event:

```javascript
const body = await req.text();
const signature = req.headers.get("stripe-signature")!;
```

2. Construct a stripe event
3. Based on the event type, run different logic.
4. Return a 200 response with a null body to acknowledge receipt of the event.

```javascript
import stripe from "@/lib/StripeInstance";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  // 1. get stripe data
  const body = await req.text();
  const signature = req.headers.get("stripe-signature")!;
  let event: Stripe.Event;
  try {
    // 2. create stripe event
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.log(err);
    return new NextResponse("Webhook Error", { status: 400 });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  // Payment is successful and the subscription is created.
  if (event.type === "checkout.session.completed") {
    // Fulfill the purchase...
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    // an unauthorized user without a userId tried checking out something. We can't have that.
    if (!session.metadata?.userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    await prisma.userSubscription.create({
      data: {
        userId: session.metadata.userId,
        stripeCustomerId: session.customer as string,
        stripeSubscriptionId: subscription.id as string,
        stripePriceId: subscription.items.data[0].price.id,
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000
        ),
      },
    });
  }

  // when the new billing interval for the subscription succeeds
  if (event.type === "invoice.payment_succeeded") {
    const subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    );

    await prisma.userSubscription.update({
      where: {
        stripeSubscriptionId: subscription.id as string,
      },
      data: {
        stripeCurrentPeriodEnd: new Date(
          subscription.current_period_end * 1000
        ),
        stripePriceId: subscription.items.data[0].price.id,
      },
    });
  }

  // return empty 200 response to acknowledge receipt of the event
  return new NextResponse(null, { status: 200 });
}
```

## Handling user subscription logic

If the user is subscribed, we do not want to limit their access. The first thing we can do is create a helper function that tells us whether the current user is subscribed or not.

```javascript
export async function userIsSubscribed() {
  const { userId } = auth();
  if (!userId) return false;

  const userSub = await prisma.userSubscription.findUnique({
    where: {
      userId,
    },
    select: {
      stripeCustomerId: true,
      stripeCurrentPeriodEnd: true,
      stripeSubscriptionId: true,
    },
  });

  if (!userSub) return false;

  // if the end period date is in the future, the user has an active subscription
  if (userSub.stripeCurrentPeriodEnd! > new Date(Date.now())) return true;

  return false;
}
```

Then in each of our openAI route handlers, only increase the api limit count if the user is not subscribed:

```javascript
const isPro = await userIsSubscribed();
if (!isPro) {
  await increaseApiLimit();
}
```

# Other

## Handling mount errors

```javascript
const [isMounted, setIsMounted] = useState(true);

useEffect(() => {
  // Cleanup function to set isMounted to false when component unmounts
  setIsMounted(true);
  return () => {
    setIsMounted(false);
  };
}, []);

if (!isMounted) {
  return null;
}
```
