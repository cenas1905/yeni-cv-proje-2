import { createClient } from '@/lib/supabase-server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    
    // 1. Authenticate user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return Response.json({ error: 'Yetkilendirme başarısız' }, { status: 401 });
    }

    const { 
      cvUrl,
      fullName, 
      targetTitle, 
      preferredCities, 
      preferredDistricts, 
      contactEmail, 
      contactPhone, 
      expectedSalary, 
      workTypes 
    } = await req.json();

    if (!cvUrl || !fullName || !targetTitle) {
      return Response.json({ error: 'CV Paylaşım URL\'si, Ad Soyad ve Pozisyon zorunludur.' }, { status: 400 });
    }

    // Extract slug from CV URL
    let slug = cvUrl.trim();
    if (slug.includes('/cv/')) {
      const parts = slug.split('/cv/');
      slug = parts[parts.length - 1];
    }
    // Remove query parameters, hashes, and trailing slashes
    slug = slug.split('?')[0].split('#')[0].replace(/\/$/, '');

    if (!slug) {
      return Response.json({ error: 'Geçersiz CV bağlantısı formatı. Örnek: https://cvio-ai.com.tr/cv/ornek-slug' }, { status: 400 });
    }

    // 2. Look up the CV by slug and ensure it belongs to the authenticated user
    const { data: existingCV, error: selectError } = await supabaseAdmin
      .from('cvs')
      .select('*')
      .eq('slug', slug)
      .eq('user_id', user.id)
      .maybeSingle();

    if (selectError) {
      console.error('Error fetching CV by slug:', selectError);
      return Response.json({ error: 'Veritabanı hatası: ' + selectError.message }, { status: 500 });
    }

    if (!existingCV) {
      return Response.json({ 
        error: 'Geçersiz veya size ait olmayan CV paylaşım bağlantısı. Lütfen önce CV Önizleme sayfasından paylaşım bağlantısı oluşturduğunuzdan emin olun.' 
      }, { status: 400 });
    }

    // Prepare CV data structure
    const citiesArray = preferredCities ? preferredCities.split(',').map((s: string) => s.trim()).filter(Boolean) : ['İstanbul'];
    
    const cvData = {
      ...existingCV.data,
      in_pool: true,
      personal: {
        ...existingCV.data?.personal,
        fullName,
        headline: targetTitle,
        location: citiesArray[0] || 'İstanbul',
        email: contactEmail || user.email || '',
        phone: contactPhone || '',
      },
      preferences: {
        job_title: targetTitle,
        preferred_cities: citiesArray,
        preferred_districts: preferredDistricts || '',
        work_types: workTypes || ['Remote'],
        expected_salary: expectedSalary ? parseInt(expectedSalary) : 0,
        contact_email: contactEmail || user.email || '',
        contact_phone: contactPhone || ''
      }
    };

    // 3. Update the CV row in the database
    const { data: updatedCV, error: updateError } = await supabaseAdmin
      .from('cvs')
      .update({
        is_public: true, // Make sure it is public so employers can see
        data: cvData,
        updated_at: new Date().toISOString()
      })
      .eq('id', existingCV.id)
      .select()
      .single();

    if (updateError) {
      console.error('Error updating CV:', updateError);
      return Response.json({ error: 'Özgeçmiş havuz için güncellenemedi: ' + updateError.message }, { status: 500 });
    }

    return Response.json({ success: true, cv: updatedCV });
  } catch (err: any) {
    console.error('Submit to pool handler error:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
