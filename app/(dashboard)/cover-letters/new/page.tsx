'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@/lib/supabase-client';
import { ArrowLeft, Sparkles, Plus, Trash2, Loader2, Check, AlertTriangle, Building2, Globe } from 'lucide-react';
import Link from 'next/link';

interface CVOption {
  id: string;
  title: string;
}

interface CompanyInput {
  name: string;
  website: string;
}

export default function NewCoverLetterPage() {
  const router = useRouter();
  const supabase = createClientComponentClient();

  const [cvs, setCvs] = useState<CVOption[]>([]);
  const [selectedCv, setSelectedCv] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [companies, setCompanies] = useState<CompanyInput[]>([{ name: '', website: '' }]);

  const [loading, setLoading] = useState(false);
  const [progressStep, setProgressStep] = useState(0);
  const [progressLog, setProgressLog] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadCvs() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const { data } = await supabase
        .from('cvs')
        .select('id, title')
        .order('created_at', { ascending: false });

      if (data && data.length > 0) {
        setCvs(data);
        setSelectedCv(data[0].id);
      }
    }
    loadCvs();
  }, [supabase, router]);

  const addCompanyRow = () => {
    if (companies.length >= 5) return;
    setCompanies([...companies, { name: '', website: '' }]);
  };

  const removeCompanyRow = (index: number) => {
    if (companies.length <= 1) return;
    setCompanies(companies.filter((_, idx) => idx !== index));
  };

  const updateCompany = (index: number, field: keyof CompanyInput, value: string) => {
    const newCompanies = [...companies];
    newCompanies[index][field] = value;
    setCompanies(newCompanies);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCv) {
      setError('Lütfen kaynak bir CV seçin.');
      return;
    }
    if (!jobTitle.trim()) {
      setError('Lütfen başvurulan pozisyonu girin.');
      return;
    }

    const validCompanies = companies.filter(c => c.name.trim() !== '');
    if (validCompanies.length === 0) {
      setError('Lütfen en az bir şirket ismi girin.');
      return;
    }

    setLoading(true);
    setError(null);
    setProgressStep(0);
    setProgressLog([]);

    // Progress updates simulator
    const addLog = (msg: string) => {
      setProgressLog(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
    };

    try {
      addLog('Oturum doğrulanıyor...');
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Oturum bulunamadı.');

      // Phase 1: Apify scraping
      setProgressStep(1);
      addLog('Apify Şirket Bilgi Çıkarıcı başlatılıyor...');
      validCompanies.forEach(c => {
        addLog(`${c.name} için Apify araştırma görevi kuyruğa alındı.`);
      });

      // Send requests
      const response = await fetch('/api/cover-letter/generate-bulk', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cvId: selectedCv,
          jobTitle: jobTitle.trim(),
          companies: validCompanies.map(c => ({
            companyName: c.name.trim(),
            companyWebsite: c.website.trim()
          }))
        })
      });

      // Simulate step transitions
      const interval = setInterval(() => {
        setProgressStep(prev => {
          if (prev === 1) {
            addLog('Yapay zeka analizleri başlatıldı...');
            addLog('CV ve şirket verileri eşleştiriliyor...');
            return 2;
          }
          if (prev === 2) {
            addLog('Motivasyon mektubu taslakları yazılıyor...');
            addLog('PDF şablonları derleniyor...');
            return 3;
          }
          clearInterval(interval);
          return 3;
        });
      }, 5000);

      const result = await response.json();
      clearInterval(interval);

      if (!response.ok) {
        throw new Error(result.error || 'Mektuplar oluşturulurken sunucu hatası oluştu.');
      }

      setProgressStep(4);
      addLog('Tüm mektuplar başarıyla oluşturuldu ve veritabanına kaydedildi!');
      
      // Delay for success view
      setTimeout(() => {
        router.push('/cover-letters');
      }, 2000);

    } catch (err: any) {
      console.error(err);
      setError(err?.message || 'Mektuplar oluşturulurken bir hata oluştu.');
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8 py-4 font-sans text-white">
      <Link href="/cover-letters" className="inline-flex items-center gap-2 text-xs font-medium text-slate-500 hover:text-white transition-colors">
        <ArrowLeft className="w-3.5 h-3.5" /> Geri Dön
      </Link>

      <div className="space-y-2">
        <h1 className="text-3xl font-black tracking-tight">Yeni Motivasyon Mektubu Üret</h1>
        <p className="text-slate-400 text-sm">Apify ile şirketleri analiz edin, CV'nizi eşleştirerek kişiselleştirilmiş toplu mektuplar yazın.</p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold mb-0.5">Bir Hata Oluştu</div>
            <div>{error}</div>
          </div>
        </div>
      )}

      {loading ? (
        <div className="p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06] space-y-6">
          <div className="flex flex-col items-center justify-center py-6 text-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 rounded-full blur-xl bg-indigo-500/20 animate-pulse"></div>
              <Loader2 className="w-12 h-12 text-indigo-400 animate-spin relative z-10" />
            </div>
            <h3 className="font-bold text-lg">Mektuplarınız Hazırlanıyor</h3>
            <p className="text-slate-400 text-xs mt-1.5 max-w-xs">
              {progressStep === 1 && 'Apify ile şirketlerin internet verileri toplanıyor...'}
              {progressStep === 2 && 'Yapay zeka ile şirket bilgileri ve CV\'niz eşleştiriliyor...'}
              {progressStep === 3 && 'Her şirkete özel motivasyon mektupları oluşturuluyor...'}
              {progressStep === 4 && 'İşlem tamamlandı! Yönlendiriliyorsunuz...'}
            </p>
          </div>

          {/* Steps Indicator */}
          <div className="grid grid-cols-4 gap-2 text-center text-[10px] font-semibold text-slate-500 border-t border-white/[0.06] pt-6">
            <div className={progressStep >= 1 ? 'text-indigo-400' : ''}>1. Şirket Araştırması</div>
            <div className={progressStep >= 2 ? 'text-indigo-400' : ''}>2. Uyum Analizi</div>
            <div className={progressStep >= 3 ? 'text-indigo-400' : ''}>3. Mektup Yazımı</div>
            <div className={progressStep >= 4 ? 'text-indigo-400' : ''}>4. Hazır!</div>
          </div>

          {/* Progress Logs Console */}
          <div className="bg-black/60 rounded-xl p-4 border border-white/5 font-mono text-[10px] text-slate-400 space-y-1.5 h-36 overflow-y-auto">
            {progressLog.map((log, i) => (
              <div key={i} className="truncate">{log}</div>
            ))}
          </div>
        </div>
      ) : cvs.length === 0 ? (
        <div className="p-8 text-center border border-dashed border-white/10 rounded-2xl bg-white/[0.01]">
          <h3 className="font-bold text-slate-300">Önce Bir CV Oluşturmalısınız</h3>
          <p className="text-slate-500 text-xs mt-1">Motivasyon mektubu oluşturabilmek için sistemde kayıtlı en az bir özgeçmişinizin olması gerekir.</p>
          <Link href="/dashboard/cv/new" className="mt-4 inline-flex bg-white text-black text-xs font-semibold px-4 py-2 rounded-lg">
            CV Oluştur
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* CV & Job Selection */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Kaynak CV</label>
              <select
                value={selectedCv}
                onChange={(e) => setSelectedCv(e.target.value)}
                className="w-full bg-[#060608] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-white"
              >
                {cvs.map(c => (
                  <option key={c.id} value={c.id} className="bg-[#0c0c10]">{c.title}</option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold text-slate-300">Başvurulan Pozisyon</label>
              <input
                type="text"
                placeholder="Örn: Frontend Developer"
                value={jobTitle}
                onChange={(e) => setJobTitle(e.target.value)}
                required
                className="w-full bg-[#060608] border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all text-white"
              />
            </div>
          </div>

          {/* Companies List */}
          <div className="space-y-3.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-300">Hedef Şirketler (En fazla 5 adet)</label>
              <span className="text-[10px] text-indigo-400 font-bold bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20 flex items-center gap-1">
                <Sparkles className="w-3 h-3" /> Epify ile Analiz Edilir
              </span>
            </div>

            <div className="space-y-3">
              {companies.map((company, index) => (
                <div key={index} className="flex items-center gap-3 bg-white/[0.01] p-4 rounded-xl border border-white/[0.05] relative group">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 flex-1">
                    <div className="flex items-center gap-2 bg-black/30 border border-white/5 rounded-lg px-3 py-2 text-sm focus-within:border-indigo-500/50">
                      <Building2 className="w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        placeholder="Şirket Adı (Örn: Google)"
                        value={company.name}
                        onChange={(e) => updateCompany(index, 'name', e.target.value)}
                        required
                        className="bg-transparent border-none outline-none w-full text-xs placeholder:text-slate-600 focus:ring-0"
                      />
                    </div>

                    <div className="flex items-center gap-2 bg-black/30 border border-white/5 rounded-lg px-3 py-2 text-sm focus-within:border-indigo-500/50">
                      <Globe className="w-4 h-4 text-slate-500" />
                      <input
                        type="url"
                        placeholder="Web Sitesi (Opsiyonel - örn: google.com)"
                        value={company.website}
                        onChange={(e) => updateCompany(index, 'website', e.target.value)}
                        className="bg-transparent border-none outline-none w-full text-xs placeholder:text-slate-600 focus:ring-0"
                      />
                    </div>
                  </div>

                  {companies.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeCompanyRow(index)}
                      className="text-slate-500 hover:text-red-400 p-2 hover:bg-red-500/10 rounded-lg transition-all border border-transparent"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              ))}
            </div>

            {companies.length < 5 && (
              <button
                type="button"
                onClick={addCompanyRow}
                className="w-full py-3 border border-dashed border-white/10 hover:border-white/20 rounded-xl text-xs font-semibold text-slate-400 hover:text-white flex items-center justify-center gap-1.5 transition-all bg-white/[0.01]"
              >
                <Plus className="w-4 h-4" /> Başka Şirket Ekle
              </button>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-xl bg-white text-black font-bold flex items-center justify-center gap-2 hover:bg-slate-200 transition-all shadow-lg shadow-white/5 active:scale-[0.98]"
          >
            Motivasyon Mektupları Üret <Sparkles className="w-4 h-4 text-indigo-600" />
          </button>
        </form>
      )}
    </div>
  );
}
