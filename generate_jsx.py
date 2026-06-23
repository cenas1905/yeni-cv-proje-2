import re

def create_page():
    # Read the utf8 html to extract parts if needed, but we can also just write the JSX directly 
    # since we have the exact classes.

    jsx = """'use client';

import React, { useState, useEffect } from 'react';
import { createClientComponentClient } from '@/lib/supabase-client';
import { Briefcase, Brain, MapPin, Building2, ChevronRight, Zap, Filter, Search, Link as LinkIcon, User, Save, RefreshCw, AutoAwesome } from 'lucide-react';

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
    setJobs([]); 
    
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
    <div className="max-w-[1280px] mx-auto flex flex-col md:flex-row min-h-[calc(100vh-64px)] px-6 py-6 gap-6 bg-[#f8f9ff] text-[#0b1c30] font-sans">
      
      {/* Sidebar Filter Form */}
      <aside className="w-full md:w-80 flex-shrink-0">
        <div className="bg-white/70 backdrop-blur-md border border-[#dbe1ff]/50 p-6 rounded-xl flex flex-col gap-6 sticky top-24 shadow-[0_10px_30px_-5px_rgba(15,23,42,0.08)]">
          <div className="border-b border-[#c6c6cd] pb-4">
            <h2 className="text-2xl font-semibold text-[#0b1c30]">Filtreler</h2>
            <p className="text-xs font-semibold text-[#45464d] mt-1">AI destekli eşleşme için tercihlerinizi belirleyin.</p>
          </div>
          
          <div className="flex flex-col gap-4">
            {/* CV URL Input */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-[#45464d] flex items-center gap-1">
                <LinkIcon className="w-[18px] h-[18px]" /> CV URL (LinkedIn/Drive)
              </label>
              <input 
                type="url"
                value={cvUrl}
                onChange={(e) => setCvUrl(e.target.value)}
                className="w-full h-11 bg-white border border-[#c6c6cd] rounded-lg focus:border-[#0051d5] focus:ring-2 focus:ring-[#0051d5]/20 transition-all text-sm px-3 outline-none" 
                placeholder="https://..." 
              />
            </div>
            
            {/* Job Type */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-[#45464d]">Aranan Pozisyon</label>
              <input 
                type="text"
                value={jobType}
                onChange={(e) => setJobType(e.target.value)}
                disabled={randomJobs}
                className="w-full h-11 bg-white border border-[#c6c6cd] rounded-lg focus:border-[#0051d5] focus:ring-2 focus:ring-[#0051d5]/20 transition-all text-sm px-3 outline-none disabled:opacity-50" 
                placeholder="Örn: Senior Frontend Developer" 
              />
            </div>
            
            {/* Location Grid */}
            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-[#45464d]">Şehir</label>
                <select 
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full h-11 bg-white border border-[#c6c6cd] rounded-lg focus:border-[#0051d5] transition-all text-sm px-3 outline-none"
                >
                  <option value="İstanbul">İstanbul</option>
                  <option value="Ankara">Ankara</option>
                  <option value="İzmir">İzmir</option>
                  <option value="Bursa">Bursa</option>
                  <option value="Antalya">Antalya</option>
                  <option value="Uzaktan">Uzaktan</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-medium text-[#45464d]">İlçe</label>
                <input 
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full h-11 bg-white border border-[#c6c6cd] rounded-lg focus:border-[#0051d5] transition-all text-sm px-3 outline-none" 
                  placeholder="Beşiktaş" 
                />
              </div>
            </div>
            
            {/* Age & Toggle */}
            <div className="flex flex-col gap-4 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-[#45464d]">Yaş Aralığı</label>
                <input 
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-20 h-10 bg-white border border-[#c6c6cd] rounded-lg text-center text-sm px-2 outline-none" 
                  placeholder="25" 
                />
              </div>
              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-sm font-medium text-[#0b1c30]">Rastgele İş İlanları</span>
                <div className="relative inline-block w-10 h-6">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={randomJobs}
                    onChange={(e) => setRandomJobs(e.target.checked)}
                  />
                  <div className="w-full h-full bg-[#c6c6cd] peer-checked:bg-[#0051d5] rounded-full transition-colors"></div>
                  <div className={`absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform ${randomJobs ? 'translate-x-4' : ''}`}></div>
                </div>
              </label>
            </div>
          </div>
          
          {/* Buttons */}
          <div className="flex flex-col gap-2 pt-4 border-t border-[#c6c6cd]">
            <button 
              onClick={savePreferences}
              disabled={savingPrefs}
              className="w-full h-11 border border-[#c6c6cd] text-[#0b1c30] text-sm font-medium rounded-lg hover:bg-[#d3e4fe] transition-colors active:scale-95 disabled:opacity-50"
            >
              {savingPrefs ? 'Kaydediliyor...' : 'Tercihleri Kaydet'}
            </button>
            <button 
              onClick={handleSearch}
              disabled={searchingJobs}
              className="w-full h-11 bg-[#0051d5] text-white text-sm font-medium rounded-lg shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-70 disabled:active:scale-100"
            >
              {searchingJobs ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Zap className="w-5 h-5" />
              )}
              {searchingJobs ? 'Aranıyor...' : 'İş Ara'}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#c6c6cd] pb-4">
          <div>
            <h1 className="text-[32px] font-semibold text-[#0b1c30] leading-tight">İş Fırsatlarım</h1>
            <p className="text-base text-[#45464d] mt-1">
              {hasSearched ? `AI profilinizle en uyumlu ${jobs.length} ilan bulundu.` : 'AI profilinle en uyumlu ilanları bulmak için sağdan kriterlerini belirle.'}
            </p>
          </div>
          {hasSearched && (
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-[#45464d]">Sıralama:</span>
              <select className="bg-transparent border-none text-sm font-medium text-[#0051d5] focus:ring-0 cursor-pointer outline-none">
                <option>En Yüksek Eşleşme</option>
                <option>En Yeni İlanlar</option>
                <option>Maaş Skalası</option>
              </select>
            </div>
          )}
        </div>

        {/* Jobs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {!hasSearched ? (
             <div className="col-span-1 lg:col-span-2 bg-white p-12 rounded-xl border border-[#c6c6cd] text-center shadow-sm h-[300px] flex flex-col items-center justify-center">
               <div className="w-20 h-20 bg-[#f8f9ff] rounded-full flex items-center justify-center mb-4 border-2 border-dashed border-[#c6c6cd]">
                 <Search className="w-8 h-8 text-[#76777d]" />
               </div>
               <h3 className="text-lg font-bold text-[#0b1c30] mb-2">Arama Bekleniyor</h3>
               <p className="text-[#45464d] max-w-sm mx-auto">
                 Sol taraftaki formu doldurup "İş Ara" butonuna bastığınızda sonuçlar burada listelenecektir.
               </p>
             </div>
          ) : searchingJobs ? (
            [1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white p-6 rounded-xl border border-[#c6c6cd] animate-pulse flex flex-col gap-4">
                <div className="flex gap-4">
                  <div className="w-14 h-14 bg-[#e5e7eb] rounded-lg shrink-0" />
                  <div className="flex-1 space-y-3 pt-1">
                    <div className="h-5 w-3/4 bg-[#e5e7eb] rounded" />
                    <div className="h-4 w-1/2 bg-[#e5e7eb] rounded" />
                  </div>
                </div>
                <div className="h-16 bg-[#e5e7eb] rounded w-full mt-2" />
              </div>
            ))
          ) : jobs.length === 0 ? (
            <div className="col-span-1 lg:col-span-2 bg-white p-12 rounded-xl border border-[#c6c6cd] text-center shadow-sm h-[300px] flex flex-col items-center justify-center">
              <Briefcase className="w-16 h-16 text-[#c6c6cd] mx-auto mb-4" />
              <h3 className="text-xl font-bold text-[#0b1c30] mb-2">Kriterlere Uygun İlan Bulunamadı</h3>
              <p className="text-[#45464d]">Arama kriterlerinizi genişletmeyi veya farklı bir şehir/ilçe denemeyi düşünebilirsiniz.</p>
            </div>
          ) : (
            jobs.map((job, idx) => {
              const matchPercentage = 100 - (idx * 4 + (Math.floor(Math.random() * 5)));
              return (
                <div key={job.id || idx} className="bg-white shadow-[0_10px_30px_-5px_rgba(15,23,42,0.08)] rounded-xl p-6 border border-[#c6c6cd] hover:border-[#0051d5] hover:-translate-y-1 transition-all duration-300 flex flex-col gap-4 group">
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                      <div className="h-14 w-14 rounded-lg bg-[#e5eeff] border border-[#c6c6cd] flex items-center justify-center overflow-hidden shrink-0">
                        <Building2 className="w-7 h-7 text-[#0051d5]" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-[#0b1c30] group-hover:text-[#0051d5] transition-colors line-clamp-2 leading-tight">
                          {job.job_title}
                        </h3>
                        <p className="text-sm font-medium text-[#45464d] mt-1">{job.company_name}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-1 shrink-0 ml-2">
                      <span className="bg-[#316bf3] text-white px-2 py-0.5 rounded-full text-xs font-bold flex items-center gap-1">
                        <Zap className="w-3 h-3 fill-current" />
                        {matchPercentage}% Match
                      </span>
                      <span className="text-xs text-[#45464d] italic">Yeni</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-1.5 mt-1">
                    <span className="bg-[#d3e4fe] text-[#45464d] px-2 py-0.5 rounded text-xs border border-[#c6c6cd]/30">{job.work_type || 'Tam Zamanlı'}</span>
                    <span className="bg-[#d3e4fe] text-[#45464d] px-2 py-0.5 rounded text-xs border border-[#c6c6cd]/30">{job.location || city}</span>
                  </div>
                  
                  <p className="text-base text-[#45464d] line-clamp-2 mt-1">
                    {job.description || 'İlan detayları ve gereksinimler için kaynağa giderek tam açıklamayı okuyabilirsiniz.'}
                  </p>
                  
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-[#c6c6cd]">
                    <div className="flex items-center gap-1 text-[#45464d]">
                      <MapPin className="w-[18px] h-[18px]" />
                      <span className="text-sm font-medium">{job.location || city}</span>
                    </div>
                    <a 
                      href={`https://www.google.com/search?q=${encodeURIComponent(job.company_name + ' ' + job.job_title + ' iş ilanı')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#0051d5] text-white px-6 h-10 rounded-lg text-sm font-medium hover:bg-[#316bf3] transition-colors active:scale-95 flex items-center justify-center"
                    >
                      Başvur
                    </a>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>

      {/* AI Suggestion Floating Card (Glassmorphism) - Show only if results exist */}
      {hasSearched && jobs.length > 0 && (
        <div className="fixed bottom-6 right-6 w-72 bg-white/80 backdrop-blur-md p-4 rounded-xl shadow-[0_10px_30px_-5px_rgba(15,23,42,0.15)] z-40 border border-[#dbe1ff] animate-in slide-in-from-bottom-8 duration-700 hidden lg:block">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-8 w-8 rounded-full bg-[#0051d5] text-white flex items-center justify-center">
              <Sparkles className="w-4 h-4 fill-current" />
            </div>
            <h4 className="text-sm text-[#0b1c30] font-bold">AI İpucu</h4>
          </div>
          <p className="text-xs font-semibold text-[#45464d]">
            CV'nizdeki yetenekler <strong>{jobs[0]?.company_name || 'bu'}</strong> ilanındaki gereksinimlerle yüksek oranda uyuşuyor!
          </p>
          <button className="w-full mt-3 text-[#0051d5] text-xs font-semibold hover:underline flex items-center justify-center gap-1">
            Detayları Gör <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
}

const Sparkles = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.936A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z"/>
  </svg>
);
"""

    with open('app/(dashboard)/dashboard/jobs/page.tsx', 'w', encoding='utf-8') as f:
        f.write(jsx)
        print("Written successfully to app/(dashboard)/dashboard/jobs/page.tsx")

create_page()
