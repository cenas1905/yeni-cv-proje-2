export const config = {
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  stripePublishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
  appUrl: process.env.NEXT_PUBLIC_URL || 'http://localhost:3000',
  paymentProvider: process.env.NEXT_PUBLIC_PAYMENT_PROVIDER || 'shopier',
};

// If Supabase keys are missing, we default to Mock Mode
export const IS_MOCK_MODE = !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
