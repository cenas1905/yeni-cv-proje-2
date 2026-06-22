import { createClient } from '@/lib/supabase-server';
import slugify from 'slugify';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    const { cvId, targetCompany } = await req.json();
    
    // 1. Authenticate user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return Response.json({ error: 'Yetkilendirme başarısız' }, { status: 401 });
    }
    
    // 2. Fetch profile plan details
    const { data: profile } = await supabase
      .from('profiles')
      .select('plan')
      .eq('id', user.id)
      .single();
    
    const isPro = profile?.plan === 'pro' || profile?.plan === 'annual';
    
    // 3. Generate sharing URL slug
    const userName = user.email?.split('@')[0] || 'user';
    const cleanUserName = slugify(userName, { lower: true, strict: true });
    
    const companySlug = targetCompany
      ? `-${slugify(targetCompany, { lower: true, strict: true })}`
      : '';
      
    const randomStr = Math.random().toString(36).substring(2, 6);
    const slug = `${cleanUserName}${companySlug}-${randomStr}`;
    
    // 4. Calculate expiration timestamp: Free = 14 days, Pro = Infinite
    const linkExpiresAt = isPro
      ? null
      : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();
    
    // 5. Save sharing configuration in Supabase
    const { error } = await supabase
      .from('cvs')
      .update({
        slug,
        is_public: true,
        link_expires_at: linkExpiresAt,
        target_company: targetCompany || null
      })
      .eq('id', cvId)
      .eq('user_id', user.id);

    if (error) {
      return Response.json({ error: error.message }, { status: 500 });
    }
    
    return Response.json({
      link: `${process.env.NEXT_PUBLIC_URL || 'http://localhost:3000'}/cv/${slug}`,
      expiresAt: linkExpiresAt,
      isPermanent: isPro
    });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
