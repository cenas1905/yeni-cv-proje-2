import { createClient } from '@/lib/supabase-server';
import { generatePDF } from '@/lib/pdf';

export async function GET(req: Request) {
  try {
    const supabase = await createClient();
    const url = new URL(req.url);
    const cvId = url.searchParams.get('cvId');
    
    if (!cvId) {
      return Response.json({ error: 'cvId parametresi eksik' }, { status: 400 });
    }
    
    // 1. Fetch CV details (Supabase RLS automatically validates access)
    const { data: cv, error } = await supabase
      .from('cvs')
      .select('*')
      .eq('id', cvId)
      .single();
      
    if (error || !cv) {
      return Response.json({ error: 'CV bulunamadı veya yetkiniz yok' }, { status: 404 });
    }
    
    // 2. Generate PDF Buffer from CV data JSON
    const pdfBuffer = await generatePDF(cv.data);
    
    const cleanTitle = cv.title.replace(/[^a-zA-Z0-9]/g, '_');
    
    // 3. Return compiled PDF buffer as downloadable file response
    return new Response(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${cleanTitle || 'ozgecmis'}.pdf"`,
        'Content-Length': pdfBuffer.length.toString()
      }
    });
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 });
  }
}
