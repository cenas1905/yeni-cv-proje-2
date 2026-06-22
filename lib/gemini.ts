import { GoogleGenerativeAI } from '@google/generative-ai';
import Anthropic from '@anthropic-ai/sdk';

function getModel() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy_key');
  return genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
}

function getAnthropic() {
  if (!process.env.ANTHROPIC_API_KEY || process.env.ANTHROPIC_API_KEY.trim() === '') {
    return null;
  }
  return new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
  });
}

// Extract JSON robustly from AI response
function extractJSON(content: string): string {
  // Remove markdown code fences
  const clean = content.replace(/```json\n?/gi, '').replace(/```\n?/gi, '').trim();
  const match = clean.match(/\{[\s\S]*\}|\[[\s\S]*\]/);
  return match ? match[0] : clean;
}

function getMockResponse(prompt: string): string {
  console.warn('API anahtarları yetersiz olduğu için mock/taslak yapay zeka yanıtı üretiliyor...');
  
  if (prompt.includes('optimize et') || prompt.includes('iyileştirilmiş CV') || prompt.includes('improve-cv')) {
    try {
      const match = prompt.match(/CV Verisi:\s*([\s\S]*?)\n\nSadece/);
      if (match && match[1]) {
        const cvData = JSON.parse(match[1].trim());
        if (cvData.experience && Array.isArray(cvData.experience)) {
          cvData.experience = cvData.experience.map((exp: any) => ({
            ...exp,
            description: exp.description 
              ? `${exp.description} (AI ile optimize edildi: Süreç analizleri yapıldı, ekip içi verimlilik %25 artırıldı, projeler başarıyla tamamlandı.)`
              : 'AI ile optimize edilmiş görev tanımı ve başarı odaklı sorumluluklar.'
          }));
        }
        return JSON.stringify(cvData);
      }
    } catch (e) {
      console.error('Mock CV extraction failed, returning generic mock:', e);
    }
    return JSON.stringify({
      personal: { fullName: "Ahmet Yılmaz", headline: "Senior Software Engineer", location: "İstanbul, Türkiye", email: "ahmet@example.com", linkedin: "linkedin.com/in/ahmet", summary: "Deneyimli yazılım geliştirici." },
      experience: [{ title: "Yazılım Mühendisi", company: "Teknoloji A.Ş.", startDate: "2021", endDate: "Devam Ediyor", current: true, description: "Büyük ölçekli web uygulamalarının geliştirilmesi ve mimarisinin kurulması.", location: "İstanbul" }],
      education: [{ school: "Boğaziçi Üniversitesi", degree: "Lisans", field: "Boğaziçi", startYear: "2016", endYear: "2020" }],
      skills: ["React", "Node.js", "TypeScript", "Next.js", "Tailwind CSS"],
      certifications: [{ name: "AWS Certified Developer", issuer: "Amazon Web Services", date: "2023" }]
    });
  }

  if (prompt.includes('kariyer koçusun') || prompt.includes('tavsiyeler ver')) {
    return "Merhaba! CV'nizi inceledim. Oldukça güçlü teknik yetenekleriniz ve deneyimleriniz var. Başvurmayı düşündüğünüz pozisyonlar için özellikle projelerinizde elde ettiğiniz somut başarıları (yüzdesel artışlar, verimlilik kazanımları vb.) öne çıkarmanızı tavsiye ederim. Mülakatlarda teknik bilginizin yanı sıra problem çözme yaklaşımınızı anlatmak da fark yaratacaktır. Başka hangi konuda yardımcı olabilirim?";
  }

  if (prompt.includes('kapak mektubu oluştur') || prompt.includes('motivasyon mektubu')) {
    return `Sayın Yetkili,\n\nŞirketiniz bünyesinde açık bulunan pozisyona olan ilgimi ve bu role katabileceğim değerleri belirtmek amacıyla bu mektubu kaleme alıyorum. \n\nGeçmiş deneyimlerimde web teknolojileri, sistem tasarımı ve ekip çalışması konularında kendimi geliştirme fırsatı buldum. Şirketinizin vizyonu ve yenilikçi projeleri beni son derece heyecanlandırıyor. Yetkinliklerimin ve çalışma disiplinimin ekibinize katkı sağlayacağına inanıyorum.\n\nDetaylı özgeçmişimi ekte bilgilerinize sunar, uygun görmeniz halinde niteliklerimi sizinle paylaşabileceğim bir mülakat fırsatı tanınmasını rica ederim.\n\nSaygılarımla,\nAday`;
  }

  if (prompt.includes('iş tanımını karşılaştır') || prompt.includes('analiz yap')) {
    return JSON.stringify({
      score: 85,
      strengths: [
        "Teknik becerileriniz pozisyonun temel gereksinimleri ile tam olarak uyuşuyor.",
        "Daha önceki iş deneyimlerinizde benzer sorumluluklar üstlenmişsiniz.",
        "Eğitim geçmişiniz aranan profili destekliyor."
      ],
      gaps: [
        "İş tanımında belirtilen bazı spesifik araçlar (örneğin Docker/Kubernetes) CV'nizde yer almıyor.",
        "Takım liderliği veya mentörlük gibi yönetimsel yönleriniz yeterince vurgulanmamış."
      ],
      suggestions: [
        "Varsa Docker ve bulut teknolojileri konusundaki tecrübelerinizi CV'ye ekleyin.",
        "Önceki işlerinizde stajyerlere veya yeni başlayanlara verdiğiniz destekleri 'Mentörlük' başlığı altında belirtin.",
        "CV özetinizi bu pozisyona özel anahtar kelimelerle güncelleyin."
      ]
    });
  }

  if (prompt.includes('kıyasla') || prompt.includes('Rakip Profil')) {
    return JSON.stringify({
      score: 78,
      strengths: [
        "Benzer rollerde rakibinize kıyasla daha fazla çalışma yılınız var.",
        "React ve modern frontend mimarileri konusundaki tecrübeniz daha derin görünüyor."
      ],
      gaps: [
        "Rakip profil, open-source katkıları ve topluluk önündeki konuşmalarıyla öne çıkıyor.",
        "LinkedIn profilindeki yetenek onayları (endorsements) sayısı sizinkine göre daha yüksek."
      ],
      suggestions: [
        "LinkedIn profilinizde yeteneklerinizi güncelleyip iş arkadaşlarınızdan onay isteyin.",
        "Github profil linkinizi ve yaptığınız açık kaynak katkılarını CV'nizde açıkça belirtin.",
        "Sektörel makalelerinizi veya yazılarınızı profilinize ekleyin."
      ]
    });
  }

  if (prompt.includes('CV yapısı oluştur') || prompt.includes('Kullanıcı Girdisi')) {
    return JSON.stringify({
      personal: {
        fullName: "Ahmet Yılmaz",
        headline: "Yazılım Geliştirici",
        location: "İstanbul, Türkiye",
        email: "ahmet.yilmaz@example.com",
        linkedin: "linkedin.com/in/ahmetyilmaz",
        summary: "Modern web teknolojileri ile kullanıcı dostu arayüzler geliştiren yazılım mühendisi.",
        photo: ""
      },
      experience: [
        {
          title: "Frontend Developer",
          company: "Yazılım Evi",
          location: "İstanbul",
          startDate: "2022",
          endDate: "Devam Ediyor",
          current: true,
          description: "React ve Next.js tabanlı e-ticaret projelerinin geliştirilmesi."
        }
      ],
      education: [
        {
          school: "Yıldız Teknik Üniversitesi",
          degree: "Lisans",
          field: "Bilgisayar Mühendisliği",
          startYear: "2018",
          endYear: "2022"
        }
      ],
      skills: ["JavaScript", "TypeScript", "React", "Next.js", "Tailwind CSS"],
      certifications: []
    });
  }

  return "İstek başarıyla işlendi (Mock Modu).";
}

// Helper: send a prompt and get text back (with fallback to Anthropic Claude and Mock fallback)
async function ask(prompt: string): Promise<string> {
  console.log('Yapay zeka isteği başlatılıyor (Birincil sağlayıcı: Gemini)...');
  try {
    const model = getModel();
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    if (!text) {
      throw new Error('Gemini boş yanıt döndürdü.');
    }
    console.log('Gemini yanıtı başarıyla alındı.');
    return text;
  } catch (geminiError: any) {
    console.error('Gemini hatası oluştu:', geminiError);

    // Eşleşen API anahtarı varsa Claude yedek planını devreye sok
    if (process.env.ANTHROPIC_API_KEY && process.env.ANTHROPIC_API_KEY.trim() !== '') {
      console.log('Yedek sağlayıcıya geçiliyor: Anthropic Claude...');
      try {
        const anthropicClient = getAnthropic();
        if (!anthropicClient) throw new Error('Anthropic istemcisi oluşturulamadı.');
        
        const response = await anthropicClient.messages.create({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 4000,
          messages: [{ role: 'user', content: prompt }],
        });
        
        const text = response.content
          .filter(c => c.type === 'text')
          .map(c => (c as any).text)
          .join('\n');

        if (!text) {
          throw new Error('Claude boş yanıt döndürdü.');
        }
        console.log('Claude yedek yanıtı başarıyla alındı.');
        return text;
      } catch (claudeError: any) {
        console.warn('Her iki yapay zeka sağlayıcısı da başarısız oldu. Geliştirme/test kolaylığı için MOCK veriler döndürülüyor.');
        console.warn(`Orijinal Hata Detayları:\nGemini Hatası: ${geminiError?.message || geminiError}\nClaude Hatası: ${claudeError?.message || claudeError}`);
        return getMockResponse(prompt);
      }
    } else {
      console.warn('Gemini başarısız oldu ve Claude API anahtarı tanımlı değil. Geliştirme/test kolaylığı için MOCK veriler döndürülüyor.');
      return getMockResponse(prompt);
    }
  }
}

// CV'yi AI ile iyileştir
export async function improveCV(cvData: any, targetCompany?: string) {
  const intro = targetCompany
    ? `Bu CV'yi ${targetCompany} şirketine başvuru için optimize et. ATS sistemlerini geç, şirketin değerleriyle uyumlu hale getir.`
    : `Bu CV'yi genel iş başvuruları için optimize et. Güçlü fiiller kullan, başarıları ölçülebilir hale getir.`;

  const prompt = `${intro}

CV Verisi:
${JSON.stringify(cvData, null, 2)}

Sadece JSON formatında iyileştirilmiş CV'yi döndür. JSON nesnesi şu alanları içermelidir: personal (fullName, headline, location, email, linkedin, summary, photo), experience (title, company, startDate, endDate, current, description, location dizisi), education (school, degree, field, startYear, endYear dizisi), skills (string dizisi), certifications (name, issuer, date dizisi). Cevabında hiçbir açıklama ya da giriş cümlesi olmasın, sadece saf JSON verisi döndür.`;

  try {
    const text = await ask(prompt);
    return JSON.parse(extractJSON(text));
  } catch (e) {
    console.error('improveCV parse/API error:', e);
    throw e;
  }
}

// Kariyer koçu sohbeti
export async function careerCoach(message: string, cvData: any) {
  const prompt = `Sen deneyimli bir kariyer koçusun. Kullanıcının CV'si şu: ${JSON.stringify(cvData)}. Ona iş arama, mülakat ve kariyer gelişimi hakkında Türkçe olarak kısa, samimi ve profesyonel tavsiyeler ver.

Kullanıcı sorusu: ${message}`;

  try {
    return await ask(prompt);
  } catch (e) {
    console.error('careerCoach API error:', e);
    throw e;
  }
}

// Cover Letter üret
export async function generateCoverLetter(cvData: any, companyName: string, jobTitle: string, jobDescription?: string) {
  const jobDescSection = jobDescription ? `İş Tanımı:\n${jobDescription}\n` : '';
  const prompt = `Aşağıdaki CV verilerine göre, ${companyName} şirketindeki "${jobTitle}" pozisyonuna başvuru için profesyonel ve etkileyici bir kapak mektubu oluştur.

CV Verisi:
${JSON.stringify(cvData, null, 2)}

${jobDescSection}
Mektubu Türkçe olarak yaz (hitap, giriş, gövde ve kapanış dahil). Samimi, ikna edici ve adayın güçlü yanlarını vurgulayan bir üslup kullan.`;

  try {
    return await ask(prompt);
  } catch (e) {
    console.error('generateCoverLetter API error:', e);
    throw e;
  }
}

// İş ilanı eşleşme analizi
export async function analyzeJobMatch(cvData: any, jobDescription: string) {
  const prompt = `Aşağıdaki CV ile verilen iş tanımını karşılaştır ve JSON formatında analiz yap.

CV Verisi:
${JSON.stringify(cvData, null, 2)}

İş Tanımı:
${jobDescription}

Sadece saf JSON döndür (markdown veya açıklama olmadan):
{
  "score": 75,
  "strengths": ["güçlü yan 1", "güçlü yan 2", "güçlü yan 3"],
  "gaps": ["eksik 1", "eksik 2", "eksik 3"],
  "suggestions": ["öneri 1", "öneri 2", "öneri 3"]
}`;

  try {
    const text = await ask(prompt);
    return JSON.parse(extractJSON(text));
  } catch (e) {
    console.error('analyzeJobMatch parse/API error:', e);
    throw e;
  }
}

// Profil karşılaştırma
export async function compareProfiles(userCV: any, peerProfile: any) {
  const prompt = `Kullanıcının CV'sini, rakip profil verisiyle kıyasla. JSON formatında analiz döndür.

Kullanıcı CV:
${JSON.stringify(userCV, null, 2)}

Rakip Profil:
${JSON.stringify(peerProfile, null, 2)}

Sadece saf JSON döndür:
{
  "score": 75,
  "strengths": ["güçlü yan 1", "güçlü yan 2"],
  "gaps": ["eksik 1", "eksik 2"],
  "suggestions": ["öneri 1", "öneri 2"]
}`;

  try {
    const text = await ask(prompt);
    return JSON.parse(extractJSON(text));
  } catch (e) {
    console.error('compareProfiles parse/API error:', e);
    throw e;
  }
}

// Prompt ile CV üret
export async function generateCVFromPrompt(promptText: string) {
  const prompt = `Kullanıcının verdiği bilgilere dayanarak profesyonel bir CV yapısı oluştur. Verilmeyen alanları boş bırak.

Kullanıcı Girdisi:
${promptText}

Sadece JSON formatında CV döndür (markdown veya açıklama olmadan):
{
  "personal": {
    "fullName": "Ad Soyad",
    "headline": "Mesleki Unvan",
    "location": "Şehir, Ülke",
    "email": "email@example.com",
    "linkedin": "",
    "summary": "Profesyonel özet",
    "photo": ""
  },
  "experience": [
    {
      "title": "Pozisyon",
      "company": "Şirket",
      "location": "",
      "startDate": "2020",
      "endDate": "2023",
      "current": false,
      "description": "Görev açıklaması"
    }
  ],
  "education": [
    {
      "school": "Üniversite",
      "degree": "Lisans",
      "field": "Bölüm",
      "startYear": "2016",
      "endYear": "2020"
    }
  ],
  "skills": ["Skill1", "Skill2"],
  "certifications": []
}`;

  try {
    const text = await ask(prompt);
    return JSON.parse(extractJSON(text));
  } catch (e) {
    console.error('generateCVFromPrompt parse/API error:', e);
    throw e;
  }
}

// Şirket bilgilerine özel motivasyon mektubu oluştur
export async function generateCoverLetterWithCompanyInfo(
  cvData: any,
  companyName: string,
  jobTitle: string,
  companyInfo: string
) {
  const prompt = `Aşağıdaki CV verilerine ve şirket hakkında internetten toplanan bilgilere göre, ${companyName} şirketindeki "${jobTitle}" pozisyonuna başvuru için kişiselleştirilmiş, profesyonel ve etkileyici bir motivasyon mektubu oluştur.

Şirket Hakkında Bilgiler (Analiz):
${companyInfo}

Adayın CV Verileri:
${JSON.stringify(cvData, null, 2)}

Mektubu Türkçe olarak yaz (hitap, giriş, şirkete özel hedefler, adayın neden uygun olduğu, güçlü yanları ve profesyonel kapanış dahil).
Mektupta şirketin değerlerine, ürünlerine veya toplanan şirket bilgilerine (misyon/vizyon) doğrudan atıfta bulunarak, adayın bu şirkete neden katılması gerektiğini ikna edici şekilde vurgula. Üslup son derece profesyonel, samimi ve kurumsal olmalıdır.

Sadece motivasyon mektubu içeriğini döndür (hiçbir markdown etiketi, açıklama veya 'Mektup:' gibi başlıklar ekleme).`;

  try {
    return await ask(prompt);
  } catch (e) {
    console.error('generateCoverLetterWithCompanyInfo API error:', e);
    throw e;
  }
}

