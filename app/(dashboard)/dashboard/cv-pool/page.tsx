'use client';

import React, { useState, useEffect } from 'react';
import { createClientComponentClient } from '@/lib/supabase-client';
import { 
  Users, Search, Shield, ToggleLeft, ToggleRight, 
  MapPin, Briefcase, FileText, Download, ExternalLink,
  DollarSign, Sparkles, Building2, CheckCircle2, ChevronRight,
  Filter
} from 'lucide-react';

const CITIES = [
  'Tümü', 'İstanbul', 'Ankara', 'İzmir', 'Adana', 'Adıyaman', 'Afyonkarahisar', 'Ağrı', 'Aksaray', 'Amasya',
  'Antalya', 'Ardahan', 'Artvin', 'Aydın', 'Balıkesir', 'Bartın', 'Batman', 'Bayburt', 'Bilecik', 'Bingöl',
  'Bitlis', 'Bolu', 'Burdur', 'Bursa', 'Çanakkale', 'Çankırı', 'Çorum', 'Denizli', 'Diyarbakır', 'Düzce',
  'Edirne', 'Elazığ', 'Erzincan', 'Erzurum', 'Eskişehir', 'Gaziantep', 'Giresun', 'Gümüşhane', 'Hakkari',
  'Hatay', 'Iğdır', 'Isparta', 'Kahramanmaraş', 'Karabük', 'Karaman', 'Kars', 'Kastamonu', 'Kayseri',
  'Kırıkkale', 'Kırklareli', 'Kırşehir', 'Kilis', 'Kocaeli', 'Konya', 'Kütahya', 'Malatya', 'Manisa',
  'Mardin', 'Mersin', 'Muğla', 'Muş', 'Nevşehir', 'Niğde', 'Ordu', 'Osmaniye', 'Rize', 'Sakarya',
  'Samsun', 'Siirt', 'Sinop', 'Sivas', 'Şanlıurfa', 'Şırnak', 'Tekirdağ', 'Tokat', 'Trabzon', 'Tunceli',
  'Uşak', 'Van', 'Yalova', 'Yozgat', 'Zonguldak', 'Global / Remote'
];

export default function CVPoolPage() {
  const supabase = createClientComponentClient();
  const [activeTab, setActiveTab] = useState<'search' | 'share'>('search');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // User session & profile state
  const [userId, setUserId] = useState<string | null>(null);
  const [userCvs, setUserCvs] = useState<any[]>([]);
  const [selectedCvId, setSelectedCvId] = useState<string>('');

  // CV Pool state
  const [allPublicCvs, setAllPublicCvs] = useState<any[]>([]);
  const [filteredCvs, setFilteredCvs] = useState<any[]>([]);

  // Search filter states
  const [searchTitle, setSearchTitle] = useState('');
  const [searchCity, setSearchCity] = useState('Tümü');
  const [searchDistrict, setSearchDistrict] = useState('');
  const [searchWorkType, setSearchWorkType] = useState('Tümü');

  // Candidate sharing preferences state
  const [sharingActive, setSharingActive] = useState(false);
  const [preferredCities, setPreferredCities] = useState<string>('İstanbul');
  const [preferredDistricts, setPreferredDistricts] = useState<string>('');
  const [workTypes, setWorkTypes] = useState<string[]>(['Remote']);
  const [expectedSalary, setExpectedSalary] = useState<string>('');
  const [targetTitle, setTargetTitle] = useState<string>('');

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        // Load user's CVs
        const { data: cvs } = await supabase
          .from('cvs')
          .select('id, title, is_public, data')
          .eq('user_id', user.id);
        
        if (cvs && cvs.length > 0) {
          setUserCvs(cvs);
          // Set default selected CV (first public or first overall)
          const activeCv = cvs.find((c: any) => c.is_public) || cvs[0];
          setSelectedCvId(activeCv.id);
          setSharingActive(activeCv.is_public || false);
          
          // Pre-populate preference form from JSONB metadata if available
          const prefs = activeCv.data?.preferences;
          if (prefs) {
            setTargetTitle(prefs.job_title || activeCv.data.personal?.headline || '');
            setPreferredCities(prefs.preferred_cities?.join(', ') || activeCv.data.personal?.location || 'İstanbul');
            setPreferredDistricts(prefs.preferred_districts || '');
            setWorkTypes(prefs.work_types || ['Remote']);
            setExpectedSalary(prefs.expected_salary?.toString() || '');
          } else {
            setTargetTitle(activeCv.data.personal?.headline || '');
            setPreferredCities(activeCv.data.personal?.location || 'İstanbul');
          }
        }
      }

      // Load all public CVs for the pool
      const { data: publicCvs } = await supabase
        .from('cvs')
        .select('id, user_id, title, slug, data, pdf_url, view_count, updated_at')
        .eq('is_public', true);

      if (publicCvs) {
        setAllPublicCvs(publicCvs);
        setFilteredCvs(publicCvs);
      }
      setLoading(false);
    }

    loadData();
  }, [supabase]);

  // Handle changing which CV to share
  const handleCvChange = (cvId: string) => {
    setSelectedCvId(cvId);
    const selected = userCvs.find((c: any) => c.id === cvId);
    if (selected) {
      setSharingActive(selected.is_public || false);
      const prefs = selected.data?.preferences;
      if (prefs) {
        setTargetTitle(prefs.job_title || selected.data.personal?.headline || '');
        setPreferredCities(prefs.preferred_cities?.join(', ') || selected.data.personal?.location || 'İstanbul');
        setPreferredDistricts(prefs.preferred_districts || '');
        setWorkTypes(prefs.work_types || ['Remote']);
        setExpectedSalary(prefs.expected_salary?.toString() || '');
      } else {
        setTargetTitle(selected.data.personal?.headline || '');
        setPreferredCities(selected.data.personal?.location || 'İstanbul');
        setPreferredDistricts('');
        setExpectedSalary('');
      }
    }
  };

  // Save sharing preferences to the active CV's JSONB metadata
  const saveSharingPreferences = async () => {
    if (!selectedCvId) return;
    setSaving(false);
    setSaving(true);

    try {
      const selected = userCvs.find((c: any) => c.id === selectedCvId);
      if (!selected) throw new Error('CV bulunamadı');

      const updatedData = {
        ...selected.data,
        preferences: {
          job_title: targetTitle,
          preferred_cities: preferredCities.split(',').map(s => s.trim()).filter(Boolean),
          preferred_districts: preferredDistricts,
          work_types: workTypes,
          expected_salary: expectedSalary ? parseInt(expectedSalary) : 0,
        }
      };

      const { error } = await supabase
        .from('cvs')
        .update({
          is_public: sharingActive,
          data: updatedData,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedCvId);

      if (error) throw error;

      // Update local state
      setUserCvs(prev => prev.map((c: any) => c.id === selectedCvId ? { ...c, is_public: sharingActive, data: updatedData } : c));
      
      // Reload CV pool list
      const { data: publicCvs } = await supabase
        .from('cvs')
        .select('id, user_id, title, slug, data, pdf_url, view_count, updated_at')
        .eq('is_public', true);
      if (publicCvs) {
        setAllPublicCvs(publicCvs);
        setFilteredCvs(publicCvs);
      }

      alert('Paylaşım ayarlarınız başarıyla kaydedildi!');
    } catch (err: any) {
      console.error('Error saving share settings:', err);
      alert('Ayarlar kaydedilirken hata oluştu: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  // Run filters over the public CVs in memory
  const applyFilters = () => {
    let result = [...allPublicCvs];

    // 1. Position / Headline Search
    if (searchTitle.trim()) {
      const query = searchTitle.toLowerCase();
      result = result.filter(cv => {
        const headline = (cv.data.personal?.headline || '').toLowerCase();
        const prefTitle = (cv.data.preferences?.job_title || '').toLowerCase();
        const skills = (cv.data.skills || []).map((s: string) => s.toLowerCase()).join(' ');
        const title = (cv.title || '').toLowerCase();
        return headline.includes(query) || prefTitle.includes(query) || skills.includes(query) || title.includes(query);
      });
    }

    // 2. City Filter
    if (searchCity !== 'Tümü') {
      const query = searchCity.toLowerCase();
      result = result.filter(cv => {
        const personalLoc = (cv.data.personal?.location || '').toLowerCase();
        const prefCities = (cv.data.preferences?.preferred_cities || []).map((c: string) => c.toLowerCase());
        return personalLoc.includes(query) || prefCities.some((c: string) => c.includes(query));
      });
    }

    // 3. District Filter
    if (searchDistrict.trim()) {
      const query = searchDistrict.toLowerCase();
      result = result.filter(cv => {
        const districts = (cv.data.preferences?.preferred_districts || '').toLowerCase();
        return districts.includes(query);
      });
    }

    // 4. Work Type Filter
    if (searchWorkType !== 'Tümü') {
      const query = searchWorkType.toLowerCase();
      result = result.filter(cv => {
        const types = (cv.data.preferences?.work_types || []).map((t: string) => t.toLowerCase());
        return types.some((t: string) => t.includes(query));
      });
    }

    setFilteredCvs(result);
  };

  useEffect(() => {
    applyFilters();
  }, [searchTitle, searchCity, searchDistrict, searchWorkType, allPublicCvs]);

  const toggleWorkType = (type: string) => {
    if (workTypes.includes(type)) {
      setWorkTypes(workTypes.filter(t => t !== type));
    } else {
      setWorkTypes([...workTypes, type]);
    }
  };

  return (
    <div className="flex-1 w-full max-w-[1280px] mx-auto px-6 py-8">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-[#0b1c30] tracking-tight">CV Havuzu</h1>
          <p className="text-[#45464d] text-base mt-1">
            İş arayanların CV'lerini detaylı çalışma yerleriyle paylaştığı ve işverenlerin aday bulduğu ortak havuz.
          </p>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex bg-[#e5eeff] p-1 rounded-xl shrink-0 self-start">
          <button 
            onClick={() => setActiveTab('search')}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'search' ? 'bg-[#0051d5] text-white shadow-md' : 'text-[#45464d] hover:text-[#0b1c30]'}`}
          >
            <Search className="w-4 h-4" /> Aday Bul (İşveren)
          </button>
          <button 
            onClick={() => setActiveTab('share')}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'share' ? 'bg-[#0051d5] text-white shadow-md' : 'text-[#45464d] hover:text-[#0b1c30]'}`}
          >
            <Users className="w-4 h-4" /> Profilimi Paylaş (Aday)
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="w-12 h-12 border-4 border-[#0051d5] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-[#45464d] text-sm mt-4 font-semibold">Havuz yükleniyor...</p>
        </div>
      ) : (
        <>
          {/* TAB 1: SEARCH CANDIDATES (EMPLOYER VIEW) */}
          {activeTab === 'search' && (
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              
              {/* Filter Sidebar */}
              <div className="lg:col-span-1 bg-white border border-[#c6c6cd] rounded-2xl p-6 shadow-sm h-fit">
                <div className="flex items-center gap-2 mb-6 pb-4 border-b border-[#c6c6cd]">
                  <Filter className="w-5 h-5 text-[#0051d5]" />
                  <h3 className="font-bold text-[#0b1c30] text-lg">Arama Kriterleri</h3>
                </div>

                <div className="space-y-5">
                  {/* Position Search */}
                  <div>
                    <label className="block text-xs font-bold text-[#0b1c30] uppercase tracking-wider mb-2">Unvan veya Yetenek</label>
                    <div className="relative">
                      <Search className="w-4 h-4 text-[#76777d] absolute left-3 top-3" />
                      <input 
                        type="text"
                        placeholder="Örn: Frontend, Python, Sales"
                        value={searchTitle}
                        onChange={(e) => setSearchTitle(e.target.value)}
                        className="w-full h-10 pl-9 pr-4 bg-white border border-[#c6c6cd] rounded-xl text-sm text-[#0b1c30] placeholder-[#76777d] focus:outline-none focus:border-[#0051d5] focus:ring-1 focus:ring-[#0051d5]"
                      />
                    </div>
                  </div>

                  {/* City Select */}
                  <div>
                    <label className="block text-xs font-bold text-[#0b1c30] uppercase tracking-wider mb-2">Çalışılacak Şehir</label>
                    <select
                      value={searchCity}
                      onChange={(e) => setSearchCity(e.target.value)}
                      className="w-full h-10 px-3 bg-white border border-[#c6c6cd] rounded-xl text-sm text-[#0b1c30] focus:outline-none focus:border-[#0051d5]"
                    >
                      {CITIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  {/* District Search */}
                  <div>
                    <label className="block text-xs font-bold text-[#0b1c30] uppercase tracking-wider mb-2">Çalışılacak İlçe</label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-[#76777d] absolute left-3 top-3" />
                      <input 
                        type="text"
                        placeholder="Örn: Kadıköy, Çankaya"
                        value={searchDistrict}
                        onChange={(e) => setSearchDistrict(e.target.value)}
                        className="w-full h-10 pl-9 pr-4 bg-white border border-[#c6c6cd] rounded-xl text-sm text-[#0b1c30] placeholder-[#76777d] focus:outline-none focus:border-[#0051d5] focus:ring-1 focus:ring-[#0051d5]"
                      />
                    </div>
                  </div>

                  {/* Work Type Filter */}
                  <div>
                    <label className="block text-xs font-bold text-[#0b1c30] uppercase tracking-wider mb-2">Çalışma Şekli</label>
                    <select
                      value={searchWorkType}
                      onChange={(e) => setSearchWorkType(e.target.value)}
                      className="w-full h-10 px-3 bg-white border border-[#c6c6cd] rounded-xl text-sm text-[#0b1c30] focus:outline-none focus:border-[#0051d5]"
                    >
                      <option value="Tümü">Tümü</option>
                      <option value="Remote">Uzaktan (Remote)</option>
                      <option value="Hybrid">Hibrit</option>
                      <option value="Office">Ofis</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Candidates Grid */}
              <div className="lg:col-span-3 space-y-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-[#45464d]">
                    Toplam <strong>{filteredCvs.length}</strong> aday kriterlerinize uygun bulundu.
                  </p>
                </div>

                {filteredCvs.length === 0 ? (
                  <div className="bg-white border border-[#c6c6cd] rounded-2xl p-12 text-center shadow-sm">
                    <Users className="w-12 h-12 text-[#76777d] mx-auto mb-4" />
                    <h3 className="font-bold text-[#0b1c30] text-lg">Aday Bulunamadı</h3>
                    <p className="text-[#45464d] text-sm mt-1 max-w-md mx-auto">
                      Kriterlerinize uygun paylaşılan bir CV bulunamadı. Filtrelerinizi temizleyerek veya daha genel kelimeler aratarak tekrar deneyebilirsiniz.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredCvs.map((cv) => {
                      const personal = cv.data?.personal || {};
                      const preferences = cv.data?.preferences || {};
                      const skills = cv.data?.skills || [];
                      const formattedUpdated = cv.updated_at ? new Date(cv.updated_at).toLocaleDateString('tr-TR') : 'Bugün';

                      return (
                        <div key={cv.id} className="bg-white border border-[#c6c6cd] rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
                          <div>
                            {/* Profile Header */}
                            <div className="flex items-start justify-between gap-2 mb-4">
                              <div>
                                <h3 className="font-bold text-[#0b1c30] text-lg group-hover:text-[#0051d5] transition-colors">
                                  {personal.fullName || 'Gizli Aday'}
                                </h3>
                                <p className="text-[#0051d5] text-xs font-bold uppercase tracking-wider mt-0.5">
                                  {preferences.job_title || personal.headline || 'Yazılım Uzmanı'}
                                </p>
                              </div>
                              <span className="text-xs text-[#76777d] font-semibold shrink-0 bg-[#f8f9ff] border border-[#c6c6cd] px-2 py-0.5 rounded-lg">
                                Güncellendi: {formattedUpdated}
                              </span>
                            </div>

                            {/* Details List */}
                            <div className="space-y-2 mb-5">
                              <div className="flex items-center gap-2 text-xs font-semibold text-[#45464d]">
                                <MapPin className="w-4 h-4 text-[#76777d]" />
                                <span>
                                  Tercih Ettiği Yer: <strong>{preferences.preferred_cities?.join(', ') || personal.location || 'İstanbul'}</strong> 
                                  {preferences.preferred_districts && ` (${preferences.preferred_districts})`}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-xs font-semibold text-[#45464d]">
                                <Briefcase className="w-4 h-4 text-[#76777d]" />
                                <span>
                                  Çalışma Şekli: <strong>{preferences.work_types?.join(', ') || 'Remote'}</strong>
                                </span>
                              </div>
                              {preferences.expected_salary > 0 && (
                                <div className="flex items-center gap-2 text-xs font-semibold text-[#45464d]">
                                  <DollarSign className="w-4 h-4 text-[#76777d]" />
                                  <span>
                                    Maaş Beklentisi: <strong>₺{preferences.expected_salary.toLocaleString('tr-TR')} / ay</strong>
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Skills Tags */}
                            {skills.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mb-6">
                                {skills.slice(0, 5).map((skill: string) => (
                                  <span key={skill} className="bg-[#e5eeff] text-[#0051d5] border border-[#d3e4fe] px-2 py-0.5 rounded text-[10px] font-bold">
                                    {skill}
                                  </span>
                                ))}
                                {skills.length > 5 && (
                                  <span className="bg-[#f8f9ff] text-[#45464d] border border-[#c6c6cd] px-2 py-0.5 rounded text-[10px] font-bold">
                                    +{skills.length - 5} daha
                                  </span>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Action Buttons */}
                          <div className="flex items-center gap-2 pt-4 border-t border-[#c6c6cd]/50">
                            <a 
                              href={`/cv/${cv.slug || cv.id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 h-9 rounded-lg border border-[#c6c6cd] hover:border-[#0051d5] text-[#0b1c30] hover:text-[#0051d5] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
                            >
                              CV'yi Gör <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                            {cv.pdf_url && (
                              <a 
                                href={cv.pdf_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="h-9 w-9 rounded-lg bg-[#0051d5]/10 hover:bg-[#0051d5]/20 text-[#0051d5] flex items-center justify-center transition-colors shrink-0"
                                title="PDF Olarak İndir"
                              >
                                <Download className="w-4 h-4" />
                              </a>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: SHARE PROFILE (CANDIDATE VIEW) */}
          {activeTab === 'share' && (
            <div className="max-w-2xl mx-auto bg-white border border-[#c6c6cd] rounded-2xl p-8 shadow-sm">
              <div className="flex items-center gap-2.5 mb-6 pb-4 border-b border-[#c6c6cd]">
                <Sparkles className="w-5 h-5 text-[#0051d5]" />
                <h3 className="font-bold text-[#0b1c30] text-lg">Profilini ve İş Tercihlerini Paylaş</h3>
              </div>

              {userCvs.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-[#76777d] mx-auto mb-4" />
                  <h4 className="font-bold text-[#0b1c30] text-base">Aktif CV Bulunamadı</h4>
                  <p className="text-[#45464d] text-sm mt-1 max-w-sm mx-auto mb-6">
                    Arama havuzunda listelenebilmek için öncelikle en az bir tane CV oluşturmanız gerekmektedir.
                  </p>
                  <a 
                    href="/dashboard/cv/new"
                    className="inline-flex items-center gap-2 bg-[#0051d5] text-white px-5 h-10 rounded-xl text-sm font-bold hover:bg-[#316bf3] transition-colors"
                  >
                    Yeni CV Oluştur
                  </a>
                </div>
              ) : (
                <div className="space-y-6">
                  
                  {/* Select which CV to make public */}
                  <div>
                    <label className="block text-xs font-bold text-[#0b1c30] uppercase tracking-wider mb-2">Hangi CV'niz Paylaşılacak?</label>
                    <select
                      value={selectedCvId}
                      onChange={(e) => handleCvChange(e.target.value)}
                      className="w-full h-11 px-3 bg-white border border-[#c6c6cd] rounded-xl text-sm text-[#0b1c30] focus:outline-none focus:border-[#0051d5]"
                    >
                      {userCvs.map((c) => (
                        <option key={c.id} value={c.id}>{c.title} {c.is_public ? '(Şu an Havuzda)' : ''}</option>
                      ))}
                    </select>
                  </div>

                  {/* Public Status Toggle */}
                  <div className="bg-[#f8f9ff] border border-[#c6c6cd] rounded-xl p-4 flex items-center justify-between">
                    <div>
                      <h4 className="text-[#0b1c30] font-bold text-sm">CV Havuzunda Listelenmek İstiyorum</h4>
                      <p className="text-xs text-[#76777d] mt-0.5">
                        Açık konuma getirirseniz CV'niz ve iş tercihleriniz işverenler tarafından aranabilir olacaktır.
                      </p>
                    </div>
                    <button 
                      onClick={() => setSharingActive(!sharingActive)}
                      className="focus:outline-none transition-transform active:scale-95"
                    >
                      {sharingActive ? (
                        <ToggleRight className="w-12 h-12 text-[#0051d5] fill-current" />
                      ) : (
                        <ToggleLeft className="w-12 h-12 text-[#76777d]" />
                      )}
                    </button>
                  </div>

                  {/* Preferences Form Fields */}
                  <div className="space-y-5 pt-4 border-t border-[#c6c6cd]/50">
                    
                    {/* Expected job title */}
                    <div>
                      <label className="block text-xs font-bold text-[#0b1c30] uppercase tracking-wider mb-2">Hedef Pozisyon / Unvan</label>
                      <input 
                        type="text"
                        placeholder="Örn: Kıdemli Full-Stack Geliştirici, Dijital Pazarlama Uzmanı"
                        value={targetTitle}
                        onChange={(e) => setTargetTitle(e.target.value)}
                        className="w-full h-11 px-4 bg-white border border-[#c6c6cd] rounded-xl text-sm text-[#0b1c30] placeholder-[#76777d] focus:outline-none focus:border-[#0051d5]"
                      />
                    </div>

                    {/* Preferred cities */}
                    <div>
                      <label className="block text-xs font-bold text-[#0b1c30] uppercase tracking-wider mb-2">
                        Çalışmak İstediğiniz Şehir(ler)
                      </label>
                      <input 
                        type="text"
                        placeholder="Örn: İstanbul, İzmir, Ankara (Virgülle ayırın)"
                        value={preferredCities}
                        onChange={(e) => setPreferredCities(e.target.value)}
                        className="w-full h-11 px-4 bg-white border border-[#c6c6cd] rounded-xl text-sm text-[#0b1c30] placeholder-[#76777d] focus:outline-none focus:border-[#0051d5]"
                      />
                      <span className="text-[10px] font-semibold text-[#76777d] mt-1 block">
                        Birden fazla şehir eklemek için aralarına virgül koyun.
                      </span>
                    </div>

                    {/* Preferred districts */}
                    <div>
                      <label className="block text-xs font-bold text-[#0b1c30] uppercase tracking-wider mb-2">
                        Çalışmak İstediğiniz İlçe(ler)
                      </label>
                      <input 
                        type="text"
                        placeholder="Örn: Kadıköy, Üsküdar, Çankaya"
                        value={preferredDistricts}
                        onChange={(e) => setPreferredDistricts(e.target.value)}
                        className="w-full h-11 px-4 bg-white border border-[#c6c6cd] rounded-xl text-sm text-[#0b1c30] placeholder-[#76777d] focus:outline-none focus:border-[#0051d5]"
                      />
                      <span className="text-[10px] font-semibold text-[#76777d] mt-1 block">
                        Spesifik çalışmak istediğiniz semt veya ilçeleri detaylı olarak buraya yazabilirsiniz.
                      </span>
                    </div>

                    {/* Expected Minimum Salary */}
                    <div>
                      <label className="block text-xs font-bold text-[#0b1c30] uppercase tracking-wider mb-2">Beklenen Aylık Net Ücret (İsteğe Bağlı)</label>
                      <div className="relative">
                        <span className="absolute left-4 top-3 text-[#76777d] text-sm font-bold">₺</span>
                        <input 
                          type="number"
                          placeholder="Örn: 45000"
                          value={expectedSalary}
                          onChange={(e) => setExpectedSalary(e.target.value)}
                          className="w-full h-11 pl-8 pr-4 bg-white border border-[#c6c6cd] rounded-xl text-sm text-[#0b1c30] placeholder-[#76777d] focus:outline-none focus:border-[#0051d5]"
                        />
                      </div>
                    </div>

                    {/* Work type checkboxes */}
                    <div>
                      <label className="block text-xs font-bold text-[#0b1c30] uppercase tracking-wider mb-2">Kabul Ettiğiniz Çalışma Şekilleri</label>
                      <div className="flex gap-4">
                        {['Remote', 'Hybrid', 'Office'].map((type) => (
                          <button
                            key={type}
                            type="button"
                            onClick={() => toggleWorkType(type)}
                            className={`flex-1 h-11 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 ${workTypes.includes(type) ? 'bg-[#0051d5]/10 border-[#0051d5] text-[#0051d5]' : 'bg-white border-[#c6c6cd] text-[#45464d] hover:bg-[#f8f9ff]'}`}
                          >
                            {workTypes.includes(type) && <CheckCircle2 className="w-4 h-4" />}
                            {type === 'Remote' ? 'Uzaktan (Remote)' : type === 'Hybrid' ? 'Hibrit' : 'Ofis'}
                          </button>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Save Button */}
                  <button
                    onClick={saveSharingPreferences}
                    disabled={saving}
                    className="w-full mt-6 bg-[#0051d5] text-white h-11 rounded-xl text-sm font-bold hover:bg-[#316bf3] transition-colors active:scale-[0.98] disabled:bg-[#c6c6cd] disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {saving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Kaydediliyor...
                      </>
                    ) : (
                      'Paylaşım Ayarlarını Kaydet'
                    )}
                  </button>
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
