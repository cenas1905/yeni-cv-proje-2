import { NextRequest } from 'next/server';
import { executeMockQuery } from '@/lib/supabase-mock-core';
import { generatePDF } from '@/lib/pdf';

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const pathParam = url.searchParams.get('path');
    
    if (!pathParam) {
      return Response.json({ error: 'path parametresi eksik' }, { status: 400 });
    }
    
    // Parse cvId from path: mock-user-id-12345/cvId.pdf
    const parts = pathParam.split('/');
    const fileName = parts[parts.length - 1];
    const cvId = fileName.replace('.pdf', '');
    
    if (!cvId) {
      return Response.json({ error: 'CV ID tespit edilemedi' }, { status: 400 });
    }
    
    // Retrieve CV from the mock database
    const { data: cv, error } = await executeMockQuery('cvs', 'select', null, { id: cvId }, true);
    
    if (error || !cv) {
      return Response.json({ error: 'CV bulunamadı veya yetkiniz yok' }, { status: 404 });
    }
    
    // Generate PDF Buffer from CV data JSON
    const pdfBuffer = await generatePDF(cv.data);
    
    const cleanTitle = cv.title.replace(/[^a-zA-Z0-9]/g, '_');
    
    return new Response(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${cleanTitle || 'ozgecmis'}.pdf"`,
        'Content-Length': pdfBuffer.length.toString()
      }
    });
  } catch (err: any) {
    console.error('Mock PDF generation error:', err);
    return Response.json({ error: err.message }, { status: 500 });
  }
}
