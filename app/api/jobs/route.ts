import { NextResponse } from 'next/server';

const MOCK_JOBS = [
  {
    id: "mock-1",
    company_name: "Yazılım Dünyası",
    job_title: "Senior Frontend Developer",
    location: "İstanbul / Uzaktan",
    work_type: "Uzaktan",
    description: "Modern web teknolojileri (React, Next.js, Tailwind CSS) konusunda tecrübeli, takım çalışmasına yatkın takım arkadaşı arıyoruz.",
    apply_url: "https://linkedin.com/jobs/view/mock-1"
  },
  {
    id: "mock-2",
    company_name: "Fintech Çözümleri",
    job_title: "Full Stack Engineer",
    location: "Ankara / Hibrit",
    work_type: "Hibrit",
    description: "Node.js, React ve PostgreSQL kullanarak finansal teknolojiler geliştirecek geliştiriciler arıyoruz.",
    apply_url: "https://linkedin.com/jobs/view/mock-2"
  },
  {
    id: "mock-3",
    company_name: "Kreatif Ajans",
    job_title: "UI/UX Designer",
    location: "İzmir / Ofis",
    work_type: "Ofis",
    description: "Figma ve Adobe araçlarını ileri düzeyde kullanabilen, modern arayüzler ve kullanıcı deneyimi tasarlayacak tasarımcı arıyoruz.",
    apply_url: "https://linkedin.com/jobs/view/mock-3"
  },
  {
    id: "mock-4",
    company_name: "E-Ticaret Dev",
    job_title: "Product Manager",
    location: "İstanbul / Hibrit",
    work_type: "Hibrit",
    description: "Ürün geliştirme süreçlerini yönetecek, analitik düşünme yeteneğine sahip Ürün Yöneticisi arıyoruz.",
    apply_url: "https://linkedin.com/jobs/view/mock-4"
  },
  {
    id: "mock-5",
    company_name: "Siber Güvenlik A.Ş.",
    job_title: "DevOps Engineer",
    location: "Uzaktan",
    work_type: "Uzaktan",
    description: "CI/CD süreçlerini yönetecek, Docker, Kubernetes ve AWS tecrübesi olan DevOps Mühendisi arıyoruz.",
    apply_url: "https://linkedin.com/jobs/view/mock-5"
  }
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const city = searchParams.get('city') || searchParams.get('location') || '';
  const district = searchParams.get('district') || '';
  const jobType = searchParams.get('jobType') || searchParams.get('query') || '';
  const age = searchParams.get('age') || '';
  const cvUrl = searchParams.get('cvUrl') || '';
  const randomJobs = searchParams.get('randomJobs') === 'true';
  const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

  // Fallback function to return filtered mock jobs
  const getFallbackJobs = () => {
    let filtered = [...MOCK_JOBS];
    if (jobType && jobType.trim() !== '') {
      const q = jobType.toLowerCase();
      filtered = filtered.filter(j => 
        j.job_title.toLowerCase().includes(q) || 
        j.company_name.toLowerCase().includes(q) ||
        j.description.toLowerCase().includes(q)
      );
    }
    if (city && city.trim() !== '' && !city.toLowerCase().includes('remote') && !city.toLowerCase().includes('uzaktan')) {
      const loc = city.toLowerCase();
      filtered = filtered.filter(j => 
        j.location.toLowerCase().includes(loc) || 
        j.work_type.toLowerCase().includes(loc)
      );
    }
    // If filtering results in empty, return all mock jobs
    return filtered.length > 0 ? filtered : MOCK_JOBS;
  };

  if (!GEMINI_API_KEY || GEMINI_API_KEY.trim() === '') {
    // If API key is missing, return mock jobs immediately
    return NextResponse.json({ jobs: getFallbackJobs() });
  }

  try {
    const prompt = `Sen gerçek zamanlı internet araması yapabilen bir kariyer botusun.
Google Arama (Search) aracını KULLANARAK şu anda aktif olarak yayında olan (LinkedIn, Kariyer.net, Indeed, Glassdoor vb.) GERÇEK iş ilanlarını bul.

Kullanıcının tercihleri:
Şehir/Lokasyon: ${city} ${district ? `(${district})` : ''}
Aranan Pozisyon: ${jobType}
Rastgele İlanlar: ${randomJobs ? 'Evet (farklı sektörlerden karışık güncel ilanlar bul)' : 'Hayır'}

LÜTFEN İNTERNETTE ŞU AN VAR OLAN, GERÇEK BAŞVURU LİNKLERİ (apply_url) OLAN 5 ADET GERÇEK İŞ İLANI BUL. Asla uydurma veri kullanma! İlanların başvuru linkleri doğrudan o ilanın sayfasına gitmelidir (örn: linkedin.com/jobs/view/..., kariyer.net/is-ilani/...).

Çıktı FORMATI KESİNLİKLE JSON DİZİSİ (ARRAY) OLMALIDIR, BAŞVA METİN EKLEME:
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
          temperature: 0.1
        }
      })
    });

    if (!res.ok) {
      throw new Error(`Gemini API returned status ${res.status}`);
    }

    const data = await res.json();
    if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
      let jsonText = data.candidates[0].content.parts[0].text.trim();
      
      // Extract JSON array robustly since markdown response block may enclose it
      const jsonStart = jsonText.indexOf('[');
      const jsonEnd = jsonText.lastIndexOf(']');
      if (jsonStart !== -1 && jsonEnd !== -1) {
        jsonText = jsonText.substring(jsonStart, jsonEnd + 1);
      }
      
      try {
        const jobs = JSON.parse(jsonText);
        return NextResponse.json({ jobs });
      } catch (parseErr) {
        console.error('Failed to parse Gemini response as JSON, falling back to mock jobs:', parseErr);
        return NextResponse.json({ jobs: getFallbackJobs() });
      }
    }

    return NextResponse.json({ jobs: getFallbackJobs() });
  } catch (error) {
    console.error('Gemini job fetch error, falling back to mock jobs:', error);
    return NextResponse.json({ jobs: getFallbackJobs() });
  }
}

