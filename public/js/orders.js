const processOrder = (stripeKey, sessionId) => {
    const stripe = new Stripe(stripeKey);
    stripe.redirectToCheckout({
        sessionId
    });
};