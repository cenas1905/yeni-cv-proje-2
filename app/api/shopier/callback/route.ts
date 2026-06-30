import { NextResponse } from 'next/server';
import { verifyShopierCallback } from '@/lib/shopier';
import { createClient } from '@/lib/supabase-server';
import { config } from '@/lib/config';

export async function POST(request: Request) {
  try {
    // Shopier sends data as application/x-www-form-urlencoded
    const formData = await request.formData();
    const data = Object.fromEntries(formData.entries());

    console.log('Shopier Webhook Received:', data);

    const isValid = verifyShopierCallback(data);
    if (!isValid) {
      console.error('Shopier callback signature invalid or status is not success.');
      return NextResponse.redirect(`${config.appUrl}/dashboard?payment=error`);
    }

    // Extract user ID from order ID (format: order_timestamp_userId)
    const orderId = data.platform_order_id as string;
    const parts = orderId.split('_');
    const userId = parts[2]; // assuming format order_TIMESTAMP_USERID

    if (!userId) {
      console.error('Could not extract user ID from order ID:', orderId);
      return NextResponse.redirect(`${config.appUrl}/dashboard?payment=error`);
    }

    const db = await createClient();
    const { error: updateError } = await db
      .from('users')
      .update({ 
        role: 'PRO',
        stripe_customer_id: 'shopier_' + data.payment_id,
        stripe_subscription_id: 'shopier_' + data.payment_id
      })
      .eq('id', userId);

    if (updateError) {
      console.error('Error updating user role:', updateError);
      return NextResponse.redirect(`${config.appUrl}/dashboard?payment=error`);
    }

    // Redirect to dashboard with success message
    return NextResponse.redirect(`${config.appUrl}/dashboard?payment=success`);

  } catch (error) {
    console.error('Shopier callback error:', error);
    return NextResponse.redirect(`${config.appUrl}/dashboard?payment=error`);
  }
}
