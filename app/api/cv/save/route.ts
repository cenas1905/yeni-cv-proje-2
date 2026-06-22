import { createClient } from '@/lib/supabase-server';
import { supabaseAdmin } from '@/lib/supabase';
import { generatePDF } from '@/lib/pdf';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();
    
    // 1. Authenticate user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return Response.json({ error: 'Yetkilendirme başarısız' }, { status: 401 });
    }
    
    const { cvId, title, data: cvData, template, is_public } = await req.json();
    
    if (!title || !cvData) {
      return Response.json({ error: 'Başlık ve CV verisi zorunludur' }, { status: 400 });
    }

    // Fetch user profile plan to determine expiration
    const { data: profile } = await supabaseAdmin
      .from('profiles')
      .select('plan')
      .eq('id', user.id)
      .single();

    const isPro = profile?.plan === 'pro' || profile?.plan === 'annual';
    const expiresAt = isPro ? null : new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();

    let savedCV;
    
    if (cvId) {
      // Update existing CV
      const { data, error } = await supabaseAdmin
        .from('cvs')
        .update({
          title,
          data: cvData,
          template: template || 'modern',
          is_public: is_public !== undefined ? is_public : false,
          updated_at: new Date().toISOString()
        })
        .eq('id', cvId)
        .eq('user_id', user.id)
        .select()
        .single();
        
      if (error) {
        return Response.json({ error: error.message }, { status: 500 });
      }
      savedCV = data;
    } else {
      // Insert new CV
      const { data, error } = await supabaseAdmin
        .from('cvs')
        .insert({
          user_id: user.id,
          title,
          data: cvData,
          template: template || 'modern',
          is_public: is_public !== undefined ? is_public : false
        })
        .select()
        .single();
        
      if (error) {
        return Response.json({ error: error.message }, { status: 500 });
      }
      savedCV = data;
    }

    const currentCvId = savedCV.id;

    // 2. Generate PDF Buffer from CV data JSON
    let pdfBuffer;
    try {
      pdfBuffer = await generatePDF(cvData);
    } catch (pdfErr: any) {
      console.error('PDF generation error:', pdfErr);
      return Response.json({ error: 'PDF oluşturulamadı: ' + pdfErr.message, cv: savedCV }, { status: 500 });
    }

    // 3. Ensure Storage Bucket exists
    try {
      await supabaseAdmin.storage.createBucket('pdfs', {
        public: true,
        fileSizeLimit: 5242880,
        allowedMimeTypes: ['application/pdf']
      });
    } catch (bucketErr) {
      // Ignore if bucket already exists
    }

    // 4. Upload PDF to Storage
    const fileName = `${user.id}/${currentCvId}.pdf`;
    const { error: uploadError } = await supabaseAdmin.storage
      .from('pdfs')
      .upload(fileName, pdfBuffer, {
        contentType: 'application/pdf',
        upsert: true
      });

    if (uploadError) {
      console.error('PDF upload error:', uploadError);
      return Response.json({ error: 'PDF Storage\'a yüklenemedi: ' + uploadError.message, cv: savedCV }, { status: 500 });
    }

    // 5. Get Public URL
    const { data: urlData } = supabaseAdmin.storage
      .from('pdfs')
      .getPublicUrl(fileName);

    const pdfUrl = urlData.publicUrl;

    // 6. Update CV with the PDF URL and expiration dates
    const { data: finalCV, error: updateError } = await supabaseAdmin
      .from('cvs')
      .update({
        pdf_url: pdfUrl,
        pdf_expires_at: expiresAt
      })
      .eq('id', currentCvId)
      .select()
      .single();

    if (updateError) {
      return Response.json({ error: 'PDF URL güncellenemedi: ' + updateError.message, cv: savedCV }, { status: 500 });
    }

    return Response.json({ success: true, cv: finalCV });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
