import { auth } from "@clerk/nextjs";
import { prisma } from "./db";
import { NextResponse } from "next/server";
export const maxCount = 5;

export const increaseApiLimit = async () => {
  const { userId } = auth();
  if (!userId) return;

  // find the initial api limit for a user
  const userApiLimit = await prisma.userApiLimit.findUnique({
    where: {
      userId,
    },
  });

  // if the api limit for a user exists, add one to the count
  if (userApiLimit) {
    await prisma.userApiLimit.update({
      where: { id: userApiLimit.id },
      data: { count: userApiLimit.count + 1 },
    });
  }
  // if the api limit for a user does not exist, create one, initialize count to 1
  else {
    await prisma.userApiLimit.create({
      data: {
        userId,
        count: 1,
      },
    });
  }
};

// return false when user has risen above their api limit
export const checkApiLimit = async () => {
  const { userId } = auth();
  if (!userId) return;

  const userApiLimit = await prisma.userApiLimit.findUnique({
    where: {
      userId,
    },
  });

  // if the api limit for a user exists, check if the count is less than 100
  if (userApiLimit) {
    console.log(userApiLimit.count);
    if (userApiLimit.count < maxCount) return true;
    else return false;
  }
  // if the api limit for a user does not exist, create one, initialize count to 1
  else {
    await prisma.userApiLimit.create({
      data: {
        userId,
        count: 1,
      },
    });
    return true;
  }
};

export async function checkFreeTrial() {
  const freeTrial = await checkApiLimit();
  if (!freeTrial) {
    console.log("free trial limit exceeded");
    return new NextResponse(
      JSON.stringify({
        message: "You have exceeded your free trial limit.",
      }),
      {
        status: 403,
      }
    );
  }
}

export const getApiLimitCount = async () => {
  const { userId } = auth();
  if (!userId) return;

  const userApiLimit = await prisma.userApiLimit.findUnique({
    where: {
      userId,
    },
  });

  // if the api limit for a user exists, check if the count is less than 100
  if (userApiLimit) {
    return userApiLimit.count;
  } else {
    return 0;
  }
};

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
