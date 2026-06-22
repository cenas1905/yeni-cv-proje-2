import { createClient } from '@/lib/supabase-server';
import { improveCV } from '@/lib/claude';

function parseAIError(err: any): string {
  let msg = err?.message || err?.error?.message || String(err);
  if (typeof msg === 'object') msg = JSON.stringify(msg);
  const lower = msg.toLowerCase();
  if (lower.includes('credit balance') || lower.includes('billing') || lower.includes('overloaded')) {
    return 'Yapay zeka servisi şu anda kullanılamıyor (API bakiyesi yetersiz veya servis yoğun). Lütfen daha sonra tekrar deneyin.';
  }
  if (lower.includes('rate limit') || lower.includes('too many requests') || lower.includes('429') || lower.includes('quota')) {
    return 'Yapay zeka servisinde limit veya kota sınırına ulaşıldı. Lütfen 1 dakika bekleyip tekrar deneyin.';
  }
  return 'Özgeçmiş iyileştirilirken yapay zeka hatası oluştu. Lütfen tekrar deneyin.';
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    
    // 1. Authenticate user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return Response.json({ error: 'Yetkilendirme başarısız' }, { status: 401 });
    }
    
    const { cvData, targetCompany } = await req.json();
    
    // 2. Call Claude API to optimize fields
    const improvedData = await improveCV(cvData, targetCompany);
    
    return Response.json({ data: improvedData });
  } catch (err: any) {
    console.error('improve-cv error:', err);
    return Response.json({ error: parseAIError(err) }, { status: 500 });
  }
}
