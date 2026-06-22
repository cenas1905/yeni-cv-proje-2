import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { cvText, jobDescription } = await request.json();
    const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

    if (!OPENAI_API_KEY) {
      // API anahtarı yoksa simüle edilmiş bir skor döndür
      return NextResponse.json({
        score: Math.floor(Math.random() * 30) + 65, // 65-95 arası rastgele skor
        reasoning: "Gerçek analiz için .env.local dosyasına OPENAI_API_KEY eklenmelidir. Bu geçici bir skordur."
      });
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'Sen uzman bir İnsan Kaynakları yapay zekasısın. Görevin, verilen CV metnini ve İş İlanı metnini karşılaştırıp adayın bu işe yüzde kaç (%0-100) uygun olduğunu bulmak. SADECE JSON formatında şu objeyi döndür: {"score": 85, "reasoning": "Kısa bir açıklama"}. Başka hiçbir yazı yazma.'
          },
          {
            role: 'user',
            content: `CV METNİ:\n${cvText}\n\nİŞ İLANI METNİ:\n${jobDescription}`
          }
        ],
        temperature: 0.3
      })
    });

    const data = await response.json();
    if (data.choices && data.choices[0]) {
      const content = data.choices[0].message.content;
      try {
        const parsed = JSON.parse(content);
        return NextResponse.json({ score: parsed.score, reasoning: parsed.reasoning });
      } catch (e) {
        // Fallback parsing
        const scoreMatch = content.match(/\d+/);
        return NextResponse.json({ score: scoreMatch ? parseInt(scoreMatch[0]) : 75, reasoning: content });
      }
    }

    return NextResponse.json({ score: 50, reasoning: 'Analiz yapılamadı.' });
  } catch (error) {
    console.error('AI match error:', error);
    return NextResponse.json({ error: 'Yapay zeka analizinde hata oluştu.' }, { status: 500 });
  }
}
