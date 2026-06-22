import { createClient } from '@/lib/supabase-server';
import { generateCVFromPrompt } from '@/lib/claude';

function parseAIError(err: any): string {
  let msg = err?.message || err?.error?.message || String(err);
  // Stringify object errors
  if (typeof msg === 'object') msg = JSON.stringify(msg);
  const lower = msg.toLowerCase();
  if (lower.includes('credit balance') || lower.includes('billing') || lower.includes('overloaded')) {
    return 'Yapay zeka servisi şu anda kullanılamıyor (API bakiyesi yetersiz veya servis yoğun). Lütfen daha sonra tekrar deneyin.';
  }
  if (lower.includes('rate limit') || lower.includes('too many requests') || lower.includes('429') || lower.includes('quota')) {
    return 'Yapay zeka servisinde limit veya kota sınırına ulaşıldı. Lütfen 1 dakika bekleyip tekrar deneyin.';
  }
  return 'Yapay zeka CV oluşturulurken bir hata oluştu. Lütfen tekrar deneyin.';
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    
    // 1. Authenticate user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return Response.json({ error: 'Yetkilendirme başarısız' }, { status: 401 });
    }
    
    const { prompt } = await req.json();
    if (!prompt) {
      return Response.json({ error: 'Talimat (prompt) parametresi eksik' }, { status: 400 });
    }
    
    // 2. Call Claude API to generate CV
    const generatedData = await generateCVFromPrompt(prompt);
    
    return Response.json({ data: generatedData });
  } catch (err: any) {
    console.error('generate-cv error:', err);
    return Response.json({ error: parseAIError(err) }, { status: 500 });
  }
}
