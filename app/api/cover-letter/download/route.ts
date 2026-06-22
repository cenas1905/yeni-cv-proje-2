import { createClient } from '@/lib/supabase-server';
import { generateCoverLetterPDF } from '@/lib/pdf';

export async function GET(req: Request) {
  try {
    const supabase = await createClient();
    const url = new URL(req.url);
    const clId = url.searchParams.get('clId');

    if (!clId) {
      return Response.json({ error: 'clId parametresi eksik' }, { status: 400 });
    }

    // 1. Fetch Cover Letter record
    const { data: cl, error: clError } = await supabase
      .from('cover_letters')
      .select('*')
      .eq('id', clId)
      .single();

    if (clError || !cl) {
      return Response.json({ error: 'Mektup bulunamadı veya yetkiniz yok' }, { status: 404 });
    }

    // 2. Fetch CV personal data if cv_id exists
    let personalInfo: any = {};
    if (cl.cv_id) {
      const { data: cv } = await supabase
        .from('cvs')
        .select('data')
        .eq('id', cl.cv_id)
        .single();
      if (cv && cv.data && cv.data.personal) {
        personalInfo = cv.data.personal;
      }
    }

    // Fallback if no CV data was resolved
    if (!personalInfo.fullName) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, email')
        .eq('id', cl.user_id)
        .single();
      personalInfo = {
        fullName: profile?.full_name || 'İsim Soyisim',
        email: profile?.email || '',
        location: '',
        linkedin: ''
      };
    }

    // 3. Generate PDF Buffer
    const pdfBuffer = await generateCoverLetterPDF(
      cl.company_name,
      cl.job_title,
      cl.content,
      personalInfo
    );

    const cleanTitle = `${cl.company_name.replace(/[^a-zA-Z0-9]/g, '_')}_Motivasyon_Mektubu`;

    // 4. Return compiled PDF buffer
    return new Response(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${cleanTitle}.pdf"`,
        'Content-Length': pdfBuffer.length.toString()
      }
    });
  } catch (err: any) {
    console.error('Download error:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
