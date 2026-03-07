// Stripe configuration and utilities
// Note: Install stripe package: npm install stripe

// Uncomment when Stripe is configured
// import Stripe from "stripe";

// export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
//   apiVersion: "2024-12-18.acacia",
//   typescript: true,
// });

// Plan configuration
export const STRIPE_PLANS = {
  PRO_MONTHLY: {
    priceId: process.env.STRIPE_PRICE_PRO_MONTHLY || "",
    amount: 2900, // $29.00
    interval: "month" as const,
  },
  PRO_YEARLY: {
    priceId: process.env.STRIPE_PRICE_PRO_YEARLY || "",
    amount: 29000, // $290.00 (save $58)
    interval: "year" as const,
  },
  ENTERPRISE_MONTHLY: {
    priceId: process.env.STRIPE_PRICE_ENTERPRISE_MONTHLY || "",
    amount: 9900, // $99.00
    interval: "month" as const,
  },
  ENTERPRISE_YEARLY: {
    priceId: process.env.STRIPE_PRICE_ENTERPRISE_YEARLY || "",
    amount: 99000, // $990.00 (save $198)
    interval: "year" as const,
  },
} as const;

// Helper to format price
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount / 100);
}

// Helper to get plan name from Stripe price ID
export function getPlanFromPriceId(priceId: string): "PRO" | "ENTERPRISE" | null {
  if (
    priceId === STRIPE_PLANS.PRO_MONTHLY.priceId ||
    priceId === STRIPE_PLANS.PRO_YEARLY.priceId
  ) {
    return "PRO";
  }
  if (
    priceId === STRIPE_PLANS.ENTERPRISE_MONTHLY.priceId ||
    priceId === STRIPE_PLANS.ENTERPRISE_YEARLY.priceId
  ) {
    return "ENTERPRISE";
  }
  return null;
}

// Placeholder functions - implement when Stripe is configured
export async function createCheckoutSession(params: {
  userId: string;
  priceId: string;
  successUrl: string;
  cancelUrl: string;
}): Promise<{ url: string }> {
  throw new Error("Stripe not configured. Please add STRIPE_SECRET_KEY to .env");
  
  // Uncomment when Stripe is configured:
  // const session = await stripe.checkout.sessions.create({
  //   customer_email: params.email,
  //   client_reference_id: params.userId,
  //   line_items: [
  //     {
  //       price: params.priceId,
  //       quantity: 1,
  //     },
  //   ],
  //   mode: "subscription",
  //   success_url: params.successUrl,
  //   cancel_url: params.cancelUrl,
  //   metadata: {
  //     userId: params.userId,
  //   },
  // });
  // return { url: session.url! };
}

export async function createCustomerPortalSession(params: {
  customerId: string;
  returnUrl: string;
}): Promise<{ url: string }> {
  throw new Error("Stripe not configured. Please add STRIPE_SECRET_KEY to .env");
  
  // Uncomment when Stripe is configured:
  // const session = await stripe.billingPortal.sessions.create({
  //   customer: params.customerId,
  //   return_url: params.returnUrl,
  // });
  // return { url: session.url };
}

export async function getSubscription(subscriptionId: string): Promise<any> {
  throw new Error("Stripe not configured. Please add STRIPE_SECRET_KEY to .env");
  
  // Uncomment when Stripe is configured:
  // const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  // return subscription;
}
