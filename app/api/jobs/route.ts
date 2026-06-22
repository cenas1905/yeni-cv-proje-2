import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get('location') || 'Turkey';
  const query = searchParams.get('query') || 'developer';

  const SERPAPI_KEY = process.env.SERPAPI_KEY;

  if (!SERPAPI_KEY) {
    // API anahtarı yoksa kullanıcıyı bilgilendirmek için uyarı döndür
    return NextResponse.json({
      error: 'SERPAPI_KEY eksik',
      message: 'Gerçek internet ilanlarını çekmek için .env.local dosyasına SERPAPI_KEY eklemelisiniz.',
      jobs: []
    });
  }

  try {
    // SerpApi üzerinden Google İş İlanlarını çekme (İŞKUR, LinkedIn vb. buralarda listelenir)
    const res = await fetch(`https://serpapi.com/search.json?engine=google_jobs&q=${encodeURIComponent(query)}&location=${encodeURIComponent(location)}&hl=tr&api_key=${SERPAPI_KEY}`);
    const data = await res.json();

    if (data.jobs_results) {
      const formattedJobs = data.jobs_results.map((job: any) => ({
        id: job.job_id,
        company_name: job.company_name,
        job_title: job.title,
        location: job.location,
        work_type: job.detected_extensions?.schedule_type || 'Belirtilmemiş',
        description: job.description,
        source: 'İnternet (Google Jobs)',
        is_external: true
      }));

      return NextResponse.json({ jobs: formattedJobs });
    }

    return NextResponse.json({ jobs: [] });
  } catch (error) {
    console.error('Job fetch error:', error);
    return NextResponse.json({ error: 'İlanlar çekilirken bir hata oluştu.' }, { status: 500 });
  }
}
