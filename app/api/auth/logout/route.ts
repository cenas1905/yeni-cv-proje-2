import { createClient } from '@/lib/supabase-server';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const supabase = await createClient();
  
  // Sign out user session
  await supabase.auth.signOut();

  // Redirect to login page with cookies deleted
  const response = NextResponse.redirect(new URL('/login', request.url), {
    status: 303 // Redirect after POST
  });
  
  response.cookies.set('cvio_mock_logged_in', '', { maxAge: 0, path: '/' });
  return response;
}
