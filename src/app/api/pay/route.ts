import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import { prisma } from "@/lib/db";
import stripe from "@/lib/StripeInstance";
import { API, ResponseTypes } from "@/lib/fetcher";
const localUrl = "http://localhost:3000";
const productionUrl = process.env.NEXT_PUBLIC_URL;

export async function GET(req: NextRequest) {
  const session = auth();

  if (!session.userId) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const userSub = await prisma.userSubscription.findUnique({
    where: {
      userId: session.userId,
    },
  });

  if (userSub && userSub.stripeCustomerId) {
    const stripeSession = await stripe.billingPortal.sessions.create({
      customer: userSub.stripeCustomerId,
      return_url: `${
        process.env.NODE_ENV === "production" ? productionUrl : localUrl
      }/dashboard`,
    });

    return new NextResponse(JSON.stringify({ url: stripeSession.url }));
  }

  const stripeSession = await stripe.checkout.sessions.create({
    success_url: `${
      process.env.NODE_ENV === "production" ? productionUrl : localUrl
    }/dashboard`,
    cancel_url: `${
      process.env.NODE_ENV === "production" ? productionUrl : localUrl
    }/dashboard`,
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

  return new NextResponse(
    JSON.stringify({ url: stripeSession.url } as ResponseTypes[API.PAY])
  );
}
