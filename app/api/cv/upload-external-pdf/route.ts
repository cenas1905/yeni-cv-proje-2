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
      title, 
      pdfBase64, 
      fullName, 
      targetTitle, 
      preferredCities, 
      preferredDistricts, 
      contactEmail, 
      contactPhone, 
      expectedSalary, 
      workTypes 
    } = await req.json();

    if (!pdfBase64 || !fullName || !targetTitle) {
      return Response.json({ error: 'Ad Soyad, Pozisyon ve PDF dosyası zorunludur.' }, { status: 400 });
    }

    // Prepare CV data structure
    const citiesArray = preferredCities ? preferredCities.split(',').map((s: string) => s.trim()).filter(Boolean) : ['İstanbul'];
    
    const cvData = {
      in_pool: true,
      external_pdf: true,
      personal: {
        fullName,
        headline: targetTitle,
        location: citiesArray[0] || 'İstanbul',
        email: contactEmail || user.email || '',
        phone: contactPhone || '',
        summary: 'Dışarıdan yüklenmiş PDF Özgeçmiş'
      },
      preferences: {
        job_title: targetTitle,
        preferred_cities: citiesArray,
        preferred_districts: preferredDistricts || '',
        work_types: workTypes || ['Remote'],
        expected_salary: expectedSalary ? parseInt(expectedSalary) : 0,
        contact_email: contactEmail || user.email || '',
        contact_phone: contactPhone || ''
      },
      skills: [],
      experience: [],
      education: [],
      certifications: []
    };

    // 2. Insert CV record to get database ID
    const { data: savedCV, error: insertError } = await supabaseAdmin
      .from('cvs')
      .insert({
        user_id: user.id,
        title: title || `${fullName} - PDF Özgeçmiş`,
        data: cvData,
        template: 'modern',
        is_public: true // public for pool viewing
      })
      .select()
      .single();

    if (insertError) {
      console.error('Database insert error:', insertError);
      return Response.json({ error: 'Özgeçmiş kaydı oluşturulamadı: ' + insertError.message }, { status: 500 });
    }

    const currentCvId = savedCV.id;

    // 3. Process base64 PDF
    const base64Data = pdfBase64.replace(/^data:application\/pdf;base64,/, '');
    const pdfBuffer = Buffer.from(base64Data, 'base64');

    // 4. Ensure Storage Bucket exists
    try {
      await supabaseAdmin.storage.createBucket('pdfs', {
        public: true,
        fileSizeLimit: 5242880, // 5MB
        allowedMimeTypes: ['application/pdf']
      });
    } catch {
      // Bucket already exists
    }

    // 5. Upload PDF file
    const fileName = `${user.id}/${currentCvId}_external.pdf`;
    const { error: uploadError } = await supabaseAdmin.storage
      .from('pdfs')
      .upload(fileName, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: true
      });

    if (uploadError) {
      console.error('PDF upload error:', uploadError);
      // Clean up database row on upload failure
      await supabaseAdmin.from('cvs').delete().eq('id', currentCvId);
      return Response.json({ error: 'PDF dosyası depolama alanına yüklenemedi: ' + uploadError.message }, { status: 500 });
    }

    // 6. Get public URL of PDF
    const { data: urlData } = supabaseAdmin.storage
      .from('pdfs')
      .getPublicUrl(fileName);

    const pdfUrl = urlData.publicUrl;

    // Fetch user profile plan to determine expiration for free users
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('plan')
      .eq('id', user.id)
      .single();

    const isPro = profile?.plan === 'pro' || profile?.plan === 'annual';
    const expiresAt = isPro ? null : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();

    // 7. Update CV with PDF URL
    const { data: finalCV, error: updateError } = await supabaseAdmin
      .from('cvs')
      .update({
        pdf_url: pdfUrl,
        pdf_expires_at: expiresAt,
        link_expires_at: expiresAt
      })
      .eq('id', currentCvId)
      .select()
      .single();

    if (updateError) {
      console.error('Database update error:', updateError);
      return Response.json({ error: 'Özgeçmiş PDF adresi kaydedilemedi: ' + updateError.message }, { status: 500 });
    }

    return Response.json({ success: true, cv: finalCV });
  } catch (err: any) {
    console.error('External CV upload handler error:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
