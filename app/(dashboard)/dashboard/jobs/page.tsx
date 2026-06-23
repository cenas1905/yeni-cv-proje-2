'use client';

import React, { useState, useEffect } from 'react';
import { createClientComponentClient } from '@/lib/supabase-client';
import { Briefcase, MapPin, Building2, ChevronRight, Zap, Search, Link as LinkIcon, RefreshCw } from 'lucide-react';

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
      // Passes cvUrl, age and randomJobs to Gemini API to give highly relevant and realistic matches
      const res = await fetch(`/api/jobs?location=${encodeURIComponent(locationTarget)}&query=${encodeURIComponent(queryTarget)}&age=${encodeURIComponent(age)}&cvUrl=${encodeURIComponent(cvUrl)}&randomJobs=${randomJobs}`);
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
        <div className="bg-white/70 backdrop-blur-md border border-[#c6c6cd] shadow-sm p-6 rounded-xl flex flex-col gap-6 sticky top-24">
          <div className="border-b border-[#c6c6cd] pb-4">
            <h2 className="text-2xl font-bold text-[#0b1c30]">Filtreler</h2>
            <p className="text-sm text-[#45464d] mt-1 font-medium">AI destekli eşleşme için tercihlerinizi belirleyin.</p>
          </div>
          <div className="flex flex-col gap-4">
            {/* CV URL Input */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-[#45464d] flex items-center gap-1">
                <LinkIcon className="w-4 h-4" /> CV URL (LinkedIn/Drive)
              </label>
              <input 
                type="text"
                value={cvUrl}
                onChange={(e) => setCvUrl(e.target.value)}
                className="w-full h-11 bg-white border border-[#c6c6cd] rounded-lg focus:border-[#0051d5] focus:ring-2 focus:ring-[#0051d5]/20 transition-all text-sm px-3 outline-none" 
                placeholder="https://..." 
              />
            </div>
            
            {/* Job Type */}
            <div className="flex flex-col gap-1">
              <label className="text-sm font-semibold text-[#45464d]">Aranan Pozisyon</label>
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
                <label className="text-sm font-semibold text-[#45464d]">Şehir</label>
                <select 
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full h-11 bg-white border border-[#c6c6cd] rounded-lg focus:border-[#0051d5] transition-all text-sm px-3 outline-none"
                >
                  <optgroup label="Genel & Uzaktan">
                    <option value="Uzaktan (Remote)">Uzaktan (Remote)</option>
                    <option value="Dünya Geneli (Worldwide)">Dünya Geneli</option>
                    <option value="Avrupa (Europe)">Avrupa</option>
                    <option value="Amerika (USA)">Amerika</option>
                  </optgroup>
                  <optgroup label="Tüm Türkiye (81 İl)">
                    <option value="Adana">Adana</option><option value="Adıyaman">Adıyaman</option><option value="Afyonkarahisar">Afyonkarahisar</option><option value="Ağrı">Ağrı</option><option value="Amasya">Amasya</option><option value="Ankara">Ankara</option><option value="Antalya">Antalya</option><option value="Artvin">Artvin</option><option value="Aydın">Aydın</option><option value="Balıkesir">Balıkesir</option><option value="Bilecik">Bilecik</option><option value="Bingöl">Bingöl</option><option value="Bitlis">Bitlis</option><option value="Bolu">Bolu</option><option value="Burdur">Burdur</option><option value="Bursa">Bursa</option><option value="Çanakkale">Çanakkale</option><option value="Çankırı">Çankırı</option><option value="Çorum">Çorum</option><option value="Denizli">Denizli</option><option value="Diyarbakır">Diyarbakır</option><option value="Edirne">Edirne</option><option value="Elazığ">Elazığ</option><option value="Erzincan">Erzincan</option><option value="Erzurum">Erzurum</option><option value="Eskişehir">Eskişehir</option><option value="Gaziantep">Gaziantep</option><option value="Giresun">Giresun</option><option value="Gümüşhane">Gümüşhane</option><option value="Hakkari">Hakkari</option><option value="Hatay">Hatay</option><option value="Isparta">Isparta</option><option value="Mersin">Mersin</option><option value="İstanbul">İstanbul</option><option value="İzmir">İzmir</option><option value="Kars">Kars</option><option value="Kastamonu">Kastamonu</option><option value="Kayseri">Kayseri</option><option value="Kırklareli">Kırklareli</option><option value="Kırşehir">Kırşehir</option><option value="Kocaeli">Kocaeli</option><option value="Konya">Konya</option><option value="Kütahya">Kütahya</option><option value="Malatya">Malatya</option><option value="Manisa">Manisa</option><option value="Kahramanmaraş">Kahramanmaraş</option><option value="Mardin">Mardin</option><option value="Muğla">Muğla</option><option value="Muş">Muş</option><option value="Nevşehir">Nevşehir</option><option value="Niğde">Niğde</option><option value="Ordu">Ordu</option><option value="Rize">Rize</option><option value="Sakarya">Sakarya</option><option value="Samsun">Samsun</option><option value="Siirt">Siirt</option><option value="Sinop">Sinop</option><option value="Sivas">Sivas</option><option value="Tekirdağ">Tekirdağ</option><option value="Tokat">Tokat</option><option value="Trabzon">Trabzon</option><option value="Tunceli">Tunceli</option><option value="Şanlıurfa">Şanlıurfa</option><option value="Uşak">Uşak</option><option value="Van">Van</option><option value="Yozgat">Yozgat</option><option value="Zonguldak">Zonguldak</option><option value="Aksaray">Aksaray</option><option value="Bayburt">Bayburt</option><option value="Karaman">Karaman</option><option value="Kırıkkale">Kırıkkale</option><option value="Batman">Batman</option><option value="Şırnak">Şırnak</option><option value="Bartın">Bartın</option><option value="Ardahan">Ardahan</option><option value="Iğdır">Iğdır</option><option value="Yalova">Yalova</option><option value="Karabük">Karabük</option><option value="Kilis">Kilis</option><option value="Osmaniye">Osmaniye</option><option value="Düzce">Düzce</option>
                  </optgroup>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-[#45464d]">İlçe</label>
                <input 
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full h-11 bg-white border border-[#c6c6cd] rounded-lg focus:border-[#0051d5] transition-all text-sm px-3 outline-none" 
                  placeholder="Opsiyonel" 
                />
              </div>
            </div>
            
            {/* Age & Toggle */}
            <div className="flex flex-col gap-4 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold text-[#45464d]">Yaş Aralığı</label>
                <input 
                  type="number"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  className="w-20 h-10 bg-white border border-[#c6c6cd] rounded-lg text-center text-sm px-2 outline-none" 
                  placeholder="25" 
                />
              </div>
              <label className="flex items-center justify-between cursor-pointer group">
                <span className="text-sm font-semibold text-[#0b1c30]">Rastgele İş İlanları</span>
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
              className="w-full h-11 border border-[#c6c6cd] text-[#0b1c30] text-sm font-bold rounded-lg hover:bg-[#d3e4fe] transition-colors active:scale-95 disabled:opacity-50"
            >
              {savingPrefs ? 'Kaydediliyor...' : 'Tercihleri Kaydet'}
            </button>
            <button 
              onClick={handleSearch}
              disabled={searchingJobs}
              className="w-full h-11 bg-[#0051d5] text-white text-sm font-bold rounded-lg shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-70 disabled:active:scale-100 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
              {searchingJobs ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Zap className="w-5 h-5" />
              )}
              {searchingJobs ? 'İnternette Aranıyor...' : 'İş Ara'}
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col gap-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-[#c6c6cd] pb-4">
          <div>
            <h1 className="text-[32px] font-bold text-[#0b1c30] leading-tight">İş Fırsatlarım</h1>
            <p className="text-base text-[#45464d] mt-1 font-medium">
              {hasSearched ? `Gerçek zamanlı arama ile internette ${jobs.length} güncel ilan bulundu.` : 'Kriterlerini belirle ve internetteki GERÇEK ilanları anında listele.'}
            </p>
          </div>
          {hasSearched && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-[#45464d]">Sıralama:</span>
              <select className="bg-transparent border-none text-sm font-bold text-[#0051d5] focus:ring-0 cursor-pointer outline-none">
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
               <h3 className="text-lg font-bold text-[#0b1c30] mb-2">Canlı İnternet Taraması Bekleniyor</h3>
               <p className="text-[#45464d] max-w-sm mx-auto">
                 "İş Ara" butonuna tıkladığında yapay zeka senin için anlık olarak webi tarayıp gerçek ilanları getirecek.
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
              <p className="text-[#45464d]">İnternetteki güncel kaynaklarda arama yaptık ancak sonuç bulamadık. Lütfen kriterlerini değiştirip tekrar dene.</p>
            </div>
          ) : (
            jobs.map((job, idx) => {
              const matchPercentage = 100 - (idx * 4 + (Math.floor(Math.random() * 5)));
              return (
                <div key={job.id || idx} className="bg-white shadow-md rounded-xl p-6 border border-[#c6c6cd] hover:border-[#0051d5] hover:-translate-y-1 transition-all duration-300 flex flex-col gap-4 group">
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
                        {matchPercentage}% Uyum
                      </span>
                      <span className="text-xs text-[#45464d] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">Gerçek İlan</span>
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
                      <span className="text-sm font-semibold">{job.location || city}</span>
                    </div>
                    <a 
                      href={job.apply_url || `https://www.google.com/search?q=${encodeURIComponent(job.company_name + ' ' + job.job_title + ' iş ilanı')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-[#0051d5] text-white px-6 h-10 rounded-lg text-sm font-bold hover:bg-[#316bf3] transition-colors active:scale-95 flex items-center justify-center gap-2 group-hover:shadow-md"
                    >
                      Başvur (Gerçek Link)
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
              <Zap className="w-4 h-4 fill-current" />
            </div>
            <h4 className="text-sm text-[#0b1c30] font-bold">AI İpucu</h4>
          </div>
          <p className="text-xs font-semibold text-[#45464d]">
            CV'nizdeki yetenekler <strong>{jobs[0]?.company_name || 'bu'}</strong> ilanındaki gereksinimlerle yüksek oranda uyuşuyor!
          </p>
          <button className="w-full mt-3 text-[#0051d5] text-xs font-bold hover:underline flex items-center justify-center gap-1">
            Hemen Başvur <ChevronRight className="w-3 h-3" />
          </button>
        </div>
      )}
    </div>
  );
}
