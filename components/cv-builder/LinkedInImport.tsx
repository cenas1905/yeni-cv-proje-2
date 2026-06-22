'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface LinkedInImportProps {
  onImportSuccess: (data: any) => void;
  isPro: boolean;
}

export default function LinkedInImport({ onImportSuccess, isPro }: LinkedInImportProps) {
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statusText, setStatusText] = useState('');

  const handleImport = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkedinUrl.includes('linkedin.com/')) {
      setError('Lütfen geçerli bir LinkedIn URL adresi girin.');
      return;
    }

    setLoading(true);
    setError(null);
    setStatusText('Apify LinkedIn Scraper başlatılıyor...');

    try {
      const response = await fetch('/api/linkedin/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ linkedinUrl })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Profil çekilirken bir hata oluştu.');
      }

      setStatusText('LinkedIn profil verisi çözümleniyor...');
      const result = await response.json();
      onImportSuccess(result.data);
      setStatusText('Başarıyla aktarıldı!');
      setLinkedinUrl('');
    } catch (err: any) {
      setError(err.message || 'Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="border-[#c6c6cd] bg-white shadow-sm" style={{ fontFamily: 'Inter, sans-serif' }}>
      <CardHeader>
        <CardTitle className="text-lg font-bold text-[#0b1c30] flex items-center gap-2">
          <span>🔗 LinkedIn'den Otomatik Import</span>
          {!isPro && (
            <span className="text-[10px] bg-[#eff4ff] text-[#0051d5] font-bold px-2 py-0.5 rounded-full border border-[#0051d5]/20">
              1 Hak (Free)
            </span>
          )}
        </CardTitle>
        <CardDescription className="text-[#76777d] font-medium">
          LinkedIn profil URL'nizi girin. Yapay zeka ile tüm işlerinizi, eğitiminizi ve sertifikalarınızı saniyeler içinde çekelim.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleImport} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="linkedin-url" className="text-[#0b1c30] text-sm font-bold">LinkedIn Profil Linki</Label>
            <div className="flex gap-2">
              <Input
                id="linkedin-url"
                type="url"
                placeholder="https://www.linkedin.com/in/kullaniciadi"
                required
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                disabled={loading}
                className="bg-[#f8f9ff] border-[#c6c6cd] text-[#0b1c30] placeholder-[#76777d] focus-visible:ring-[#0051d5] focus-visible:ring-offset-0 flex-1"
              />
              <Button
                type="submit"
                disabled={loading}
                className="bg-[#0051d5] hover:bg-[#316bf3] text-white shadow-md shadow-[#0051d5]/20 font-bold"
              >
                {loading ? 'İçe Aktarılıyor...' : 'Profili Çek'}
              </Button>
            </div>
          </div>
          
          {loading && (
            <div className="flex items-center space-x-2 text-sm text-[#0051d5] font-bold bg-[#eff4ff] p-2.5 rounded-lg border border-[#0051d5]/20 shadow-sm">
              <div className="w-4 h-4 border-2 border-[#0051d5] border-t-transparent rounded-full animate-spin" />
              <span>{statusText}</span>
            </div>
          )}

          {error && (
            <div className="p-3 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg font-medium">
              {error}
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
