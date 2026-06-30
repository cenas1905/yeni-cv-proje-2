import { NextResponse } from 'next/server';
import { generateShopierForm } from '@/lib/shopier';
import { config } from '@/lib/config';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, email, planId, price } = body;

    if (!userId || !email) {
      return NextResponse.json({ error: 'Kullanıcı bilgileri eksik' }, { status: 400 });
    }

    // Check for API credentials
    if (!process.env.SHOPIER_API_KEY || !process.env.SHOPIER_API_SECRET) {
      // Mock mode fallback for development
      console.warn('Shopier API Key eksik, test/mock modu çalışıyor.');
      return NextResponse.json({ url: `${config.appUrl}/mock-checkout?provider=shopier&userId=${userId}&email=${email}` });
    }

    const orderId = `order_${Date.now()}_${userId}`;
    const baseUrl = config.appUrl;

    const paymentData = {
      orderId: orderId,
      totalAmount: price || 300,
      productName: planId === 'pro_annual' ? 'CVio Pro Paket (Yıllık)' : 'CVio Pro Paket (Aylık)',
      buyer: {
        id: userId,
        name: 'CVio',
        surname: 'Kullanıcısı',
        email: email,
        phone: '05555555555'
      },
      billingAddress: {
        address: 'Dijital Teslimat',
        city: 'Istanbul',
        country: 'Turkey',
        postcode: '34000'
      }
    };

    const returnUrl = `${baseUrl}/dashboard?payment=success`;
    const formHtml = generateShopierForm(paymentData, returnUrl);

    // Return the HTML directly so the frontend can inject it or we return a URL to a form renderer
    // Since this is an API that frontend calls via fetch, we can return the HTML and the frontend will document.write it
    // Or we return a dedicated path that renders the form. Let's return the HTML for the frontend to render.
    return NextResponse.json({ html: formHtml });

  } catch (error: any) {
    console.error('Shopier create checkout error:', error);
    return NextResponse.json({ error: error.message || 'Ödeme formu oluşturulamadı' }, { status: 500 });
  }
}
