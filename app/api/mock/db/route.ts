import { NextRequest, NextResponse } from 'next/server';
import { executeMockQuery } from '@/lib/supabase-mock-core';

export async function POST(req: NextRequest) {
  try {
    const { table, operation, data, filters, isSingle } = await req.json();
    
    // We execute the query server-side (where typeof window === 'undefined')
    // which directly reads/writes from the Node.js globalThis storage.
    const result = await executeMockQuery(table, operation, data, filters, isSingle);
    
    return NextResponse.json(result);
  } catch (err: any) {
    console.error('Mock DB API error:', err);
    return NextResponse.json(
      { data: null, error: { message: err.message || 'Internal server error in Mock DB' } },
      { status: 500 }
    );
  }
}
