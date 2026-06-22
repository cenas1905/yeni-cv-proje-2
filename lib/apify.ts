const APIFY_TOKEN = process.env.APIFY_TOKEN;

// Determine if we should run in mock mode for Apify
const isMock = !APIFY_TOKEN || 
               APIFY_TOKEN.trim() === '' || 
               APIFY_TOKEN === 'your_apify_token' || 
               APIFY_TOKEN.startsWith('your_');

export async function importLinkedInProfile(linkedinUrl: string) {
  if (isMock) {
    // return simulated profile
    console.log('[CVio Apify Mock] Simulating LinkedIn import for:', linkedinUrl);
    let name = 'Kemal Yılmaz';
    if (linkedinUrl.includes('cem')) name = 'Cem Tasarım';
    else if (linkedinUrl.includes('ahmet')) name = 'Ahmet Yılmaz';
    else if (linkedinUrl.includes('ayse')) name = 'Ayşe Kaya';

    return {
      personal: {
        fullName: name,
        headline: 'Senior Full Stack Developer | React, Node.js, TypeScript',
        location: 'İstanbul, Türkiye',
        email: 'demo@cvio.app',
        linkedin: linkedinUrl,
        summary: '8 yılı aşkın tecrübeye sahip, modern web teknolojileri (React, Next.js, Node.js, TypeScript, PostgreSQL) konusunda uzmanlaşmış Kıdemli Yazılım Geliştirici. Büyük ölçekli ve yüksek performanslı web uygulamaları tasarımı, geliştirilmesi ve yayına alınmasında geniş deneyime sahip.',
        photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&h=250&fit=crop'
      },
      experience: [
        {
          title: 'Senior Software Engineer',
          company: 'Stitch CareerEngine',
          startDate: '2022-01',
          endDate: '',
          current: true,
          description: 'Next.js ve Tailwind CSS kullanarak modern, yüksek performanslı kariyer yönetim platformu geliştirilmesi. Mikroservis mimarisi geçişinin yönetilmesi ve API yanıt sürelerinin %30 optimize edilmesi.',
          location: 'İstanbul, Türkiye'
        },
        {
          title: 'Full Stack Developer',
          company: 'TechSolutions A.Ş.',
          startDate: '2019-06',
          endDate: '2021-12',
          current: false,
          description: 'React, Redux, Node.js ve Express stack\'leri kullanılarak SaaS e-ticaret platformunun geliştirilmesi. PostgreSQL veritabanı optimizasyonu ve sorgu performanslarının iyileştirilmesi.',
          location: 'Ankara, Türkiye'
        }
      ],
      education: [
        {
          school: 'Orta Doğu Teknik Üniversitesi',
          degree: 'Lisans',
          field: 'Bilgisayar Mühendisliği',
          startYear: '2014',
          endYear: '2019'
        }
      ],
      skills: ['React', 'Next.js', 'Node.js', 'TypeScript', 'Tailwind CSS', 'PostgreSQL', 'Docker', 'REST API', 'GraphQL'],
      certifications: [
        {
          name: 'AWS Certified Solutions Architect',
          issuer: 'Amazon Web Services (AWS)',
          date: '2023-05'
        }
      ]
    };
  }

  // 1. Send run request to Apify (using automation-lab/linkedin-profile-scraper)
  const runResponse = await fetch(
    `https://api.apify.com/v2/acts/automation-lab~linkedin-profile-scraper/runs`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${APIFY_TOKEN}`
      },
      body: JSON.stringify({
        startUrls: [{ url: linkedinUrl }]
      })
    }
  );
  
  if (!runResponse.ok) {
    const errorText = await runResponse.text();
    throw new Error(`Apify start run failed for automation-lab~linkedin-profile-scraper: ${errorText}`);
  }

  const run = await runResponse.json();
  const runId = run.data.id;
  
  // 2. Poll for the run completion (wait up to 90 seconds)
  let result = null;
  for (let i = 0; i < 45; i++) {
    await new Promise(r => setTimeout(r, 2000));
    const statusRes = await fetch(
      `https://api.apify.com/v2/acts/automation-lab~linkedin-profile-scraper/runs/${runId}`,
      {
        headers: { 'Authorization': `Bearer ${APIFY_TOKEN}` }
      }
    );
    
    if (!statusRes.ok) continue;
    
    const status = await statusRes.json();
    if (status.data.status === 'SUCCEEDED') {
      // 3. Retrieve results from default dataset
      const dataRes = await fetch(
        `https://api.apify.com/v2/datasets/${status.data.defaultDatasetId}/items`,
        {
          headers: { 'Authorization': `Bearer ${APIFY_TOKEN}` }
        }
      );
      
      if (dataRes.ok) {
        const data = await dataRes.json();
        result = data[0];
      }
      break;
    } else if (['FAILED', 'ABORTED', 'TIMED-OUT'].includes(status.data.status)) {
      throw new Error(`Apify scraping run ended with status: ${status.data.status}`);
    }
  }
  
  if (!result) {
    throw new Error('Apify profile scraping timed out or returned no results.');
  }
  
  // 4. Map LinkedIn data to standard CV schema
  return mapLinkedInToCV(result);
}

export async function scrapeLinkedInJobs(keywords: string, location: string) {
  if (isMock) {
    console.log('[CVio Apify Mock] Simulating job search for:', keywords, 'in', location);
    // Simulate tiny network delay
    await new Promise(r => setTimeout(r, 1000));
    
    const titleKeyword = keywords.charAt(0).toUpperCase() + keywords.slice(1);
    
    return [
      {
        title: `${titleKeyword} Specialist`,
        companyName: 'Stitch Career Technologies',
        location: `${location || 'İstanbul'} (Remote)`,
        postedAt: 'Dün',
        description: `Stitch Career is looking for a qualified ${keywords} professional. You will design, build and scale core customer interfaces using our design system guidelines. Experience with modern workflows is required.`,
        jobUrl: 'https://linkedin.com/jobs/view/mock1'
      },
      {
        title: `Senior ${titleKeyword} Engineer`,
        companyName: 'Tech Solutions Corp',
        location: `${location || 'İstanbul'} (Hybrid)`,
        postedAt: '3 gün önce',
        description: `We are seeking a senior ${keywords} expert to drive team-level deliverables and maintain frontend architecture. Strong communication and mentoring skills are expected.`,
        jobUrl: 'https://linkedin.com/jobs/view/mock2'
      },
      {
        title: `Lead ${titleKeyword} Developer`,
        companyName: 'Global Innovation Labs',
        location: `${location || 'İstanbul'} (On-site)`,
        postedAt: '1 hafta önce',
        description: `Lead our ${keywords} initiatives and collaborate with cross-functional product teams. Experience in high performance systems, React, Next.js and API integrations is required.`,
        jobUrl: 'https://linkedin.com/jobs/view/mock3'
      },
      {
        title: `${titleKeyword} Consultant`,
        companyName: 'Enterprise Consulting Group',
        location: `${location || 'İstanbul'} (Remote)`,
        postedAt: '5 gün önce',
        description: `Provide engineering consulting services on ${keywords} related architectures. Work closely with clients to formulate engineering roadmaps and review technical specifications.`,
        jobUrl: 'https://linkedin.com/jobs/view/mock4'
      }
    ];
  }

  const searchUrl = `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(keywords)}&location=${encodeURIComponent(location)}`;

  // 1. Send run request to Apify (using curious_coder/linkedin-jobs-scraper)
  const runResponse = await fetch(
    `https://api.apify.com/v2/acts/curious_coder~linkedin-jobs-scraper/runs`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${APIFY_TOKEN}`
      },
      body: JSON.stringify({
        urls: [searchUrl],
        count: 10
      })
    }
  );

  if (!runResponse.ok) {
    const errorText = await runResponse.text();
    throw new Error(`Apify start run failed for curious_coder~linkedin-jobs-scraper: ${errorText}`);
  }

  const run = await runResponse.json();
  const runId = run.data.id;

  let results = [];
  // 2. Poll for run completion (wait up to 90 seconds)
  for (let i = 0; i < 45; i++) {
    await new Promise(r => setTimeout(r, 2000));
    const statusRes = await fetch(
      `https://api.apify.com/v2/acts/curious_coder~linkedin-jobs-scraper/runs/${runId}`,
      {
        headers: { 'Authorization': `Bearer ${APIFY_TOKEN}` }
      }
    );

    if (!statusRes.ok) continue;

    const status = await statusRes.json();
    if (status.data.status === 'SUCCEEDED') {
      // 3. Retrieve results from default dataset
      const dataRes = await fetch(
        `https://api.apify.com/v2/datasets/${status.data.defaultDatasetId}/items`,
        {
          headers: { 'Authorization': `Bearer ${APIFY_TOKEN}` }
        }
      );

      if (dataRes.ok) {
        results = await dataRes.json();
      }
      break;
    } else if (['FAILED', 'ABORTED', 'TIMED-OUT'].includes(status.data.status)) {
      throw new Error(`Apify scraping run ended with status: ${status.data.status}`);
    }
  }

  return results;
}

export async function scrapeCompanyInfo(companyName: string, companyUrl?: string): Promise<string> {
  if (isMock) {
    console.log('[CVio Apify Mock] Simulating company info scrape for:', companyName);
    return `[Sonuç 1] Başlık: ${companyName} - Hakkımızda\nAçıklama: ${companyName}, modern dijital çözümler üreten ve müşteri odaklı teknolojiler geliştiren yenilikçi bir teknoloji şirketidir.\nLink: https://example.com/about\n\n[Sonuç 2] Başlık: ${companyName} Vizyon & Değerler\nAçıklama: Sürdürülebilirlik, hız, güvenilirlik ve kullanıcı deneyimini en üst seviyede tutmak şirketimizin ana değerleridir.\nLink: https://example.com/values`;
  }

  let query = `${companyName} company overview values site description`;
  if (companyUrl) {
    const cleanUrl = companyUrl.replace(/https?:\/\/(www\.)?/, '').split('/')[0];
    query = `site:${cleanUrl} OR "${companyName}" company about services`;
  }

  const runResponse = await fetch(
    `https://api.apify.com/v2/acts/apify~google-search-scraper/runs`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${APIFY_TOKEN}`
      },
      body: JSON.stringify({
        queries: query,
        maxPagesPerQuery: 1,
        resultsPerPage: 5
      })
    }
  );

  if (!runResponse.ok) {
    const errorText = await runResponse.text();
    throw new Error(`Apify Google Search run failed: ${errorText}`);
  }

  const run = await runResponse.json();
  const runId = run.data.id;

  let results = null;
  for (let i = 0; i < 30; i++) {
    await new Promise(r => setTimeout(r, 2000));
    const statusRes = await fetch(
      `https://api.apify.com/v2/acts/apify~google-search-scraper/runs/${runId}`,
      {
        headers: { 'Authorization': `Bearer ${APIFY_TOKEN}` }
      }
    );

    if (!statusRes.ok) continue;

    const status = await statusRes.json();
    if (status.data.status === 'SUCCEEDED') {
      const dataRes = await fetch(
        `https://api.apify.com/v2/datasets/${status.data.defaultDatasetId}/items`,
        {
          headers: { 'Authorization': `Bearer ${APIFY_TOKEN}` }
        }
      );

      if (dataRes.ok) {
        results = await dataRes.json();
      }
      break;
    } else if (['FAILED', 'ABORTED', 'TIMED-OUT'].includes(status.data.status)) {
      throw new Error(`Apify search run failed with status: ${status.data.status}`);
    }
  }

  if (!results || results.length === 0) {
    return `Şirket hakkında bilgi bulunamadı: ${companyName}`;
  }

  const searchPage = results[0];
  const organicResults = searchPage.organicResults || [];
  if (organicResults.length === 0) {
    return `Şirket hakkında arama sonuçlarında bilgi bulunamadı: ${companyName}`;
  }

  const summary = organicResults.map((r: any, idx: number) => {
    return `[Sonuç ${idx + 1}] Başlık: ${r.title}\nAçıklama: ${r.description || r.snippet}\nLink: ${r.url}`;
  }).join('\n\n');

  return summary;
}

function mapLinkedInToCV(profile: any) {
  // Support fields from multiple typical scraping schemas
  const fullName = profile.fullName || 
                   (profile.firstName && profile.lastName ? `${profile.firstName} ${profile.lastName}` : '') || 
                   profile.name || 
                   'Yeni Kullanıcı';

  return {
    personal: {
      fullName,
      headline: profile.headline || profile.title || '',
      location: profile.location || profile.geoLocationName || '',
      email: profile.email || '',
      linkedin: profile.linkedinUrl || profile.url || '',
      summary: profile.about || profile.summary || '',
      photo: profile.profilePicture || profile.profilePicUrl || ''
    },
    experience: (profile.positions || profile.experience || [])?.map((pos: any) => ({
      title: pos.title || pos.role || '',
      company: pos.companyName || pos.company || '',
      startDate: pos.startDate || pos.start || '',
      endDate: pos.endDate || pos.end || '',
      current: pos.isCurrent || !pos.endDate || false,
      description: pos.description || '',
      location: pos.location || ''
    })) || [],
    education: (profile.educations || profile.education || [])?.map((edu: any) => {
      const startYear = edu.startDate?.year || edu.startYear || (edu.startDate ? new Date(edu.startDate).getFullYear() : undefined);
      const endYear = edu.endDate?.year || edu.endYear || (edu.endDate ? new Date(edu.endDate).getFullYear() : undefined);
      return {
        school: edu.schoolName || edu.school || '',
        degree: edu.degreeName || edu.degree || '',
        field: edu.fieldOfStudy || edu.field || '',
        startYear: startYear || '',
        endYear: endYear || ''
      };
    }) || [],
    skills: (profile.skills || [])?.map((s: any) => typeof s === 'string' ? s : (s.name || '')) || [],
    certifications: (profile.certifications || [])?.map((c: any) => ({
      name: c.name || '',
      issuer: c.authority || c.issuingOrganization || '',
      date: c.date || c.issueDate || ''
    })) || []
  };
}
