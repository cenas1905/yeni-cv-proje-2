import { createClient } from '@/lib/supabase-server';
import { scrapeCompanyInfo } from '@/lib/apify';
import { generateCoverLetterWithCompanyInfo } from '@/lib/claude';

export async function POST(req: Request) {
  try {
    const supabase = await createClient();

    // 1. Authenticate user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      return Response.json({ error: 'Yetkilendirme başarısız' }, { status: 401 });
    }

    const { cvId, jobTitle, companies } = await req.json();

    if (!cvId || !jobTitle || !companies || !Array.isArray(companies) || companies.length === 0) {
      return Response.json({ error: 'Gerekli parametreler eksik veya geçersiz.' }, { status: 400 });
    }

    // Max 5 companies per batch
    if (companies.length > 5) {
      return Response.json({ error: 'Tek seferde en fazla 5 şirket için mektup oluşturabilirsiniz.' }, { status: 400 });
    }

    // 2. Fetch CV data
    const { data: cv, error: cvError } = await supabase
      .from('cvs')
      .select('data')
      .eq('id', cvId)
      .eq('user_id', user.id)
      .single();

    if (cvError || !cv) {
      return Response.json({ error: 'Kaynak CV bulunamadı.' }, { status: 404 });
    }

    // 3. Process each company in parallel
    const promises = companies.map(async (item) => {
      const { companyName, companyWebsite } = item;
      if (!companyName || companyName.trim() === '') return null;

      console.log(`Processing company: ${companyName}...`);

      let companyInfo = '';
      try {
        // Run Apify company scraping
        companyInfo = await scrapeCompanyInfo(companyName, companyWebsite);
      } catch (scrapeErr) {
        console.error(`Scraping failed for ${companyName}:`, scrapeErr);
        companyInfo = `${companyName} hakkında internetten otomatik veri çekilemedi. Mektup genel şirket bilgileri ve CV'ye göre optimize edilecektir.`;
      }

      // Generate cover letter using AI (prioritizing Gemini, fallback to Claude)
      const content = await generateCoverLetterWithCompanyInfo(
        cv.data,
        companyName,
        jobTitle,
        companyInfo
      );

      // Save to Supabase
      const { data: clRecord, error: dbError } = await supabase
        .from('cover_letters')
        .insert({
          user_id: user.id,
          cv_id: cvId,
          company_name: companyName,
          company_website: companyWebsite || null,
          job_title: jobTitle,
          company_info: companyInfo,
          content: content
        })
        .select()
        .single();

      if (dbError) {
        console.error(`DB insert failed for ${companyName}:`, dbError);
        throw new Error(`${companyName} veritabanına kaydedilirken bir hata oluştu.`);
      }

      return clRecord;
    });

    const results = (await Promise.all(promises)).filter(Boolean);

    return Response.json({ success: true, data: results });
  } catch (err: any) {
    console.error('generate-bulk error:', err);
    return Response.json({ error: err?.message || 'Toplu mektup oluşturulurken hata oluştu.' }, { status: 500 });
  }
}
