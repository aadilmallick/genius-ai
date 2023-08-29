import stripe from "@/lib/StripeInstance";
import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  //   const { userId } = auth();
  //   if (!userId) {
  //     return new NextResponse("Unauthorized", { status: 401 });
  //   }

  const body = await req.text();
  const signature = req.headers.get("stripe-signature")!;
  let event: Stripe.Event;
  try {
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
