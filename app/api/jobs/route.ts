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
    const prompt = `Sen profesyonel bir iş ilanı ve kariyer eşleştirme motorusun. 
    Kullanıcının tercihleri:
    Şehir: ${city}
    İlçe: ${district}
    Yaş: ${age}
    Aranan Pozisyon: ${jobType}
    CV URL: ${cvUrl}
    Rastgele İlanlar: ${randomJobs ? 'Evet' : 'Hayır'}
    
    ${randomJobs ? 'Bana bu şehre ve genel kriterlere uygun, farklı sektörlerden rastgele ama çok GERÇEKÇİ 4 adet iş ilanı oluştur.' : 'Bana bu kriterlere tam uyan, gerçek şirket isimlerine benzer (veya gerçek) şirketler ve çok inandırıcı açıklamaları olan 4 adet iş ilanı oluştur.'}
    İlanlar Türkiye piyasasına ve gerçek hayat şartlarına tamamen uygun, profesyonel ve inandırıcı olmalı.
    
    Çıktı FORMATI KESİNLİKLE JSON DİZİSİ (ARRAY) OLMALIDIR, BAŞKA METİN EKLEME:
    [
      {
        "id": "1",
        "company_name": "Şirket Adı",
        "job_title": "Pozisyon Adı",
        "location": "Şehir, İlçe",
        "work_type": "Tam Zamanlı / Yarı Zamanlı / Uzaktan",
        "description": "Gerçekçi iş tanımı ve gereksinimler."
      }
    ]`;

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          response_mime_type: "application/json",
          temperature: 0.7
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
