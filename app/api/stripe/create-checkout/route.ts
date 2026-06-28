import { stripe } from '@/lib/stripe';

export async function POST(req: Request) {
  try {
    const { priceId, planType, userId, returnUrl } = await req.json();
    
    if (!userId) {
      return Response.json({ error: 'Eksik parametreler (userId gerekli)' }, { status: 400 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
    
    // Detect mock mode: if Stripe secret key is missing or test mode detected
    const isMock = !process.env.STRIPE_SECRET_KEY || 
                   process.env.STRIPE_SECRET_KEY.trim() === '' ||
                   process.env.STRIPE_SECRET_KEY.includes('your_secret_key');

    if (isMock) {
      const upgradeUrl = `${baseUrl}/mock-checkout?userId=${userId}&planType=${planType || 'pro'}`;
      return Response.json({ url: upgradeUrl });
    }
    
    let targetPriceId = priceId;
    if (!targetPriceId && planType) {
      targetPriceId = planType === 'annual'
        ? process.env.STRIPE_PRO_ANNUAL_PRICE_ID
        : process.env.STRIPE_PRO_MONTHLY_PRICE_ID;
    }
    
    if (!targetPriceId) {
      return Response.json({ error: 'Eksik parametreler (priceId/planType gerekli)' }, { status: 400 });
    }


    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: targetPriceId, quantity: 1 }],
      metadata: { userId, planType: planType || 'pro' },
      subscription_data: {
        metadata: { userId, planType: planType || 'pro' }
      },
      success_url: `${baseUrl}/dashboard?upgraded=true`,
      cancel_url: returnUrl || `${baseUrl}/upgrade`
    });
    
    return Response.json({ url: session.url });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
