# ShadCN UI

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
const session = await auth();
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

# OpenAI API

# Replicate AI

# Prisma and planetscale

## Setup

1. Install prisma dependencies

```bash
npm i prisma -D
npm i -D @prisma/client
npx prisma init
```

2. Go to railway, create new database, and copy the connection string
