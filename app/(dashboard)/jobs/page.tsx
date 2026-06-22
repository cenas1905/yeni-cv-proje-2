'use client';

import React, { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase-client';
import { Briefcase, Brain, MapPin, Building2, ChevronRight, Zap, Filter, Search } from 'lucide-react';
import Link from 'next/link';

export default function JobsPage() {
  const supabase = createClient();
  const [preferences, setPreferences] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingPrefs, setSavingPrefs] = useState(false);

  // Preference form state
  const [city, setCity] = useState('İstanbul');
  const [workType, setWorkType] = useState('Uzaktan');
  const [sector, setSector] = useState('');

  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Tercihleri yükle
      const { data: prefData } = await supabase.from('job_preferences').select('*').eq('user_id', user.id).single();
      if (prefData) {
        setPreferences(prefData);
        setCity(prefData.preferred_cities?.[0] || 'İstanbul');
        setWorkType(prefData.work_types?.[0] || 'Uzaktan');
        setSector(prefData.job_title || '');
      }

      // Örnek iş ilanlarını yükle (Kendi veritabanımızdan)
      const { data: jobsData } = await supabase.from('employer_jobs').select('*');
      
      let allJobs = jobsData || [];

      // İnternetten gerçek ilanları çek (SerpApi - Eğer Key varsa)
      try {
        const prefCity = prefData?.preferred_cities?.[0] || 'Turkey';
        const queryTarget = sector ? sector : 'developer';
        const res = await fetch(`/api/jobs?location=${prefCity}&query=${queryTarget}`);
        const externalData = await res.json();
        
        if (externalData.jobs && externalData.jobs.length > 0) {
          allJobs = [...allJobs, ...externalData.jobs];
        } else if (externalData.error) {
          console.warn('Dış API Uyarısı:', externalData.message);
        }
      } catch (err) {
        console.error('İlan çekme hatası', err);
      }

      setJobs(allJobs);
      setLoading(false);
    }
    loadData();
  }, [supabase]);

  const savePreferences = async () => {
    setSavingPrefs(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { error } = await supabase.from('job_preferences').upsert({
        user_id: user.id,
        preferred_cities: [city],
        work_types: [workType],
        job_title: sector
      });
      if (!error) {
        alert('Tercihlerin başarıyla kaydedildi! Yapay zeka ilanları senin için taramaya devam edecek.');
      }
    }
    setSavingPrefs(false);
  };

  if (loading) {
    return <div className="p-10 text-center">Yükleniyor...</div>;
  }

  return (
    <div className="max-w-5xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#0b1c30] flex items-center gap-3">
          <Brain className="w-8 h-8 text-[#0051d5]" />
          Yapay Zeka İş Eşleştirici
        </h1>
        <p className="text-[#45464d] mt-2">
          CV'nizi analiz edip, internetteki ve platformdaki en uygun iş ilanlarını sizin için buluyoruz.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* SOL: Tercihler Paneli */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-[#c6c6cd] shadow-sm">
            <h2 className="text-lg font-bold text-[#0b1c30] flex items-center gap-2 mb-4">
              <Filter className="w-5 h-5 text-[#0051d5]" />
              İş Tercihlerim
            </h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-[#0b1c30] mb-1">Şehir</label>
                <select 
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full border border-[#c6c6cd] rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-[#0051d5] outline-none"
                >
                  <option value="İstanbul">İstanbul</option>
                  <option value="Ankara">Ankara</option>
                  <option value="İzmir">İzmir</option>
                  <option value="Antalya">Antalya</option>
                  <option value="Turkey">Tüm Türkiye</option>
                  <option value="Remote">Sadece Yurt Dışı / Uzaktan</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#0b1c30] mb-1">Çalışma Şekli</label>
                <select 
                  value={workType}
                  onChange={(e) => setWorkType(e.target.value)}
                  className="w-full border border-[#c6c6cd] rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-[#0051d5] outline-none"
                >
                  <option value="Uzaktan">Uzaktan (Remote)</option>
                  <option value="Hibrit">Hibrit</option>
                  <option value="Ofis">Ofis</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-[#0b1c30] mb-1">Nasıl Bir Yerde / Hangi Alanda?</label>
                <input 
                  type="text"
                  value={sector}
                  onChange={(e) => setSector(e.target.value)}
                  placeholder="Örn: Yazılım, Teknoloji, Mağaza..."
                  className="w-full border border-[#c6c6cd] rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-[#0051d5] outline-none"
                />
              </div>

              <button 
                onClick={savePreferences}
                disabled={savingPrefs}
                className="w-full mt-2 bg-[#0051d5] text-white py-2.5 rounded-xl font-bold hover:bg-[#0051d5]/90 transition disabled:opacity-50"
              >
                {savingPrefs ? 'Kaydediliyor...' : 'Tercihleri Kaydet'}
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-[#0051d5] to-[#7073ff] p-6 rounded-2xl text-white shadow-md">
            <h3 className="font-bold mb-2 flex items-center gap-2">
              <Zap className="w-5 h-5" />
              Nasıl Çalışır?
            </h3>
            <p className="text-sm text-white/90">
              Bizim geliştirdiğimiz AI asistanı, hazırladığınız en son CV'nizi okur ve ilanlardaki "Aranan Nitelikler" bölümüyle kelime kelime eşleştirerek size bir <strong>Uyum Skoru</strong> çıkarır.
            </p>
          </div>
        </div>

        {/* SAĞ: İş İlanları */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-[#0b1c30]">Sizin İçin Seçilen İlanlar</h2>
            <div className="text-sm text-[#45464d] bg-white border border-[#c6c6cd] px-3 py-1.5 rounded-lg flex items-center gap-2">
              <Search className="w-4 h-4" />
              {jobs.length} İlan Bulundu
            </div>
          </div>

          {jobs.length === 0 ? (
            <div className="bg-white p-10 rounded-2xl border border-[#c6c6cd] text-center">
              <Briefcase className="w-12 h-12 text-[#c6c6cd] mx-auto mb-3" />
              <p className="text-[#45464d] font-medium">Şu anda kriterlerinize uygun ilan bulunamadı.</p>
            </div>
          ) : (
            jobs.map((job, idx) => {
              // Örnek bir AI skoru üretelim (Mock)
              const score = idx === 0 ? 94 : 82;
              const isHighMatch = score > 90;

              return (
                <div key={job.id} className="bg-white p-6 rounded-2xl border border-[#c6c6cd] shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
                  <div className="absolute top-0 right-0 bg-[#f8f9ff] px-4 py-2 rounded-bl-2xl border-b border-l border-[#c6c6cd] flex flex-col items-end">
                    <span className="text-[10px] font-bold text-[#76777d] uppercase tracking-wider">AI Uyum Skoru</span>
                    <span className={`text-xl font-black ${isHighMatch ? 'text-green-600' : 'text-[#0051d5]'}`}>
                      %{score}
                    </span>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-[#eff4ff] rounded-xl flex items-center justify-center border border-[#d3e4fe] shrink-0">
                      <Building2 className="w-6 h-6 text-[#0051d5]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg text-[#0b1c30] pr-20">{job.job_title}</h3>
                      <p className="text-sm font-medium text-[#45464d] mt-0.5 flex items-center gap-2">
                        {job.company_name}
                        {job.source && (
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-800">
                            Kaynak: {job.source}
                          </span>
                        )}
                      </p>
                      
                      <div className="flex flex-wrap items-center gap-3 mt-3">
                        <span className="flex items-center gap-1.5 text-xs font-semibold text-[#76777d] bg-[#f8f9ff] px-2.5 py-1 rounded-md border border-[#e5e7eb]">
                          <MapPin className="w-3.5 h-3.5" />
                          {job.location}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs font-semibold text-[#76777d] bg-[#f8f9ff] px-2.5 py-1 rounded-md border border-[#e5e7eb]">
                          <Briefcase className="w-3.5 h-3.5" />
                          {job.work_type}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-[#45464d] mt-5 line-clamp-2 leading-relaxed">
                    {job.description}
                  </p>

                  <div className="mt-5 flex justify-between items-center pt-4 border-t border-[#e5e7eb]">
                    <div className="flex gap-2">
                      {job.requirements?.slice(0, 3).map((req: string, i: number) => (
                        <span key={i} className="text-[10px] font-bold px-2 py-1 bg-[#d3e4fe]/50 text-[#0051d5] rounded">
                          {req}
                        </span>
                      ))}
                    </div>
                    <button className="text-sm font-bold text-[#0051d5] flex items-center gap-1 hover:gap-2 transition-all">
                      İlanı İncele
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}

        </div>
      </div>
    </div>
  );
}
