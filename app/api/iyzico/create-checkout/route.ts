import { createClient } from '@/lib/supabase-server';
import { makeIyzicoRequest } from '@/lib/iyzico';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    const { planType, userId, returnUrl } = await req.json();
    const targetUserId = userId || user?.id;

    if (!targetUserId) {
      return Response.json({ error: 'Yetkilendirme başarısız veya eksik kullanıcı kimliği' }, { status: 401 });
    }

    const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
    
    // Check if iyzico API credentials are provided
    const isMock = !process.env.IYZICO_API_KEY || 
                   process.env.IYZICO_API_KEY.trim() === '' ||
                   process.env.IYZICO_API_KEY.includes('your_api_key');

    if (isMock) {
      const upgradeUrl = `${baseUrl}/mock-checkout?userId=${targetUserId}&planType=${planType || 'pro'}`;
      return Response.json({ url: upgradeUrl });
    }

    const price = planType === 'annual' ? 2400 : 300;
    const formattedPrice = price.toFixed(1); // '2400.0' or '300.0'

    const fullName = user?.user_metadata?.full_name || 'Kullanici';
    const email = user?.email || 'email@example.com';
    const parts = fullName.trim().split(/\s+/);
    const name = parts[0] || 'Kullanici';
    const surname = parts.slice(1).join(' ') || '.';

    const iyzicoPayload = {
      locale: 'tr',
      conversationId: `${targetUserId}:${planType || 'pro'}`,
      price: formattedPrice,
      paidPrice: formattedPrice,
      currency: 'TRY',
      basketId: `B_${targetUserId}_${Date.now()}`,
      paymentGroup: 'PRODUCT',
      callbackUrl: `${baseUrl}/api/iyzico/callback`,
      enabledInstallments: [1],
      buyer: {
        id: targetUserId,
        name: name,
        surname: surname,
        gsmNumber: '+905555555555',
        email: email,
        identityNumber: '11111111111',
        lastLoginDate: '2026-01-01 00:00:00',
        registrationDate: '2026-01-01 00:00:00',
        registrationAddress: 'Türkiye',
        ip: '127.0.0.1',
        city: 'Istanbul',
        country: 'Turkey',
        zipCode: '34000'
      },
      shippingAddress: {
        contactName: fullName,
        city: 'Istanbul',
        country: 'Turkey',
        address: 'Türkiye',
        zipCode: '34000'
      },
      billingAddress: {
        contactName: fullName,
        city: 'Istanbul',
        country: 'Turkey',
        address: 'Türkiye',
        zipCode: '34000'
      },
      basketItems: [
        {
          id: planType || 'pro',
          name: planType === 'annual' ? 'CVio Pro Yıllık Üyelik' : 'CVio Pro Aylık Üyelik',
          category1: 'Kariyer Servisleri',
          category2: 'CV Hazırlama',
          itemType: 'VIRTUAL',
          price: formattedPrice
        }
      ]
    };

    const response = await makeIyzicoRequest(
      '/payment/iyzipos/checkoutform/initialize/auth/ecom',
      iyzicoPayload
    );

    if (response.status !== 'success') {
      return Response.json({ error: response.errorMessage || 'iyzico ödeme formu oluşturulamadı.' }, { status: 400 });
    }

    return Response.json({ url: response.paymentPageUrl });
  } catch (err: any) {
    console.error('iyzico create checkout error:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
