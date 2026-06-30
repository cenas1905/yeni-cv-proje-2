import { NextResponse } from 'next/server';
import { verifyShopierCallback } from '@/lib/shopier';
import { getDb } from '@/lib/supabase-server';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const data = Object.fromEntries(formData.entries());

    console.log('Shopier OSB Webhook Received:', data);

    // If it's a test request from Shopier, just return 200 OK
    // Shopier OSB Test usually sends a random order ID or specific status
    if (data.status !== 'success' || data.platform_order_id === 'test') {
      return new NextResponse('OK - Test received', { status: 200 });
    }

    const isValid = verifyShopierCallback(data);
    if (!isValid) {
      console.error('Shopier webhook signature invalid');
      return new NextResponse('Invalid signature', { status: 400 });
    }

    const orderId = data.platform_order_id as string;
    const parts = orderId.split('_');
    const userId = parts[2];

    if (!userId) {
      return new NextResponse('Invalid order ID format', { status: 400 });
    }

    const db = await getDb();
    const { error: updateError } = await db
      .from('users')
      .update({ 
        role: 'PRO',
        stripe_customer_id: 'shopier_' + data.payment_id,
        stripe_subscription_id: 'shopier_' + data.payment_id
      })
      .eq('id', userId);

    if (updateError) {
      console.error('Error updating user role in webhook:', updateError);
      return new NextResponse('Database error', { status: 500 });
    }

    return new NextResponse('OK', { status: 200 });

  } catch (error) {
    console.error('Shopier webhook error:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
