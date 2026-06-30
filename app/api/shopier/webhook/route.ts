import { NextResponse } from 'next/server';
import { verifyShopierCallback } from '@/lib/shopier';
import { getDb } from '@/lib/supabase-server';

export async function POST(request: Request) {
  try {
    let data: any = {};
    
    // Safely parse body
    try {
      const contentType = request.headers.get('content-type') || '';
      if (contentType.includes('application/json')) {
        data = await request.json();
      } else if (contentType.includes('form-urlencoded') || contentType.includes('multipart/form-data')) {
        const formData = await request.formData();
        data = Object.fromEntries(formData.entries());
      } else {
        const text = await request.text();
        console.log('Shopier webhook raw text:', text);
      }
    } catch (e) {
      console.log('Could not parse webhook body', e);
    }

    console.log('Shopier OSB Webhook Received:', data);

    // If it's an OSB test from Shopier, always return 200 OK immediately
    if (data.status !== 'success' || data.platform_order_id === 'test' || Object.keys(data).length === 0) {
      return new NextResponse('OK - Test received', { status: 200 });
    }

    const isValid = verifyShopierCallback(data);
    if (!isValid) {
      console.error('Shopier webhook signature invalid');
      return new NextResponse('Invalid signature', { status: 400 });
    }

    const orderId = data.platform_order_id as string;
    const parts = orderId?.split('_') || [];
    const userId = parts.length >= 3 ? parts[2] : null;

    if (!userId) {
      // Return 200 even on invalid format so Shopier doesn't retry infinitely
      console.error('Invalid order ID format:', orderId);
      return new NextResponse('OK', { status: 200 });
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

// Shopier might send a GET request for testing? Just in case:
export async function GET(request: Request) {
  console.log('Shopier OSB GET Test Received');
  return new NextResponse('OK', { status: 200 });
}
