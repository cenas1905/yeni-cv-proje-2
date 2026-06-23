import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city') || '';
  const district = searchParams.get('district') || '';
  const jobType = searchParams.get('jobType') || '';
  const age = searchParams.get('age') || '';
  const cvUrl = searchParams.get('cvUrl') || '';
  const randomJobs = searchParams.get('randomJobs') === 'true';
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

  try {
    const prompt = `Sen gerçek zamanlı internet araması yapabilen bir kariyer botusun.
Google Arama (Search) aracını KULLANARAK şu anda aktif olarak yayında olan (LinkedIn, Kariyer.net, Indeed, Glassdoor vb.) GERÇEK iş ilanlarını bul.

Kullanıcının tercihleri:
Şehir/Lokasyon: ${city} ${district ? `(${district})` : ''}
Aranan Pozisyon: ${jobType}
Rastgele İlanlar: ${randomJobs ? 'Evet (farklı sektörlerden karışık güncel ilanlar bul)' : 'Hayır'}

LÜTFEN İNTERNETTE ŞU AN VAR OLAN, GERÇEK BAŞVURU LİNKLERİ (apply_url) OLAN 5 ADET GERÇEK İŞ İLANI BUL. Asla uydurma veri kullanma! İlanların başvuru linkleri doğrudan o ilanın sayfasına gitmelidir (örn: linkedin.com/jobs/view/..., kariyer.net/is-ilani/...).

Çıktı FORMATI KESİNLİKLE JSON DİZİSİ (ARRAY) OLMALIDIR, BAŞKA METİN EKLEME:
[
  {
    "id": "1",
    "company_name": "Gerçek Şirket Adı",
    "job_title": "Gerçek Pozisyon Adı",
    "location": "Şehir, Ülke",
    "work_type": "Tam Zamanlı / Uzaktan",
    "description": "Gerçek iş ilanı açıklaması ve aranan nitelikler.",
    "apply_url": "https://gercek-basvuru-linki.com/ilan-detayi"
  }
]`;

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        tools: [{ googleSearch: {} }],
        generationConfig: {
          response_mime_type: "application/json",
          temperature: 0.1
        }
      })
    });

    const data = await res.json();
    if (data.candidates && data.candidates[0].content.parts[0].text) {
      const jsonText = data.candidates[0].content.parts[0].text;
      const jobs = JSON.parse(jsonText);
      return NextResponse.json({ jobs });
    }

    return NextResponse.json({ jobs: [] });
  } catch (error) {
    console.error('Gemini job fetch error:', error);
    return NextResponse.json({ error: 'İlanlar çekilirken bir hata oluştu.' }, { status: 500 });
  }
}
