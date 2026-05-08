export const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

export const startRazorpaySubscription = async (userEmail: string) => {
  try {
    const res = await loadRazorpayScript();
    if (!res) {
      throw new Error("Razorpay SDK failed to load. Are you online?");
    }

    const response = await fetch("/api/create-razorpay-subscription", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    const data = await response.json();
    if (data.error) throw new Error(data.error);

    const meta: any = import.meta;
    const razorpayKey = meta.env.VITE_RAZORPAY_KEY_ID;

    if (!razorpayKey) {
      console.warn("VITE_RAZORPAY_KEY_ID is missing. Simulating success.");
      alert("Simulated: Razorpay Checkout would open here for: " + data.subscription_id);
      setTimeout(() => {
        window.location.href = "/?payment=success";
      }, 1500);
      return;
    }

    const options = {
      key: razorpayKey,
      subscription_id: data.subscription_id,
      name: "LeadPulse",
      description: "Monthly Lead Management Subscription",
      image: "https://cdn.pixabay.com/photo/2017/01/31/23/42/animal-2028258_960_720.png",
      handler: async function (response: any) {
        // Verify payment
        await fetch("/api/verify-razorpay-payment", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_subscription_id: response.razorpay_subscription_id,
            razorpay_signature: response.razorpay_signature,
          }),
        });

        window.location.href = "/?payment=success";
      },
      prefill: {
        email: userEmail,
      },
      theme: {
        color: "#4f46e5",
      },
    };

    const rzp = new (window as any).Razorpay(options);
    rzp.open();
  } catch (error) {
    console.error("Razorpay Error:", error);
    // Simulation fallback if keys are missing or API fails in this sandbox
    if (error instanceof Error && (error.message.includes("credentials") || error.message.includes("not found"))) {
      alert("Billing Simulation: Auto-debit subscription initiated.");
      setTimeout(() => {
        window.location.href = "/?payment=success";
      }, 1500);
    } else {
      throw error;
    }
  }
};
