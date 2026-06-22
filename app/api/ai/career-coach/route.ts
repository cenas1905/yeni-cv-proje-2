import { createClient } from '@/lib/supabase-server';
import { careerCoach } from '@/lib/claude';

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
      return Response.json({ error: 'Kariyer Koçu özelliği sadece PRO üyeler içindir.' }, { status: 403 });
    }
    
    const { message, cvData } = await req.json();
    
    // 3. Ask Claude Career Coach
    const reply = await careerCoach(message, cvData);
    
    return Response.json({ reply });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
