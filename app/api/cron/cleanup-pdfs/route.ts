import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  try {
    // 1. Find all CVs with expired PDF dates
    const { data: expiredCVs } = await supabaseAdmin
      .from('cvs')
      .select('id, pdf_url, user_id')
      .lt('pdf_expires_at', new Date().toISOString())
      .not('pdf_url', 'is', null);
    
    if (expiredCVs && expiredCVs.length > 0) {
      for (const cv of expiredCVs) {
        // 2. Delete the PDF file from Supabase Storage
        const fileName = `${cv.user_id}/${cv.id}.pdf`;
        await supabaseAdmin.storage.from('pdfs').remove([fileName]);

        // 3. Clear PDF url and expiration in database row
        await supabaseAdmin
          .from('cvs')
          .update({ pdf_url: null, pdf_expires_at: null })
          .eq('id', cv.id);
      }
    }
    
    return Response.json({ cleaned: expiredCVs?.length || 0 });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
export const dynamic = 'force-dynamic';
