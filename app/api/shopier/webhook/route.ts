import { NextResponse } from 'next/server';
import { verifyShopierCallback } from '@/lib/shopier';
import { createClient } from '@/lib/supabase-server';

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

    // Log webhook request to database for live debugging
    try {
      const db = await createClient();
      const logMsg = `[${new Date().toISOString()}] Data: ${JSON.stringify(data).substring(0, 150)}`;
      await db
        .from('profiles')
        .update({ stripe_customer_id: logMsg })
        .eq('email', 'cem.asil2020@gmail.com');
    } catch (dbLogErr) {
      console.error('Failed to write log to DB:', dbLogErr);
    }

    // Parse Shopier new webhook format (res & hash)
    let orderId = '';
    let isTest = false;

    if (data.res && data.hash) {
      // New format
      const resString = data.res;
      const hash = data.hash;
      const decodedRes = JSON.parse(Buffer.from(resString, 'base64').toString('utf8'));
      orderId = decodedRes.orderid;
      if (decodedRes.istest === 1) {
        return new NextResponse('OK', { status: 200 });
      }

      const expectedHash = require('crypto')
        .createHmac('sha256', process.env.SHOPIER_API_SECRET || '')
        .update(resString)
        .digest('hex');

      if (hash !== expectedHash && hash !== expectedHash.toUpperCase()) {
        console.error('Shopier new webhook signature invalid');
        return new NextResponse('Invalid signature', { status: 400 });
      }
      
    } else {
      // Old format
      if (data.status !== 'success' || data.platform_order_id === 'test' || Object.keys(data).length === 0) {
        return new NextResponse('OK', { status: 200 });
      }

      const isValid = verifyShopierCallback(data);
      if (!isValid) {
        console.error('Shopier webhook signature invalid');
        return new NextResponse('Invalid signature', { status: 400 });
      }
      orderId = data.platform_order_id as string;
    }

    if (isTest || orderId === 'test' || !orderId.includes('_')) {
      // It's a test or manual order, don't update DB
      return new NextResponse('OK', { status: 200 });
    }

    const parts = orderId.split('_');
    const userId = parts.length >= 3 ? parts[2] : null;

    if (!userId) {
      console.error('Invalid order ID format:', orderId);
      return new NextResponse('OK', { status: 200 });
    }

    const db = await createClient();
    const { error: updateError } = await db
      .from('profiles')
      .update({ 
        plan: 'pro',
        stripe_customer_id: 'shopier_webhook',
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
