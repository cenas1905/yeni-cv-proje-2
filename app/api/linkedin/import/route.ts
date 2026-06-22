import { createClient } from '@/lib/supabase-server';
import { importLinkedInProfile } from '@/lib/apify';
import { improveCV } from '@/lib/claude';

function parseAIError(err: any): string {
  let msg = err?.message || err?.error?.message || String(err);
  if (typeof msg === 'object') msg = JSON.stringify(msg);
  const lower = msg.toLowerCase();
  if (lower.includes('credit balance') || lower.includes('billing') || lower.includes('overloaded')) {
    return 'Yapay zeka servisi şu anda kullanılamıyor (API bakiyesi yetersiz veya servis yoğun). Lütfen daha sonra tekrar deneyin.';
  }
  if (lower.includes('rate limit')) {
    return 'Yapay zeka servisi çok fazla istek aldı. Lütfen 1 dakika bekleyip tekrar deneyin.';
  }
  if (lower.includes('apify') || lower.includes('actor') || lower.includes('linkedin')) {
    return 'LinkedIn profili çekilirken hata oluştu. URL\'nin herkese açık olduğundan emin olun ve tekrar deneyin.';
  }
  return 'LinkedIn profili içe aktarılamadı. Lütfen tekrar deneyin.';
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    
    // 1. Authenticate user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return Response.json({ error: 'Yetkilendirme başarısız' }, { status: 401 });
    }
    
    const { linkedinUrl } = await req.json();
    if (!linkedinUrl) {
      return Response.json({ error: 'linkedinUrl parametresi eksik' }, { status: 400 });
    }
    
    // 2. Scraping using Apify actor
    const rawData = await importLinkedInProfile(linkedinUrl);
    
    // 3. Optimize the raw scraped data using Claude
    const optimizedData = await improveCV(rawData);
    
    return Response.json({ data: optimizedData });
  } catch (err: any) {
    console.error('LinkedIn import error:', err);
    return Response.json({ error: parseAIError(err) }, { status: 500 });
  }
}
