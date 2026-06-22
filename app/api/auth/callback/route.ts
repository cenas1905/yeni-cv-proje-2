import { createClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Ensure profile exists for OAuth users (Google sign-in)
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Upsert profile — Google provides full_name and avatar_url in metadata
        await supabase.from('profiles').upsert({
          id: user.id,
          full_name: user.user_metadata?.full_name || user.user_metadata?.name || '',
          avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
          plan: 'free',
          updated_at: new Date().toISOString(),
        }, { onConflict: 'id', ignoreDuplicates: true });
      }
      return NextResponse.redirect(new URL(next, requestUrl.origin));
    }
  }

  // Error — redirect to login with error message
  return NextResponse.redirect(new URL('/login?error=auth_failed', requestUrl.origin));
}
