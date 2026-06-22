import { createClient } from '@/lib/supabase-server';
import { analyzeJobMatch } from '@/lib/claude';

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
  return 'Eşleşme analizi yapılamadı. Lütfen tekrar deneyin.';
}

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    
    // 1. Authenticate user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return Response.json({ error: 'Yetkilendirme başarısız' }, { status: 401 });
    }
    
    // 2. Validate Pro plan subscription
    const { data: profile } = await supabase
      .from('profiles')
      .select('plan')
      .eq('id', user.id)
      .single();
      
    const isPro = profile?.plan === 'pro' || profile?.plan === 'annual';
    if (!isPro) {
      return Response.json({ error: 'Bu özellik sadece PRO üyeler içindir.' }, { status: 403 });
    }
    
    const { cvData, jobDescription } = await req.json();
    
    if (!cvData || !jobDescription) {
      return Response.json({ error: 'Gerekli alanlar eksik' }, { status: 400 });
    }
    
    // 3. Analyze compatibility
    const analysis = await analyzeJobMatch(cvData, jobDescription);
    
    return Response.json({ analysis });
  } catch (err: any) {
    console.error('job-match error:', err);
    return Response.json({ error: parseAIError(err) }, { status: 500 });
  }
}
