import { createClient } from '@/lib/supabase-server';
import { generateCoverLetter } from '@/lib/claude';

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
  return 'Kapak yazısı oluşturulamadı. Lütfen tekrar deneyin.';
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    
    // 1. Authenticate user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return Response.json({ error: 'Yetkilendirme başarısız' }, { status: 401 });
    }
    
    // 2. Remove strict Pro check to allow Free users to generate cover letters (limited to 7-day share links)
    const { data: profile } = await supabase
      .from('profiles')
      .select('plan')
      .eq('id', user.id)
      .single();
    
    
    const { cvData, companyName, jobTitle, jobDescription } = await req.json();
    
    if (!cvData || !companyName || !jobTitle) {
      return Response.json({ error: 'Gerekli alanlar eksik' }, { status: 400 });
    }
    
    // 3. Generate Cover Letter
    const coverLetter = await generateCoverLetter(cvData, companyName, jobTitle, jobDescription);
    
    return Response.json({ coverLetter });
  } catch (err: any) {
    console.error('cover-letter error:', err);
    return Response.json({ error: parseAIError(err) }, { status: 500 });
  }
}
