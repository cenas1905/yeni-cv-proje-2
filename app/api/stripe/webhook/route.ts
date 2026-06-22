import { stripe } from '@/lib/stripe';
import { supabaseAdmin } from '@/lib/supabase';
import Stripe from 'stripe';

export async function POST(req: Request) {
  const sig = req.headers.get('stripe-signature');
  const body = await req.text();
  
  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return Response.json({ error: 'Webhook headers or keys missing' }, { status: 400 });
  }
  
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err: any) {
    console.error('Webhook error:', err.message);
    return Response.json({ error: `Webhook Signature Verification Failed: ${err.message}` }, { status: 400 });
  }
  
  // Handle Subscription Created or Updated Events
  if (
    event.type === 'customer.subscription.created' ||
    event.type === 'customer.subscription.updated'
  ) {
    const sub = event.data.object as any;
    const userId = sub.metadata?.userId;
    
    if (userId) {
      // 1. Update Profile Plan to Pro and set expiration timestamp
      await supabaseAdmin.from('profiles').update({
        plan: 'pro',
        plan_expires_at: new Date(sub.current_period_end * 1000).toISOString(),
        stripe_customer_id: sub.customer as string
      }).eq('id', userId);
      
      // 2. Remove expiration limits from public links of this user
      await supabaseAdmin.from('cvs').update({
        link_expires_at: null
      }).eq('user_id', userId).eq('is_public', true);
      
      // 3. Upsert into subscriptions log table
      await supabaseAdmin.from('subscriptions').upsert({
        user_id: userId,
        stripe_subscription_id: sub.id,
        plan: 'pro',
        status: sub.status,
        current_period_end: new Date(sub.current_period_end * 1000).toISOString()
      }, { onConflict: 'stripe_subscription_id' });
    }
  }
  
  // Handle Subscription Canceled/Deleted Events
  if (event.type === 'customer.subscription.deleted') {
    const sub = event.data.object as any;
    const userId = sub.metadata?.userId;
    
    if (userId) {
      // 1. Revert Profile Plan back to Free
      await supabaseAdmin.from('profiles').update({
        plan: 'free',
        plan_expires_at: null
      }).eq('id', userId);
      
      // 2. Add 7 days link expiration limits to all active public links of this user
      const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
      await supabaseAdmin.from('cvs').update({
        link_expires_at: expiresAt
      }).eq('user_id', userId).eq('is_public', true);
      
      // 3. Update subscription status log
      await supabaseAdmin.from('subscriptions').update({
        status: 'canceled',
        current_period_end: new Date(sub.current_period_end * 1000).toISOString()
      }).eq('stripe_subscription_id', sub.id);
    }
  }
  
  return Response.json({ received: true });
}
export const dynamic = 'force-dynamic';
