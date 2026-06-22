'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { CheckCircle2, AlertTriangle, Lightbulb, Sparkles } from 'lucide-react';

interface JobMatcherProps {
  cvData: any;
  isPro: boolean;
}

export default function JobMatcher({ cvData, isPro }: JobMatcherProps) {
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPro) {
      setError('İş İlanı Eşleştirme özelliği sadece PRO üyeler içindir.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch('/api/ai/job-match', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ cvData, jobDescription })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Analiz yapılırken hata oluştu.');
      }

      const data = await response.json();
      setResult(data.analysis);
    } catch (err: any) {
      setError(err.message || 'Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6" style={{ fontFamily: 'Inter, sans-serif' }}>
      <Card className="border-[#c6c6cd] bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-[#0b1c30] flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#0051d5]" />
            <span>AI İş İlanı Eşleştirme (Job Matching)</span>
          </CardTitle>
          <CardDescription className="text-[#76777d] font-medium">
            Hedeflediğiniz iş ilanının metnini yapıştırın; özgeçmişinizle olan uyumluluğunu, eksiklerinizi ve iyileştirme tavsiyelerini anında raporlayalım.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAnalyze} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="job-desc-matcher" className="text-[#0b1c30] text-sm font-bold">İş Tanımı Metni</Label>
              <Textarea
                id="job-desc-matcher"
                placeholder="İş tanımını, sorumlulukları ve aranan nitelikleri buraya yapıştırın..."
                required
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                disabled={loading}
                className="bg-[#f8f9ff] border-[#c6c6cd] text-[#0b1c30] placeholder-[#76777d] focus-visible:ring-[#0051d5] min-h-[150px] leading-relaxed"
              />
            </div>

            {error && (
              <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-[#0051d5] hover:bg-[#316bf3] text-white font-bold shadow-md shadow-[#0051d5]/20"
            >
              {loading ? 'Analiz Ediliyor...' : 'Eşleşmeyi Analiz Et'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {result && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Radial score card */}
          <Card className="border-[#c6c6cd] bg-white flex flex-col items-center justify-center p-6 text-center lg:col-span-1 shadow-sm">
            <CardHeader className="p-0 mb-4">
              <CardTitle className="text-sm font-bold text-[#45464d] uppercase tracking-wider">Eşleşme Puanı</CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex flex-col items-center justify-center">
              {/* Circular progress bar SVG */}
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="72"
                    cy="72"
                    r="60"
                    className="stroke-[#c6c6cd]"
                    strokeWidth="10"
                    fill="transparent"
                  />
                  <circle
                    cx="72"
                    cy="72"
                    r="60"
                    className="stroke-[#0051d5] transition-all duration-1000"
                    strokeWidth="10"
                    fill="transparent"
                    strokeDasharray={2 * Math.PI * 60}
                    strokeDashoffset={2 * Math.PI * 60 * (1 - result.score / 100)}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="absolute text-3xl font-black text-[#0b1c30]">{result.score}%</span>
              </div>
              <p className="text-xs text-[#76777d] mt-4 font-medium leading-relaxed max-w-[200px]">
                {result.score >= 80 
                  ? 'Harika bir uyum! Bu ilana özgeçmişinizle doğrudan başvurabilirsiniz.'
                  : result.score >= 60 
                  ? 'Güçlü bir uyum, ancak CV\'nizi optimize ederek şansınızı artırabilirsiniz.'
                  : 'Düşük uyum. CV\'nizi ilana göre güncellemeniz oldukça kritik.'}
              </p>
            </CardContent>
          </Card>

          {/* Analysis details */}
          <div className="lg:col-span-2 space-y-4">
            {/* Strengths */}
            <Card className="border-[#c6c6cd] bg-white shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold text-emerald-600 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4.5 h-4.5" />
                  Güçlü Yanlarınız
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-[#45464d] space-y-2">
                {result.strengths?.map((str: string, idx: number) => (
                  <div key={idx} className="flex gap-2">
                    <span className="text-emerald-500 font-bold shrink-0">•</span>
                    <p>{str}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Gaps */}
            <Card className="border-[#c6c6cd] bg-white shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold text-orange-600 flex items-center gap-1.5">
                  <AlertTriangle className="w-4.5 h-4.5" />
                  CV'nizde Eksik Kalanlar
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-[#45464d] space-y-2">
                {result.gaps?.map((gap: string, idx: number) => (
                  <div key={idx} className="flex gap-2">
                    <span className="text-orange-500 font-bold shrink-0">•</span>
                    <p>{gap}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Suggestions */}
            <Card className="border-[#c6c6cd] bg-white shadow-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-bold text-[#0051d5] flex items-center gap-1.5">
                  <Lightbulb className="w-4.5 h-4.5" />
                  CV Optimizasyon Önerileri
                </CardTitle>
              </CardHeader>
              <CardContent className="text-xs text-[#45464d] space-y-2">
                {result.suggestions?.map((sug: string, idx: number) => (
                  <div key={idx} className="flex gap-2">
                    <span className="text-[#0051d5] font-bold shrink-0">•</span>
                    <p>{sug}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
