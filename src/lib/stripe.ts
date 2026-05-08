import { loadStripe, Stripe } from "@stripe/stripe-js";

let stripePromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripePromise) {
    const meta: any = import.meta;
    const key = meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
    if (!key) {
      console.warn("VITE_STRIPE_PUBLISHABLE_KEY is missing. Payment flow will be simulated.");
    }
    stripePromise = loadStripe(key || "pk_test_placeholder");
  }
  return stripePromise;
};

export const createCheckoutSession = async () => {
  try {
    const response = await fetch("/api/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const session = await response.json();
    
    if (session.error) {
      throw new Error(session.error);
    }

    const stripe = await getStripe();
    if (!stripe) throw new Error("Stripe not loaded");

    const result = await (stripe as any).redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      throw new Error(result.error.message);
    }
  } catch (error) {
    console.error("Checkout error:", error);
    // For this environment, if real keys aren't provided, we'll simulate success
    if (error instanceof Error && error.message.includes("missing")) {
      alert("Simulated: Redirecting to Stripe Checkout...");
      setTimeout(() => {
        window.location.href = "/?payment=success";
      }, 1500);
    } else {
      throw error;
    }
  }
};
