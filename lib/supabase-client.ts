import { createBrowserClient } from '@supabase/ssr';
import { createMockSupabaseClient } from './supabase-mock-core';

let cachedClient: any = null;

// Creator for Client Components
export function createClientComponentClient() {
  const isBrowser = typeof window !== 'undefined';
  
  if (isBrowser && cachedClient) {
    return cachedClient;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  const isMock = !url || !key || url.trim() === '' || key.trim() === '';
  
  if (isMock) {
    const storage = isBrowser ? (window as any) : (globalThis as any);
    if (!storage.__supabaseMockWarned) {
      console.warn('[CVio Component Client] Supabase yapılandırılmamış. Mock mod aktif.');
      storage.__supabaseMockWarned = true;
    }
  }

  const client = isMock
    ? createMockSupabaseClient() as any
    : createBrowserClient(url, key);

  if (isBrowser) {
    cachedClient = client;
  }
  
  return client;
}

