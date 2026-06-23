'use client';

import React, { useState, useEffect } from 'react';
import { createClientComponentClient } from '@/lib/supabase-client';
import { Briefcase, Brain, MapPin, Building2, ChevronRight, Zap, Filter, Search, Link as LinkIcon, User, Save, RefreshCw } from 'lucide-react';

export default function DashboardJobsPage() {
  const supabase = createClientComponentClient();
  const [preferences, setPreferences] = useState<any>(null);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingPrefs, setSavingPrefs] = useState(false);
  const [searchingJobs, setSearchingJobs] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Form states
  const [cvUrl, setCvUrl] = useState('');
  const [age, setAge] = useState('');
  const [city, setCity] = useState('İstanbul');
  const [district, setDistrict] = useState('');
  const [jobType, setJobType] = useState('');
  const [randomJobs, setRandomJobs] = useState(false);

  useEffect(() => {
    async function loadPreferences() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: prefData } = await supabase.from('job_preferences').select('*').eq('user_id', user.id).single();
      if (prefData) {
        setPreferences(prefData);
        setCity(prefData.preferred_cities?.[0] || 'İstanbul');
        setJobType(prefData.job_title || '');
        // We will store age, district, cv_url in metadata if needed, but for now we populate local state
      }
      setLoading(false);
    }
    loadPreferences();
  }, [supabase]);

  const savePreferences = async () => {
    setSavingPrefs(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { error } = await supabase.from('job_preferences').upsert({
        user_id: user.id,
        preferred_cities: [city],
        job_title: jobType,
        // Using updated_at to track saves
        updated_at: new Date().toISOString()
      });
      if (!error) {
        alert('Tercihlerin başarıyla kaydedildi!');
      } else {
        alert('Kaydetme hatası: ' + error.message);
      }
    } else {
      alert('Giriş yapmanız gerekiyor.');
    }
    setSavingPrefs(false);
  };

  const handleSearch = async () => {
    setSearchingJobs(true);
    setHasSearched(true);
    setJobs([]); // Clear previous jobs
    
    // Construct query
    let queryTarget = jobType;
    let locationTarget = city;
    
    if (district && district.trim() !== '') {
      locationTarget = `${district}, ${city}, Turkey`;
    } else {
      locationTarget = `${city}, Turkey`;
    }

    if (randomJobs || !jobType) {
      queryTarget = 'Genel Başvuru';
    }

    try {
      const res = await fetch(`/api/jobs?location=${encodeURIComponent(locationTarget)}&query=${encodeURIComponent(queryTarget)}`);
      const externalData = await res.json();
      
      if (externalData.jobs && externalData.jobs.length > 0) {
        setJobs(externalData.jobs);
      }
    } catch (err) {
      console.error('İlan çekme hatası', err);
    }
    
    setSearchingJobs(false);
  };

  if (loading) {
    return <div className="p-10 text-center text-[#45464d] font-medium">Yükleniyor...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="mb-8 border-b border-[#c6c6cd] pb-6">
        <h1 className="text-3xl font-black text-[#0b1c30] flex items-center gap-3">
          <Briefcase className="w-8 h-8 text-[#0051d5]" />
          İş Fırsatlarım
        </h1>
        <p className="text-[#45464d] mt-2 font-medium">
          Bilgilerini gir, kriterlerini belirle ve internetteki en güncel gerçek iş ilanlarına anında ulaş.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* SOL: Tercihler Paneli (Form) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-[#c6c6cd] shadow-md sticky top-24">
            <h2 className="text-lg font-black text-[#0b1c30] flex items-center gap-2 mb-5">
              <Filter className="w-5 h-5 text-[#0051d5]" />
              İş Arama Kriterlerim
            </h2>
            
            <div className="space-y-4">
              {/* CV URL */}
              <div>
                <label className="block text-sm font-bold text-[#0b1c30] mb-1.5 flex items-center gap-1.5">
                  <LinkIcon className="w-4 h-4 text-[#76777d]" /> CV URL'si
                </label>
                <input 
                  type="url"
                  value={cvUrl}
                  onChange={(e) => setCvUrl(e.target.value)}
                  placeholder="Örn: cvio-ai.com.tr/cv/ali-yilmaz"
                  className="w-full border border-[#c6c6cd] rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#0051d5] outline-none bg-[#f8f9ff]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Yaş */}
                <div>
                  <label className="block text-sm font-bold text-[#0b1c30] mb-1.5 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-[#76777d]" /> Yaş
                  </label>
                  <input 
                    type="number"
                    value={age}
                    onChange={(e) => setAge(e.target.value)}
                    placeholder="Örn: 24"
                    className="w-full border border-[#c6c6cd] rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#0051d5] outline-none bg-[#f8f9ff]"
                  />
                </div>
                {/* Şehir */}
                <div>
                  <label className="block text-sm font-bold text-[#0b1c30] mb-1.5 flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-[#76777d]" /> Şehir
                  </label>
                  <select 
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full border border-[#c6c6cd] rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#0051d5] outline-none bg-[#f8f9ff]"
                  >
                    <option value="İstanbul">İstanbul</option>
                    <option value="Ankara">Ankara</option>
                    <option value="İzmir">İzmir</option>
                    <option value="Bursa">Bursa</option>
                    <option value="Antalya">Antalya</option>
                    <option value="Turkey">Farketmez</option>
                  </select>
                </div>
              </div>

              {/* İlçe */}
              <div>
                <label className="block text-sm font-bold text-[#0b1c30] mb-1.5">
                  İlçe <span className="text-xs text-[#76777d] font-normal">(Opsiyonel)</span>
                </label>
                <input 
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="Örn: Kadıköy, Çankaya..."
                  className="w-full border border-[#c6c6cd] rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#0051d5] outline-none bg-[#f8f9ff]"
                />
              </div>

              {/* Ne Tür İş */}
              <div>
                <label className="block text-sm font-bold text-[#0b1c30] mb-1.5">
                  Ne Tür İş İstiyorsun?
                </label>
                <input 
                  type="text"
                  value={jobType}
                  onChange={(e) => setJobType(e.target.value)}
                  placeholder="Örn: Garson, Kasiyer, Kaynakçı..."
                  disabled={randomJobs}
                  className="w-full border border-[#c6c6cd] rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-[#0051d5] outline-none bg-[#f8f9ff] disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              {/* Rastgele İş İlanları */}
              <div className="flex items-center gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl mt-2 cursor-pointer hover:bg-amber-100 transition-colors" onClick={() => setRandomJobs(!randomJobs)}>
                <div className={`w-5 h-5 rounded flex items-center justify-center border transition-colors ${randomJobs ? 'bg-amber-500 border-amber-500' : 'bg-white border-[#c6c6cd]'}`}>
                  {randomJobs && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                </div>
                <span className="text-sm font-bold text-amber-900 select-none">Rastgele İş İlanları</span>
              </div>

              {/* Butonlar */}
              <div className="pt-4 flex flex-col gap-3 border-t border-[#e5e7eb] mt-6">
                <button 
                  onClick={savePreferences}
                  disabled={savingPrefs}
                  className="w-full flex items-center justify-center gap-2 bg-white border-2 border-[#0051d5] text-[#0051d5] py-3 rounded-xl font-bold hover:bg-[#eff4ff] transition disabled:opacity-50"
                >
                  <Save className="w-4 h-4" />
                  {savingPrefs ? 'Kaydediliyor...' : 'Tercihleri Kaydet'}
                </button>
                <button 
                  onClick={handleSearch}
                  disabled={searchingJobs}
                  className="w-full flex items-center justify-center gap-2 bg-[#0051d5] text-white py-3.5 rounded-xl font-black text-lg hover:bg-[#0051d5]/90 hover:scale-[1.02] transition shadow-lg shadow-[#0051d5]/30 disabled:opacity-70 disabled:hover:scale-100"
                >
                  {searchingJobs ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <Search className="w-5 h-5" />
                  )}
                  {searchingJobs ? 'İlanlar Taranıyor...' : 'İş Ara'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* SAĞ: İş İlanları Sonuçları */}
        <div className="lg:col-span-8">
          <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-xl border border-[#c6c6cd] shadow-sm">
            <h2 className="text-xl font-black text-[#0b1c30] flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-500" />
              Sizin İçin Seçilen İlanlar
            </h2>
            {hasSearched && (
              <div className="text-sm font-bold text-[#0051d5] bg-[#eff4ff] px-3 py-1.5 rounded-lg border border-[#d3e4fe]">
                {jobs.length} İlan Bulundu
              </div>
            )}
          </div>

          {!hasSearched ? (
            <div className="bg-white p-12 rounded-2xl border border-[#c6c6cd] text-center shadow-sm h-[400px] flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-[#f8f9ff] rounded-full flex items-center justify-center mb-4 border-2 border-dashed border-[#c6c6cd]">
                <Search className="w-8 h-8 text-[#76777d]" />
              </div>
              <h3 className="text-lg font-bold text-[#0b1c30] mb-2">Arama Bekleniyor</h3>
              <p className="text-[#45464d] max-w-sm mx-auto">
                Sol taraftaki formu doldurup "İş Ara" butonuna bastığınızda, gerçek internet ilanları (İşkur, LinkedIn vb.) burada listelenecektir.
              </p>
            </div>
          ) : searchingJobs ? (
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-[#c6c6cd] animate-pulse flex gap-4">
                  <div className="w-14 h-14 bg-[#e5e7eb] rounded-xl shrink-0" />
                  <div className="flex-1 space-y-3">
                    <div className="h-5 w-1/2 bg-[#e5e7eb] rounded" />
                    <div className="h-4 w-1/3 bg-[#e5e7eb] rounded" />
                    <div className="h-3 w-3/4 bg-[#e5e7eb] rounded mt-4" />
                  </div>
                </div>
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <div className="bg-white p-12 rounded-2xl border border-[#c6c6cd] text-center shadow-sm">
              <Briefcase className="w-16 h-16 text-[#c6c6cd] mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#0b1c30] mb-2">Kriterlere Uygun İlan Bulunamadı</h3>
              <p className="text-[#45464d]">Arama kriterlerinizi genişletmeyi veya farklı bir şehir/ilçe denemeyi düşünebilirsiniz.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {jobs.map((job, idx) => {
                const isHighMatch = idx % 3 === 0; // Simulate some high matches
                
                return (
                  <div key={job.id} className="bg-white p-6 rounded-2xl border border-[#c6c6cd] shadow-sm hover:shadow-lg hover:border-[#0051d5] transition-all duration-300 relative flex flex-col group">
                    {/* Source Badge */}
                    <div className="absolute top-4 right-4 bg-amber-100 text-amber-800 text-[10px] font-black px-2 py-1 rounded-md uppercase tracking-wide border border-amber-200">
                      GERÇEK İLAN
                    </div>

                    <div className="flex items-start gap-4 mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-[#eff4ff] to-[#e1e0ff] rounded-xl flex items-center justify-center border border-[#d3e4fe] shrink-0 shadow-inner">
                        <Building2 className="w-6 h-6 text-[#0051d5]" />
                      </div>
                      <div className="pr-16">
                        <h3 className="font-black text-lg text-[#0b1c30] leading-tight group-hover:text-[#0051d5] transition-colors line-clamp-2">
                          {job.job_title}
                        </h3>
                        <p className="text-sm font-semibold text-[#45464d] mt-1">
                          {job.company_name}
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-2 mb-4">
                      <span className="flex items-center gap-1.5 text-[11px] font-bold text-[#76777d] bg-[#f8f9ff] px-2.5 py-1 rounded-md border border-[#e5e7eb]">
                        <MapPin className="w-3.5 h-3.5" />
                        {job.location}
                      </span>
                      <span className="flex items-center gap-1.5 text-[11px] font-bold text-[#76777d] bg-[#f8f9ff] px-2.5 py-1 rounded-md border border-[#e5e7eb]">
                        <Briefcase className="w-3.5 h-3.5" />
                        {job.work_type}
                      </span>
                    </div>

                    <p className="text-xs text-[#45464d] line-clamp-3 leading-relaxed mb-6 flex-1">
                      {job.description || 'Bu ilan için detaylı açıklama metni bulunmamaktadır. İlanın detaylarını görmek için orijinal kaynağa gidebilirsiniz.'}
                    </p>

                    <div className="mt-auto pt-4 border-t border-[#e5e7eb]">
                      <a 
                        href={`https://www.google.com/search?q=${encodeURIComponent(job.company_name + ' ' + job.job_title + ' iş ilanı')}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="w-full flex items-center justify-center bg-[#f8f9ff] text-[#0b1c30] hover:bg-amber-500 hover:text-white hover:border-amber-500 font-bold px-4 py-2.5 rounded-xl border border-[#c6c6cd] transition-all duration-300 gap-2"
                      >
                        Kaynağa Git <ChevronRight className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
