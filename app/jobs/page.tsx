'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { createClientComponentClient } from '@/lib/supabase-client';
import { Briefcase, MapPin, Building2, Search, ArrowRight, Clock, DollarSign, Filter, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function PublicJobsPage() {
  const supabase = createClientComponentClient();
  const [jobs, setJobs] = useState<any[]>([]);
  const [externalJobs, setExternalJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [workTypeFilter, setWorkTypeFilter] = useState('Tümü');

  useEffect(() => {
    async function fetchLocalJobs() {
      // Fetch internal jobs
      const { data } = await supabase
        .from('employer_jobs')
        .select('*')
        .order('created_at', { ascending: false });
      
      setJobs(data || []);
      
      // Fetch initial external jobs
      fetchExternalJobs('Genel Başvuru', 'Turkey');
    }
    fetchLocalJobs();
  }, [supabase]);

  const fetchExternalJobs = async (query: string, location: string) => {
    setIsSearching(true);
    try {
      const res = await fetch(`/api/jobs?location=${encodeURIComponent(location)}&query=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.jobs) {
        setExternalJobs(data.jobs);
      }
    } catch (error) {
      console.error('Dış ilan çekilemedi', error);
    }
    setIsSearching(false);
    setLoading(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    setLoading(true);
    fetchExternalJobs(searchTerm, 'Turkey');
  };

  // Filter local jobs based on search term and work type
  const filteredLocalJobs = jobs.filter(job => {
    const matchesSearch = job.job_title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          job.company_name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = workTypeFilter === 'Tümü' || job.work_type === workTypeFilter;
    return matchesSearch && matchesType;
  });

  // Filter external jobs based on work type
  const filteredExternalJobs = externalJobs.filter(job => {
    const matchesType = workTypeFilter === 'Tümü' || job.work_type === workTypeFilter || job.work_type === 'Belirtilmemiş';
    return matchesType;
  });

  const allJobs = [...filteredLocalJobs, ...filteredExternalJobs];

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e] font-sans selection:bg-[#4648d4] selection:text-white">
      {/* ─── HEADER ─── */}
      <header className="sticky top-0 z-50 bg-[#f7f9fb]/80 backdrop-blur-md border-b border-[#c6c6cd]/30 shadow-sm transition-all duration-300">
        <div className="max-w-[1280px] mx-auto px-6 md:px-16">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#4648d4]">
                <span className="text-white font-black text-sm">C</span>
              </div>
              <span className="font-black text-xl tracking-tight text-[#191c1e]">CV<span className="text-[#4648d4]">io</span></span>
            </Link>
            
            {/* Nav */}
            <nav className="hidden md:flex gap-8 items-center">
              <Link href="/jobs" className="text-[#4648d4] font-bold text-sm transition-colors border-b-2 border-[#4648d4] py-1">İş İlanları</Link>
              <Link href="/login" className="text-[#45464d] hover:text-[#4648d4] font-medium text-sm transition-colors">Giriş Yap</Link>
            </nav>

            <Link href="/register" className="inline-flex items-center gap-1.5 bg-[#191c1e] hover:bg-[#191c1e]/80 text-white font-semibold text-sm py-2.5 px-6 rounded-lg transition-all active:scale-95">
              CV Oluştur
            </Link>
          </div>
        </div>
      </header>

      {/* ─── HERO & SEARCH ─── */}
      <section className="relative pt-16 pb-20 md:pt-24 md:pb-28 px-6 md:px-16 overflow-hidden bg-gradient-to-br from-[#eff4ff] to-[#f7f9fb]">
        {/* Background elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#4648d4]/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#009485]/10 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/3 pointer-events-none" />
        
        <div className="relative z-10 max-w-[1280px] mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 border border-[#c6c6cd]/50 text-[#4648d4] font-bold text-xs uppercase tracking-wider mb-6 shadow-sm backdrop-blur-md">
              <Sparkles className="w-4 h-4" /> En Yeni Fırsatlar
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-[#191c1e] tracking-tight mb-6">
              Sana En Uygun İşi <br className="hidden md:block" />
              <span className="text-[#4648d4]">Bugün Keşfet</span>
            </h1>
            <p className="text-lg text-[#45464d] max-w-2xl mx-auto mb-10 leading-relaxed">
              En iyi teknoloji ve start-up şirketlerindeki fırsatları incele. CV'ni hazırla ve hayalindeki kariyere ilk adımını at.
            </p>
          </motion.div>

          {/* Search Box */}
          <form 
            onSubmit={handleSearch}
            className="max-w-3xl mx-auto bg-white/80 backdrop-blur-xl p-3 md:p-4 rounded-2xl shadow-xl border border-white flex flex-col md:flex-row gap-3"
          >
            <div className="flex-1 relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-[#76777d]" />
              <input 
                type="text" 
                placeholder="Örn: Garson, Aşçı, Yazılımcı, Şoför..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-[#f7f9fb] border border-[#e5e7eb] rounded-xl focus:ring-2 focus:ring-[#4648d4]/50 outline-none text-[#191c1e] placeholder-[#76777d] font-medium"
              />
            </div>
            <div className="md:w-48 relative flex items-center">
              <Filter className="absolute left-4 w-5 h-5 text-[#76777d]" />
              <select 
                value={workTypeFilter}
                onChange={(e) => setWorkTypeFilter(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-[#f7f9fb] border border-[#e5e7eb] rounded-xl focus:ring-2 focus:ring-[#4648d4]/50 outline-none text-[#191c1e] font-medium appearance-none cursor-pointer"
              >
                <option value="Tümü">Çalışma Tipi</option>
                <option value="Uzaktan">Uzaktan</option>
                <option value="Hibrit">Hibrit</option>
                <option value="Ofis">Ofis</option>
              </select>
            </div>
            <button type="submit" disabled={isSearching} className="bg-[#4648d4] hover:bg-[#4648d4]/90 text-white font-bold px-8 py-3.5 rounded-xl transition-colors shrink-0 disabled:opacity-70">
              {isSearching ? 'Aranıyor...' : 'Bul'}
            </button>
          </form>
        </div>
      </section>

      {/* ─── JOB LISTINGS ─── */}
      <section className="py-16 px-6 md:px-16 min-h-[500px]">
        <div className="max-w-[1000px] mx-auto">
          
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-2xl font-black text-[#191c1e]">Güncel Fırsatlar</h2>
              <p className="text-[#76777d] text-sm mt-1">Sistemimiz internetteki {allJobs.length} aktif ilanı buldu</p>
            </div>
          </div>

          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-6 rounded-2xl border border-[#e5e7eb] animate-pulse flex flex-col md:flex-row gap-6">
                  <div className="w-16 h-16 bg-[#f2f4f6] rounded-xl shrink-0" />
                  <div className="flex-1 space-y-3 py-1">
                    <div className="h-5 w-1/3 bg-[#f2f4f6] rounded" />
                    <div className="h-4 w-1/4 bg-[#f2f4f6] rounded" />
                    <div className="flex gap-2 pt-2">
                      <div className="h-8 w-24 bg-[#f2f4f6] rounded-lg" />
                      <div className="h-8 w-24 bg-[#f2f4f6] rounded-lg" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : allJobs.length === 0 ? (
            <div className="bg-white p-16 rounded-3xl border border-[#e5e7eb] text-center shadow-sm">
              <div className="w-20 h-20 bg-[#eff4ff] rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-10 h-10 text-[#4648d4]" />
              </div>
              <h3 className="text-xl font-bold text-[#191c1e] mb-2">İlan Bulunamadı</h3>
              <p className="text-[#76777d]">Arama kriterlerinize uygun iş ilanı bulunamadı.</p>
              <button 
                onClick={() => {setSearchTerm(''); setWorkTypeFilter('Tümü'); fetchExternalJobs('Genel Başvuru', 'Turkey');}}
                className="mt-6 text-[#4648d4] font-bold hover:underline"
              >
                Filtreleri Temizle
              </button>
            </div>
          ) : (
            <div className="space-y-5">
              {allJobs.map((job, idx) => {
                const initial = job.company_name?.[0]?.toUpperCase() || 'C';
                
                return (
                  <motion.div 
                    key={job.id}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: Math.min(idx * 0.05, 0.5) }}
                    className="group bg-white p-6 rounded-2xl border border-[#e5e7eb] shadow-sm hover:shadow-xl hover:border-[#4648d4]/30 hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
                  >
                    {/* Hover Glow Effect */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#4648d4]/5 to-transparent rounded-full blur-2xl -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                    <div className="flex flex-col md:flex-row gap-6 relative z-10">
                      {/* Logo Area */}
                      <div className="w-16 h-16 bg-gradient-to-br from-[#eff4ff] to-[#e1e0ff] border border-[#d3e4fe] rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
                        <span className="text-2xl font-black text-[#4648d4]">{initial}</span>
                      </div>

                      {/* Content Area */}
                      <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                          <div>
                            <h3 className="text-xl font-black text-[#191c1e] group-hover:text-[#4648d4] transition-colors">
                              {job.job_title}
                            </h3>
                            <div className="flex items-center gap-2 mt-1.5 text-[#45464d] font-medium text-sm flex-wrap">
                              <Building2 className="w-4 h-4 text-[#76777d]" />
                              {job.company_name}
                              <span className="w-1 h-1 rounded-full bg-[#c6c6cd] mx-1" />
                              <MapPin className="w-4 h-4 text-[#76777d]" />
                              {job.location}
                              {job.is_external && (
                                <>
                                  <span className="w-1 h-1 rounded-full bg-[#c6c6cd] mx-1" />
                                  <span className="bg-amber-100 text-amber-800 text-[10px] px-2 py-0.5 rounded uppercase font-bold tracking-wider">
                                    DIŞ İLAN
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                          
                          {/* Apply Button */}
                          {job.is_external ? (
                            <a href={`https://www.google.com/search?q=${encodeURIComponent(job.company_name + ' ' + job.job_title + ' iş ilanı')}`} target="_blank" rel="noopener noreferrer" className="hidden md:flex shrink-0 items-center justify-center bg-[#f7f9fb] text-[#191c1e] hover:bg-amber-500 hover:border-amber-500 hover:text-white font-bold px-6 py-2.5 rounded-xl border border-[#e5e7eb] transition-all duration-300 shadow-sm">
                              Kaynağa Git <ArrowRight className="w-4 h-4 ml-2" />
                            </a>
                          ) : (
                            <Link href="/login" className="hidden md:flex shrink-0 items-center justify-center bg-[#f7f9fb] text-[#191c1e] hover:bg-[#4648d4] hover:border-[#4648d4] hover:text-white font-bold px-6 py-2.5 rounded-xl border border-[#e5e7eb] transition-all duration-300 shadow-sm">
                              Başvur <ArrowRight className="w-4 h-4 ml-2" />
                            </Link>
                          )}
                        </div>

                        <div className="mt-4">
                          <p className="text-sm text-[#45464d] line-clamp-2 leading-relaxed">
                            {job.description}
                          </p>
                        </div>

                        {/* Badges */}
                        <div className="mt-5 flex flex-wrap gap-2">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#eff4ff] text-[#4648d4] text-xs font-bold border border-[#d3e4fe]">
                            <Briefcase className="w-3.5 h-3.5" />
                            {job.work_type}
                          </span>
                          {job.salary_range && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f2f4f6] text-[#45464d] text-xs font-bold border border-[#e5e7eb]">
                              <DollarSign className="w-3.5 h-3.5 text-[#009485]" />
                              {job.salary_range}
                            </span>
                          )}
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#f2f4f6] text-[#45464d] text-xs font-bold border border-[#e5e7eb]">
                            <Clock className="w-3.5 h-3.5" />
                            Tam Zamanlı
                          </span>
                        </div>

                        {/* Mobile Apply Button */}
                        {job.is_external ? (
                          <a href={`https://www.google.com/search?q=${encodeURIComponent(job.company_name + ' ' + job.job_title + ' iş ilanı')}`} target="_blank" rel="noopener noreferrer" className="mt-6 flex md:hidden w-full items-center justify-center bg-amber-500 text-white font-bold px-6 py-3 rounded-xl transition-all shadow-sm">
                            Kaynağa Git
                          </a>
                        ) : (
                          <Link href="/login" className="mt-6 flex md:hidden w-full items-center justify-center bg-[#4648d4] text-white font-bold px-6 py-3 rounded-xl transition-all shadow-sm">
                            Hemen Başvur
                          </Link>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-[#c6c6cd]/30 py-12 px-6 md:px-16 bg-white mt-12">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-md bg-[#4648d4] flex items-center justify-center">
                <span className="text-white font-black text-xs">C</span>
              </div>
              <span className="font-black text-base text-[#191c1e]">CV<span className="text-[#4648d4]">io</span></span>
            </div>
            <p className="text-xs text-[#76777d] leading-relaxed">AI destekli kariyer platformu.</p>
          </div>
          <div className="md:col-span-3 flex justify-between items-center">
            <span className="text-sm text-[#45464d]">© {new Date().getFullYear()} CVio. Tüm Hakları Saklıdır.</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
