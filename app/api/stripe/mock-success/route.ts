import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// Simple one-time token validation: the token is passed from mock-checkout
// This prevents users from directly hitting /api/stripe/mock-success?userId=...
const MOCK_SECRET = process.env.MOCK_CHECKOUT_SECRET || 'cvio_mock_2024_secret';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const planType = searchParams.get('planType') || 'pro';
    const token = searchParams.get('token');
    
    if (!userId) {
      return NextResponse.redirect(new URL('/upgrade?error=missing_params', req.url));
    }
    
    // Security: require the token from mock-checkout form
    if (token !== MOCK_SECRET) {
      console.warn('Mock success attempted without valid token for userId:', userId);
      return NextResponse.redirect(new URL('/upgrade?error=invalid_token', req.url));
    }
    
    const duration = planType === 'annual' ? 365 : 30;
    const expiresAt = new Date(Date.now() + duration * 24 * 60 * 60 * 1000).toISOString();
    
    // 1. Update Profile Plan
    const { error: profileError } = await supabaseAdmin.from('profiles').update({
      plan: planType,
      plan_expires_at: expiresAt,
      stripe_customer_id: 'cus_mock_' + Math.random().toString(36).substring(7)
    }).eq('id', userId);
    
    if (profileError) {
      throw profileError;
    }
    
    // 2. Remove expiration limits from public links of this user
    await supabaseAdmin.from('cvs').update({
      link_expires_at: null
    }).eq('user_id', userId).eq('is_public', true);
    
    // 3. Upsert into subscriptions log table (mock)
    await supabaseAdmin.from('subscriptions').upsert({
      user_id: userId,
      stripe_subscription_id: 'sub_mock_' + Math.random().toString(36).substring(7),
      plan: planType,
      status: 'active',
      current_period_end: expiresAt
    }, { onConflict: 'stripe_subscription_id' });
    
    // 4. Redirect to dashboard with success query parameter
    const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3000';
    return NextResponse.redirect(`${baseUrl}/dashboard?upgraded=true`);
  } catch (err: any) {
    console.error('Mock purchase error:', err);
    return NextResponse.json({ error: err.message || 'Ödeme simülasyonu başarısız oldu.' }, { status: 500 });
  }
}
