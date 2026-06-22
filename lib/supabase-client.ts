import { createBrowserClient } from '@supabase/ssr';
import { createMockSupabaseClient } from './supabase-mock-core';

// Creator for Client Components
export function createClientComponentClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!url || !key || url.trim() === '' || key.trim() === '') {
    console.warn('[CVio Component Client] Supabase yapılandırılmamış. Mock mod aktif.');
    return createMockSupabaseClient() as any;
  }
  
  return createBrowserClient(url, key);
}
