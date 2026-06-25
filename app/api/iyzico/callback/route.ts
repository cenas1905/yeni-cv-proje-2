import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { makeIyzicoRequest } from '@/lib/iyzico';

export async function POST(req: NextRequest) {
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
  
  try {
    const formData = await req.formData();
    const token = formData.get('token') as string;

    if (!token) {
      console.error('iyzico callback: Token missing in request body');
      return NextResponse.redirect(new URL('/upgrade?error=missing_token', req.url));
    }

    // Call iyzico Retrieve Checkout Form API to verify status
    const response = await makeIyzicoRequest(
      '/payment/iyzipos/checkoutform/auth/ecom/detail',
      { token }
    );

    if (response.status !== 'success' || response.paymentStatus !== 'SUCCESS') {
      console.error('iyzico payment failed or not approved:', response);
      const errMsg = response.errorMessage || 'payment_failed';
      return NextResponse.redirect(new URL(`/upgrade?error=${encodeURIComponent(errMsg)}`, req.url));
    }

    // Payment is successful! Extract metadata from conversationId (format: "userId:planType")
    const conversationId = response.conversationId;
    if (!conversationId || !conversationId.includes(':')) {
      console.error('iyzico callback: Invalid conversationId structure:', conversationId);
      return NextResponse.redirect(new URL('/upgrade?error=invalid_metadata', req.url));
    }

    const [userId, planType] = conversationId.split(':');
    const paymentId = response.paymentId || token;
    
    // Calculate plan expiration
    const duration = planType === 'annual' ? 365 : 30;
    const expiresAt = new Date(Date.now() + duration * 24 * 60 * 60 * 1000).toISOString();

    // 1. Update Profile Plan to Pro or Annual
    const { error: profileError } = await supabaseAdmin
      .from('profiles')
      .update({
        plan: planType,
        plan_expires_at: expiresAt,
        stripe_customer_id: 'iyzico_' + paymentId
      })
      .eq('id', userId);

    if (profileError) {
      throw profileError;
    }

    // 2. Remove expiration limits from public links of this user
    await supabaseAdmin
      .from('cvs')
      .update({
        link_expires_at: null
      })
      .eq('user_id', userId)
      .eq('is_public', true);

    // 3. Log the subscription into subscriptions table
    await supabaseAdmin
      .from('subscriptions')
      .upsert({
        user_id: userId,
        stripe_subscription_id: 'iyzico_' + paymentId,
        plan: planType,
        status: 'active',
        current_period_end: expiresAt
      }, { onConflict: 'stripe_subscription_id' });

    // 4. Redirect user back to dashboard with success query param
    return NextResponse.redirect(`${baseUrl}/dashboard?upgraded=true`);
  } catch (err: any) {
    console.error('iyzico callback handler error:', err);
    return NextResponse.redirect(`${baseUrl}/upgrade?error=server_error`);
  }
}

// Next.js App Router POST routes from external services (like webhooks or callbacks)
// should not cache pages or be static
export const dynamic = 'force-dynamic';
