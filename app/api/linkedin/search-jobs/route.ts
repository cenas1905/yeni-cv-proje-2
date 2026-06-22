import { createClient } from '@/lib/supabase-server';
import { scrapeLinkedInJobs } from '@/lib/apify';

export async function GET(req: Request) {
  try {
    const supabase = await createClient();
    
    // 1. Authenticate user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return Response.json({ error: 'Yetkilendirme başarısız' }, { status: 401 });
    }
    
    const { searchParams } = new URL(req.url);
    const keywords = searchParams.get('keywords') || '';
    const location = searchParams.get('location') || '';
    
    if (!keywords) {
      return Response.json({ error: 'Arama terimi (keywords) belirtilmelidir' }, { status: 400 });
    }
    
    const data = await scrapeLinkedInJobs(keywords, location);
    
    return Response.json({ data });
  } catch (err: any) {
    return Response.json({ error: err.message || 'İş ilanları aranamadı' }, { status: 500 });
  }
}
