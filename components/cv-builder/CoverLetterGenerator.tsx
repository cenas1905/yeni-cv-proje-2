'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Copy, Download, FileText, Sparkles, Check, Share2 } from 'lucide-react';
import { createClientComponentClient } from '@/lib/supabase-client';

interface CoverLetterGeneratorProps {
  cvId: string;
  cvSlug: string;
  cvData: any;
  isPro: boolean;
}

export default function CoverLetterGenerator({ cvId, cvSlug, cvData, isPro }: CoverLetterGeneratorProps) {
  const [companyName, setCompanyName] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [coverLetter, setCoverLetter] = useState<string | null>(cvData?.coverLetter || null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const supabase = createClientComponentClient();
  const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/cv/${cvSlug}/cover-letter` : '';

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setCoverLetter(null);

    try {
      const response = await fetch('/api/ai/cover-letter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ cvData, companyName, jobTitle, jobDescription })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Ön yazı üretilirken hata oluştu.');
      }

      const result = await response.json();
      setCoverLetter(result.coverLetter);

      // Auto-save generated cover letter details into cvData in Supabase
      const updatedData = {
        ...cvData,
        coverLetter: result.coverLetter,
        coverLetterCompany: companyName,
        coverLetterJob: jobTitle
      };

      await supabase
        .from('cvs')
        .update({ data: updatedData })
        .eq('id', cvId);

    } catch (err: any) {
      setError(err.message || 'Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!coverLetter) return;
    navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  const handleDownload = () => {
    if (!coverLetter) return;
    const element = document.createElement('a');
    const file = new Blob([coverLetter], { type: 'text/plain;charset=utf-8' });
    element.href = URL.createObjectURL(file);
    element.download = `${companyName.replace(/\s+/g, '_')}_On_Yazi.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="space-y-6" style={{ fontFamily: 'Inter, sans-serif' }}>
      <Card className="border-[#c6c6cd] bg-white shadow-sm">
        <CardHeader>
          <CardTitle className="text-lg font-bold text-[#0b1c30] flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#0051d5]" />
            <span>AI Ön Yazı (Cover Letter) Oluşturucu</span>
          </CardTitle>
          <CardDescription className="text-[#76777d] font-medium">
            Başvurmak istediğiniz şirkete ve pozisyona özel, CV'nizle tam uyumlu profesyonel ön yazılar tasarlayın.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleGenerate} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="company-name" className="text-[#0b1c30] text-sm font-bold">Şirket Adı</Label>
                <Input
                  id="company-name"
                  type="text"
                  placeholder="Örn: Teknoloji A.Ş., Lojistik Firması"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  disabled={loading}
                  className="bg-[#f8f9ff] border-[#c6c6cd] text-[#0b1c30] placeholder-[#76777d] focus-visible:ring-[#0051d5]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="job-title" className="text-[#0b1c30] text-sm font-bold">Pozisyon</Label>
                <Input
                  id="job-title"
                  type="text"
                  placeholder="Örn: Frontend Developer, Ürün Yöneticisi"
                  required
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  disabled={loading}
                  className="bg-[#f8f9ff] border-[#c6c6cd] text-[#0b1c30] placeholder-[#76777d] focus-visible:ring-[#0051d5]"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="job-desc" className="text-[#0b1c30] text-sm font-bold">İş Tanımı / İlan Detayları (Opsiyonel)</Label>
              <Textarea
                id="job-desc"
                placeholder="İlan detaylarını buraya yapıştırırsanız, AI yazınızı ilandaki anahtar kelimelere göre tam olarak optimize eder..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                disabled={loading}
                className="bg-[#f8f9ff] border-[#c6c6cd] text-[#0b1c30] placeholder-[#76777d] focus-visible:ring-[#0051d5] min-h-[100px]"
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
              {loading ? 'Kapak Yazısı Hazırlanıyor...' : 'Ön Yazı Oluştur'}
            </Button>
          </form>
        </CardContent>
      </Card>

      {coverLetter && (
        <Card className="border-emerald-200 bg-emerald-50 p-4 space-y-3 rounded-xl text-left shadow-sm">
          <div className="flex items-center gap-2">
            <Share2 className="w-4.5 h-4.5 text-emerald-600" />
            <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider">Ön Yazı Paylaşım Linki</h4>
          </div>
          <div className="flex gap-2">
            <Input
              readOnly
              value={shareUrl}
              className="bg-white border-emerald-200 text-emerald-700 font-mono text-xs select-all focus-visible:ring-emerald-500"
            />
            <Button onClick={handleCopyLink} size="icon" className="bg-emerald-600 hover:bg-emerald-700 h-9 w-9 shrink-0 shadow-sm text-white">
              {copiedLink ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </Button>
          </div>
          {!isPro ? (
            <p className="text-[10px] text-emerald-700 font-medium">
              Bu bağlantı <strong>7 gün boyunca</strong> aktif kalacaktır. Kalıcı hale getirmek için hesabınızı Pro'ya yükseltin.
            </p>
          ) : (
            <p className="text-[10px] text-emerald-700 font-bold">
              ✨ Pro plan kapsamında bu bağlantı <strong>kalıcıdır</strong> ve süresi dolmaz.
            </p>
          )}
        </Card>
      )}

      {coverLetter && (
        <Card className="border-[#c6c6cd] bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b border-[#c6c6cd]/50">
            <CardTitle className="text-sm font-bold text-[#0051d5] flex items-center gap-1.5">
              <FileText className="w-4 h-4" />
              Hazırlanan Ön Yazı Taslağı
            </CardTitle>
            <div className="flex gap-2">
              <Button size="sm" variant="ghost" onClick={handleCopy} className="text-[#45464d] hover:text-[#0051d5] h-8 w-8 p-0">
                {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </Button>
              <Button size="sm" variant="ghost" onClick={handleDownload} className="text-[#45464d] hover:text-[#0051d5] h-8 w-8 p-0">
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-4 text-left">
            <pre className="text-[#0b1c30] font-sans text-sm whitespace-pre-wrap leading-relaxed">
              {coverLetter}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
