'use client';

import React, { useState, useEffect } from 'react';
import { createClientComponentClient } from '@/lib/supabase-client';
import { 
  Users, Search, Shield, ToggleLeft, ToggleRight, 
  MapPin, Briefcase, FileText, Download, ExternalLink,
  DollarSign, Sparkles, CheckCircle2, Filter, Mail, Phone,
  Upload, Check
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
  const [shareMethod, setShareMethod] = useState<'system' | 'external'>('system');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

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

  // Candidate sharing preferences state (System CV)
  const [sharingActive, setSharingActive] = useState(false);
  const [preferredCities, setPreferredCities] = useState<string>('İstanbul');
  const [preferredDistricts, setPreferredDistricts] = useState<string>('');
  const [workTypes, setWorkTypes] = useState<string[]>(['Remote']);
  const [expectedSalary, setExpectedSalary] = useState<string>('');
  const [targetTitle, setTargetTitle] = useState<string>('');
  const [contactEmail, setContactEmail] = useState<string>('');
  const [contactPhone, setContactPhone] = useState<string>('');

  // External PDF upload states
  const [pdfBase64, setPdfBase64] = useState<string>('');
  const [pdfFileName, setPdfFileName] = useState<string>('');
  const [extFullName, setExtFullName] = useState('');
  const [extTargetTitle, setExtTargetTitle] = useState('');
  const [extCities, setExtCities] = useState('İstanbul');
  const [extDistricts, setExtDistricts] = useState('');
  const [extEmail, setExtEmail] = useState('');
  const [extPhone, setExtPhone] = useState('');
  const [extSalary, setExtSalary] = useState('');
  const [extWorkTypes, setExtWorkTypes] = useState<string[]>(['Remote']);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
        setExtEmail(user.email || '');
        setContactEmail(user.email || '');
        
        // Load user's CVs
        const { data: cvs } = await supabase
          .from('cvs')
          .select('id, title, is_public, data')
          .eq('user_id', user.id);
        
        if (cvs && cvs.length > 0) {
          setUserCvs(cvs);
          // Set default selected CV (first in pool or first overall)
          const activeCv = cvs.find((c: any) => c.data?.in_pool) || cvs[0];
          setSelectedCvId(activeCv.id);
          setSharingActive(activeCv.data?.in_pool || false);
          
          // Pre-populate preference form from JSONB metadata if available
          const prefs = activeCv.data?.preferences;
          if (prefs) {
            setTargetTitle(prefs.job_title || activeCv.data.personal?.headline || '');
            setPreferredCities(prefs.preferred_cities?.join(', ') || activeCv.data.personal?.location || 'İstanbul');
            setPreferredDistricts(prefs.preferred_districts || '');
            setWorkTypes(prefs.work_types || ['Remote']);
            setExpectedSalary(prefs.expected_salary?.toString() || '');
            setContactEmail(prefs.contact_email || activeCv.data.personal?.email || user.email || '');
            setContactPhone(prefs.contact_phone || activeCv.data.personal?.phone || '');
          } else {
            setTargetTitle(activeCv.data.personal?.headline || '');
            setPreferredCities(activeCv.data.personal?.location || 'İstanbul');
            setContactEmail(activeCv.data.personal?.email || user.email || '');
            setContactPhone(activeCv.data.personal?.phone || '');
          }
        }
      }

      // Load all public CVs for the pool
      const { data: publicCvs } = await supabase
        .from('cvs')
        .select('id, user_id, title, slug, data, pdf_url, view_count, updated_at')
        .eq('is_public', true);

      if (publicCvs) {
        // Filter in-memory: only CVs explicitly submitted to the pool by user
        const poolCvs = publicCvs.filter((cv: any) => cv.data?.in_pool === true);
        setAllPublicCvs(poolCvs);
        setFilteredCvs(poolCvs);
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
      setSharingActive(selected.data?.in_pool || false);
      const prefs = selected.data?.preferences;
      if (prefs) {
        setTargetTitle(prefs.job_title || selected.data.personal?.headline || '');
        setPreferredCities(prefs.preferred_cities?.join(', ') || selected.data.personal?.location || 'İstanbul');
        setPreferredDistricts(prefs.preferred_districts || '');
        setWorkTypes(prefs.work_types || ['Remote']);
        setExpectedSalary(prefs.expected_salary?.toString() || '');
        setContactEmail(prefs.contact_email || selected.data.personal?.email || '');
        setContactPhone(prefs.contact_phone || selected.data.personal?.phone || '');
      } else {
        setTargetTitle(selected.data.personal?.headline || '');
        setPreferredCities(selected.data.personal?.location || 'İstanbul');
        setPreferredDistricts('');
        setExpectedSalary('');
        setContactEmail(selected.data.personal?.email || '');
        setContactPhone(selected.data.personal?.phone || '');
      }
    }
  };

  // Handle file picker for external PDF
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert('Lütfen sadece PDF formatında bir dosya yükleyin.');
        e.target.value = '';
        return;
      }
      if (file.size > 5242880) {
        alert('Dosya boyutu maksimum 5MB olmalıdır.');
        e.target.value = '';
        return;
      }
      setPdfFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPdfBase64(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit external PDF to Pool API
  const handleExternalUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pdfBase64) {
      alert('Lütfen bir PDF özgeçmiş dosyası seçin.');
      return;
    }
    if (!extFullName || !extTargetTitle) {
      alert('Ad Soyad ve Hedef Pozisyon alanları zorunludur.');
      return;
    }
    setUploading(true);

    try {
      const res = await fetch('/api/cv/upload-external-pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `${extFullName} - PDF Özgeçmiş`,
          pdfBase64,
          fullName: extFullName,
          targetTitle: extTargetTitle,
          preferredCities: extCities,
          preferredDistricts: extDistricts,
          contactEmail: extEmail,
          contactPhone: extPhone,
          expectedSalary: extSalary ? parseInt(extSalary) : 0,
          workTypes: extWorkTypes
        })
      });

      const result = await res.json();
      if (!res.ok) {
        throw new Error(result.error || 'Yükleme başarısız oldu.');
      }

      alert('Hazır PDF özgeçmişiniz başarıyla havuzda yayınlandı!');
      
      // Reset upload states
      setPdfBase64('');
      setPdfFileName('');
      setExtFullName('');
      setExtTargetTitle('');
      setExtDistricts('');
      setExtSalary('');

      // Reload pool list
      const { data: publicCvs } = await supabase
        .from('cvs')
        .select('id, user_id, title, slug, data, pdf_url, view_count, updated_at')
        .eq('is_public', true);
      if (publicCvs) {
        const poolCvs = publicCvs.filter((cv: any) => cv.data?.in_pool === true);
        setAllPublicCvs(poolCvs);
        setFilteredCvs(poolCvs);
      }
      
      // Switch back to search
      setActiveTab('search');
    } catch (err: any) {
      console.error(err);
      alert('Hata oluştu: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  // Save sharing preferences to the active CV's JSONB metadata
  const saveSharingPreferences = async () => {
    if (!selectedCvId) return;
    setSaving(true);

    try {
      const selected = userCvs.find((c: any) => c.id === selectedCvId);
      if (!selected) throw new Error('CV bulunamadı');

      const updatedData = {
        ...selected.data,
        in_pool: sharingActive,
        preferences: {
          job_title: targetTitle,
          preferred_cities: preferredCities.split(',').map(s => s.trim()).filter(Boolean),
          preferred_districts: preferredDistricts,
          work_types: workTypes,
          expected_salary: expectedSalary ? parseInt(expectedSalary) : 0,
          contact_email: contactEmail,
          contact_phone: contactPhone,
        }
      };

      // Set is_public to true if in pool so employers can view CV page,
      // but if sharingActive is false, keep current is_public (don't break existing share links)
      const { error } = await supabase
        .from('cvs')
        .update({
          is_public: sharingActive ? true : selected.is_public,
          data: updatedData,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedCvId);

      if (error) throw error;

      // Update local state
      setUserCvs(prev => prev.map((c: any) => c.id === selectedCvId ? { ...c, is_public: sharingActive ? true : c.is_public, data: updatedData } : c));
      
      // Reload CV pool list
      const { data: publicCvs } = await supabase
        .from('cvs')
        .select('id, user_id, title, slug, data, pdf_url, view_count, updated_at')
        .eq('is_public', true);
      if (publicCvs) {
        const poolCvs = publicCvs.filter((cv: any) => cv.data?.in_pool === true);
        setAllPublicCvs(poolCvs);
        setFilteredCvs(poolCvs);
      }

      alert('Paylaşım ve iletişim ayarlarınız başarıyla kaydedildi!');
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

    // 1. Position / Headline / Skill Search
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
        const personalLoc = (cv.data.personal?.location || '').toLowerCase();
        const districts = (cv.data.preferences?.preferred_districts || '').toLowerCase();
        return districts.includes(query) || personalLoc.includes(query);
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

  const toggleExtWorkType = (type: string) => {
    if (extWorkTypes.includes(type)) {
      setExtWorkTypes(extWorkTypes.filter(t => t !== type));
    } else {
      setExtWorkTypes([...extWorkTypes, type]);
    }
  };

  return (
    <div className="flex-1 w-full max-w-[1280px] mx-auto px-6 py-8" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-[#0b1c30] tracking-tight">CV Havuzu</h1>
          <p className="text-[#45464d] text-base mt-1">
            Adayların CV'lerini ve iletişim tercihlerini paylaştığı, işverenlerin doğrudan e-posta veya telefon ile aday bulduğu ortak havuz.
          </p>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex bg-[#e5eeff] p-1 rounded-xl shrink-0 self-start">
          <button 
            onClick={() => setActiveTab('search')}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${activeTab === 'search' ? 'bg-[#0051d5] text-white shadow-md' : 'text-[#45464d] hover:text-[#0b1c30]'}`}
          >
            <Search className="w-4 h-4" /> Aday Bul (İşveren)
          </button>
          <button 
            onClick={() => setActiveTab('share')}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-bold transition-all cursor-pointer ${activeTab === 'share' ? 'bg-[#0051d5] text-white shadow-md' : 'text-[#45464d] hover:text-[#0b1c30]'}`}
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
                        placeholder="Örn: Yazılımcı, Frontend, Python"
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
                      className="w-full h-10 px-3 bg-white border border-[#c6c6cd] rounded-xl text-sm text-[#0b1c30] focus:outline-none focus:border-[#0051d5] cursor-pointer"
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
                        placeholder="Örn: Antakya, Kadıköy, Çankaya"
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
                      className="w-full h-10 px-3 bg-white border border-[#c6c6cd] rounded-xl text-sm text-[#0b1c30] focus:outline-none focus:border-[#0051d5] cursor-pointer"
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
                    Kriterlerinize uygun <strong>{filteredCvs.length}</strong> aday bulundu.
                  </p>
                </div>

                {filteredCvs.length === 0 ? (
                  <div className="bg-white border border-[#c6c6cd] rounded-2xl p-12 text-center shadow-sm">
                    <Users className="w-12 h-12 text-[#76777d] mx-auto mb-4" />
                    <h3 className="font-bold text-[#0b1c30] text-lg">Aday Bulunamadı</h3>
                    <p className="text-[#45464d] text-sm mt-1 max-w-md mx-auto">
                      Belirtilen şehir, ilçe veya unvan kriterlerine göre havuzda paylaşılmış bir CV bulunamadı. Filtreleri değiştirerek tekrar deneyebilirsiniz.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredCvs.map((cv) => {
                      const personal = cv.data?.personal || {};
                      const preferences = cv.data?.preferences || {};
                      const skills = cv.data?.skills || [];
                      const formattedUpdated = cv.updated_at ? new Date(cv.updated_at).toLocaleDateString('tr-TR') : 'Bugün';

                      // Determine contact details
                      const emailToUse = preferences.contact_email || personal.email;
                      const phoneToUse = preferences.contact_phone || personal.phone;
                      const cleanPhone = phoneToUse ? phoneToUse.replace(/\D/g, '') : '';

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
                                <MapPin className="w-4 h-4 text-[#76777d] shrink-0" />
                                <span className="line-clamp-1">
                                  Konum: <strong>{preferences.preferred_cities?.join(', ') || personal.location || 'Belirtilmedi'}</strong> 
                                  {preferences.preferred_districts && ` (${preferences.preferred_districts})`}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 text-xs font-semibold text-[#45464d]">
                                <Briefcase className="w-4 h-4 text-[#76777d] shrink-0" />
                                <span>
                                  Çalışma: <strong>{preferences.work_types?.join(', ') || 'Remote'}</strong>
                                </span>
                              </div>
                              {preferences.expected_salary > 0 && (
                                <div className="flex items-center gap-2 text-xs font-semibold text-[#45464d]">
                                  <DollarSign className="w-4 h-4 text-[#76777d] shrink-0" />
                                  <span>
                                    Maaş Beklentisi: <strong>₺{preferences.expected_salary.toLocaleString('tr-TR')} / ay</strong>
                                  </span>
                                </div>
                              )}
                            </div>

                            {/* Skills Tags */}
                            {skills.length > 0 && (
                              <div className="flex flex-wrap gap-1.5 mb-6">
                                {skills.slice(0, 4).map((skill: string) => (
                                  <span key={skill} className="bg-[#e5eeff] text-[#0051d5] border border-[#d3e4fe] px-2 py-0.5 rounded text-[10px] font-bold">
                                    {skill}
                                  </span>
                                ))}
                                {skills.length > 4 && (
                                  <span className="bg-[#f8f9ff] text-[#45464d] border border-[#c6c6cd] px-2 py-0.5 rounded text-[10px] font-bold">
                                    +{skills.length - 4}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>

                          {/* Action & Contact Buttons */}
                          <div className="space-y-3 pt-4 border-t border-[#c6c6cd]/50">
                            {/* CV View Link */}
                            <div className="flex gap-2">
                              <a 
                                href={cv.data?.external_pdf ? cv.pdf_url : `/cv/${cv.slug || cv.id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 h-9 rounded-lg border border-[#c6c6cd] hover:border-[#0051d5] text-[#0b1c30] hover:text-[#0051d5] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer bg-white"
                              >
                                {cv.data?.external_pdf ? 'Özgeçmiş PDF\'ini Aç' : 'CV\'yi Gör'} <ExternalLink className="w-3.5 h-3.5" />
                              </a>
                              {cv.pdf_url && !cv.data?.external_pdf && (
                                <a 
                                  href={cv.pdf_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="h-9 w-9 rounded-lg bg-[#0051d5]/10 hover:bg-[#0051d5]/20 text-[#0051d5] flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                                  title="PDF İndir"
                                >
                                  <Download className="w-4 h-4" />
                                </a>
                              )}
                            </div>

                            {/* Direct Contact Buttons */}
                            <div className="flex gap-2">
                              {emailToUse && (
                                <a 
                                  href={`mailto:${emailToUse}?subject=CVio Havuzu - İş Başvurusu ve İletişim`}
                                  className="flex-1 h-9 rounded-lg bg-[#eff4ff] hover:bg-[#0051d5]/15 text-[#0051d5] text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-[#0051d5]/20 cursor-pointer"
                                >
                                  <Mail className="w-3.5 h-3.5" /> E-posta Gönder
                                </a>
                              )}
                              {phoneToUse && (
                                <a 
                                  href={`https://wa.me/${cleanPhone.startsWith('90') ? cleanPhone : '90' + cleanPhone}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex-1 h-9 rounded-lg bg-emerald-50 hover:bg-emerald-100/80 text-emerald-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors border border-emerald-600/20 cursor-pointer"
                                >
                                  <Phone className="w-3.5 h-3.5" /> WhatsApp'tan Yaz
                                </a>
                              )}
                            </div>
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

              {/* Sub-tab selection for share method */}
              <div className="flex border-b border-[#c6c6cd] mb-6">
                <button
                  type="button"
                  onClick={() => setShareMethod('system')}
                  className={`pb-3 text-sm font-bold border-b-2 px-4 transition-all cursor-pointer ${shareMethod === 'system' ? 'border-[#0051d5] text-[#0051d5]' : 'border-transparent text-[#76777d] hover:text-[#0b1c30]'}`}
                >
                  Sistemdeki CV'yi Paylaş
                </button>
                <button
                  type="button"
                  onClick={() => setShareMethod('external')}
                  className={`pb-3 text-sm font-bold border-b-2 px-4 transition-all cursor-pointer ${shareMethod === 'external' ? 'border-[#0051d5] text-[#0051d5]' : 'border-transparent text-[#76777d] hover:text-[#0b1c30]'}`}
                >
                  Kendi Hazır PDF CV'mi Yükle
                </button>
              </div>

              {/* SHARE METHOD 1: SYSTEM BUILDER CV */}
              {shareMethod === 'system' && (
                userCvs.length === 0 ? (
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
                  <div className="space-y-6 animate-in fade-in duration-300">
                    
                    {/* Select which CV to make public */}
                    <div>
                      <label className="block text-xs font-bold text-[#0b1c30] uppercase tracking-wider mb-2">Hangi CV'niz Paylaşılacak?</label>
                      <div className="flex gap-2">
                        <select
                          value={selectedCvId}
                          onChange={(e) => handleCvChange(e.target.value)}
                          className="flex-1 h-11 px-3 bg-white border border-[#c6c6cd] rounded-xl text-sm text-[#0b1c30] focus:outline-none focus:border-[#0051d5] cursor-pointer"
                        >
                          {userCvs.map((c) => (
                            <option key={c.id} value={c.id}>{c.title} {c.data?.in_pool ? '(Şu an Havuzda)' : ''}</option>
                          ))}
                        </select>
                        <a 
                          href={`/dashboard/cv/${selectedCvId}/edit`}
                          className="h-11 px-4 bg-[#eff4ff] hover:bg-[#0051d5]/10 border border-[#0051d5]/20 text-[#0051d5] rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shrink-0"
                        >
                          Düzenle
                        </a>
                      </div>
                    </div>

                    {/* Public Status Toggle */}
                    <div className="bg-[#f8f9ff] border border-[#c6c6cd] rounded-xl p-4 flex items-center justify-between">
                      <div>
                        <h4 className="text-[#0b1c30] font-bold text-sm">Bu CV'yi CV Havuzuna Gönder</h4>
                        <p className="text-xs text-[#76777d] mt-0.5">
                          Açık konuma getirirseniz bu CV'niz işverenlerin aday arama motorunda listelenecektir.
                        </p>
                      </div>
                      <button 
                        onClick={() => setSharingActive(!sharingActive)}
                        className="focus:outline-none transition-transform active:scale-95 cursor-pointer"
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
                          placeholder="Örn: Frontend Yazılımcı, Kıdemli Python Geliştirici"
                          value={targetTitle}
                          onChange={(e) => setTargetTitle(e.target.value)}
                          className="w-full h-11 px-4 bg-white border border-[#c6c6cd] rounded-xl text-sm text-[#0b1c30] placeholder-[#76777d] focus:outline-none focus:border-[#0051d5]"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Preferred cities */}
                        <div>
                          <label className="block text-xs font-bold text-[#0b1c30] uppercase tracking-wider mb-2">
                            Çalışmak İstediğiniz Şehir
                          </label>
                          <input 
                            type="text"
                            placeholder="Örn: Hatay, İstanbul, Ankara"
                            value={preferredCities}
                            onChange={(e) => setPreferredCities(e.target.value)}
                            className="w-full h-11 px-4 bg-white border border-[#c6c6cd] rounded-xl text-sm text-[#0b1c30] placeholder-[#76777d] focus:outline-none focus:border-[#0051d5]"
                          />
                        </div>

                        {/* Preferred districts */}
                        <div>
                          <label className="block text-xs font-bold text-[#0b1c30] uppercase tracking-wider mb-2">
                            Çalışmak İstediğiniz İlçe
                          </label>
                          <input 
                            type="text"
                            placeholder="Örn: Antakya, Kadıköy, Çankaya"
                            value={preferredDistricts}
                            onChange={(e) => setPreferredDistricts(e.target.value)}
                            className="w-full h-11 px-4 bg-white border border-[#c6c6cd] rounded-xl text-sm text-[#0b1c30] placeholder-[#76777d] focus:outline-none focus:border-[#0051d5]"
                          />
                        </div>
                      </div>

                      {/* Contact Details Configuration */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        <div>
                          <label className="block text-xs font-bold text-[#0b1c30] uppercase tracking-wider mb-2">
                            İletişim E-posta Adresi
                          </label>
                          <input 
                            type="email"
                            placeholder="Örn: aday@posta.com"
                            value={contactEmail}
                            onChange={(e) => setContactEmail(e.target.value)}
                            className="w-full h-11 px-4 bg-white border border-[#c6c6cd] rounded-xl text-sm text-[#0b1c30] placeholder-[#76777d] focus:outline-none focus:border-[#0051d5]"
                          />
                          <span className="text-[9px] text-[#76777d] mt-1 block">İşverenlerin size mail göndereceği adres.</span>
                        </div>

                        <div>
                          <label className="block text-xs font-bold text-[#0b1c30] uppercase tracking-wider mb-2">
                            İletişim Telefon Numarası
                          </label>
                          <input 
                            type="text"
                            placeholder="Örn: 5551234567"
                            value={contactPhone}
                            onChange={(e) => setContactPhone(e.target.value)}
                            className="w-full h-11 px-4 bg-white border border-[#c6c6cd] rounded-xl text-sm text-[#0b1c30] placeholder-[#76777d] focus:outline-none focus:border-[#0051d5]"
                          />
                          <span className="text-[9px] text-[#76777d] mt-1 block">WhatsApp yönlendirmesi için telefon numaranız.</span>
                        </div>
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
                              className={`flex-1 h-11 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1.5 cursor-pointer ${workTypes.includes(type) ? 'bg-[#0051d5]/10 border-[#0051d5] text-[#0051d5]' : 'bg-white border-[#c6c6cd] text-[#45464d] hover:bg-[#f8f9ff]'}`}
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
                      className="w-full mt-6 bg-[#0051d5] text-white h-12 rounded-xl text-sm font-bold hover:bg-[#316bf3] transition-all hover:scale-[1.01] active:scale-[0.99] disabled:bg-[#c6c6cd] disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#0051d5]/10"
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
                )
              )}

              {/* SHARE METHOD 2: UPLOAD EXTERNAL PDF */}
              {shareMethod === 'external' && (
                <form onSubmit={handleExternalUploadSubmit} className="space-y-5 animate-in fade-in duration-300">
                  
                  {/* File Upload Input */}
                  <div className="border-2 border-dashed border-[#c6c6cd] rounded-2xl p-8 text-center bg-[#f8f9ff] hover:bg-[#eff4ff]/50 transition-colors relative group">
                    <input 
                      type="file" 
                      accept="application/pdf"
                      onChange={handleFileChange}
                      required={!pdfBase64}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" 
                    />
                    <div className="flex flex-col items-center justify-center pointer-events-none">
                      <div className="w-12 h-12 rounded-full bg-[#0051d5]/10 flex items-center justify-center text-[#0051d5] mb-3 group-hover:scale-110 transition-transform">
                        <Upload className="w-6 h-6" />
                      </div>
                      {pdfFileName ? (
                        <div className="text-sm font-bold text-[#0b1c30] flex items-center gap-1.5">
                          <Check className="w-4 h-4 text-emerald-600" /> {pdfFileName}
                        </div>
                      ) : (
                        <>
                          <p className="text-sm font-bold text-[#0b1c30]">Özgeçmiş Dosyanızı Sürükleyin veya Seçin</p>
                          <p className="text-xs text-[#76777d] mt-1">Yalnızca PDF formatı (Maksimum 5MB)</p>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Form fields for candidate details */}
                  <div className="space-y-4 pt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#0b1c30] uppercase tracking-wider mb-2">Adınız Soyadınız</label>
                        <input 
                          type="text"
                          required
                          placeholder="Örn: Ahmet Yılmaz"
                          value={extFullName}
                          onChange={(e) => setExtFullName(e.target.value)}
                          className="w-full h-11 px-4 bg-white border border-[#c6c6cd] rounded-xl text-sm text-[#0b1c30] placeholder-[#76777d] focus:outline-none focus:border-[#0051d5]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#0b1c30] uppercase tracking-wider mb-2">Hedef Pozisyon / Unvan</label>
                        <input 
                          type="text"
                          required
                          placeholder="Örn: Senior Frontend Geliştirici"
                          value={extTargetTitle}
                          onChange={(e) => setExtTargetTitle(e.target.value)}
                          className="w-full h-11 px-4 bg-white border border-[#c6c6cd] rounded-xl text-sm text-[#0b1c30] placeholder-[#76777d] focus:outline-none focus:border-[#0051d5]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#0b1c30] uppercase tracking-wider mb-2">Çalışmak İstediğiniz Şehir</label>
                        <input 
                          type="text"
                          required
                          placeholder="Örn: Hatay, İstanbul (Virgülle ayırın)"
                          value={extCities}
                          onChange={(e) => setExtCities(e.target.value)}
                          className="w-full h-11 px-4 bg-white border border-[#c6c6cd] rounded-xl text-sm text-[#0b1c30] placeholder-[#76777d] focus:outline-none focus:border-[#0051d5]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#0b1c30] uppercase tracking-wider mb-2">Çalışmak İstediğiniz İlçe</label>
                        <input 
                          type="text"
                          placeholder="Örn: Antakya, Kadıköy"
                          value={extDistricts}
                          onChange={(e) => setExtDistricts(e.target.value)}
                          className="w-full h-11 px-4 bg-white border border-[#c6c6cd] rounded-xl text-sm text-[#0b1c30] placeholder-[#76777d] focus:outline-none focus:border-[#0051d5]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#0b1c30] uppercase tracking-wider mb-2">İletişim E-posta Adresi</label>
                        <input 
                          type="email"
                          required
                          placeholder="Örn: ahmet@posta.com"
                          value={extEmail}
                          onChange={(e) => setExtEmail(e.target.value)}
                          className="w-full h-11 px-4 bg-white border border-[#c6c6cd] rounded-xl text-sm text-[#0b1c30] placeholder-[#76777d] focus:outline-none focus:border-[#0051d5]"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#0b1c30] uppercase tracking-wider mb-2">İletişim Telefon Numarası</label>
                        <input 
                          type="text"
                          required
                          placeholder="Örn: 5551234567"
                          value={extPhone}
                          onChange={(e) => setExtPhone(e.target.value)}
                          className="w-full h-11 px-4 bg-white border border-[#c6c6cd] rounded-xl text-sm text-[#0b1c30] placeholder-[#76777d] focus:outline-none focus:border-[#0051d5]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-[#0b1c30] uppercase tracking-wider mb-2">Beklenen Aylık Net Ücret (İsteğe Bağlı)</label>
                        <div className="relative">
                          <span className="absolute left-4 top-3 text-[#76777d] text-sm font-bold">₺</span>
                          <input 
                            type="number"
                            placeholder="Örn: 50000"
                            value={extSalary}
                            onChange={(e) => setExtSalary(e.target.value)}
                            className="w-full h-11 pl-8 pr-4 bg-white border border-[#c6c6cd] rounded-xl text-sm text-[#0b1c30] placeholder-[#76777d] focus:outline-none focus:border-[#0051d5]"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-[#0b1c30] uppercase tracking-wider mb-2">Kabul Edilen Çalışma Şekilleri</label>
                        <div className="flex gap-2">
                          {['Remote', 'Hybrid', 'Office'].map((type) => (
                            <button
                              key={type}
                              type="button"
                              onClick={() => toggleExtWorkType(type)}
                              className={`flex-grow h-11 rounded-xl text-xs font-bold border transition-all flex items-center justify-center gap-1 cursor-pointer ${extWorkTypes.includes(type) ? 'bg-[#0051d5]/10 border-[#0051d5] text-[#0051d5]' : 'bg-white border-[#c6c6cd] text-[#45464d] hover:bg-[#f8f9ff]'}`}
                            >
                              {extWorkTypes.includes(type) && <CheckCircle2 className="w-3.5 h-3.5" />}
                              {type === 'Remote' ? 'Uzaktan' : type === 'Hybrid' ? 'Hibrit' : 'Ofis'}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={uploading}
                    className="w-full mt-4 bg-[#0051d5] text-white h-12 rounded-xl text-sm font-bold hover:bg-[#316bf3] transition-all hover:scale-[1.01] active:scale-[0.99] disabled:bg-[#c6c6cd] disabled:cursor-not-allowed flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-[#0051d5]/10"
                  >
                    {uploading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Özgeçmiş Yükleniyor...
                      </>
                    ) : (
                      'Özgeçmişi Yükle ve Havuza Ekle'
                    )}
                  </button>
                </form>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
