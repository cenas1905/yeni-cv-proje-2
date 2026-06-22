'use client';

import React, { useState, useEffect } from 'react';
import { createClientComponentClient } from '@/lib/supabase-client';
import { FileText, Download, Trash2, ExternalLink, Calendar, Plus, X, Search, Sparkles, Building2, ChevronRight, Eye } from 'lucide-react';
import Link from 'next/link';

interface CoverLetter {
  id: string;
  company_name: string;
  company_website: string | null;
  job_title: string;
  content: string;
  created_at: string;
}

export default function CoverLettersPage() {
  const supabase = createClientComponentClient();
  const [letters, setLetters] = useState<CoverLetter[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedLetter, setSelectedLetter] = useState<CoverLetter | null>(null);

  useEffect(() => {
    fetchCoverLetters();
  }, []);

  async function fetchCoverLetters() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('cover_letters')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLetters(data || []);
    } catch (err) {
      console.error('Error fetching cover letters:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm('Bu motivasyon mektubunu silmek istediğinize emin misiniz?')) return;

    try {
      const { error } = await supabase
        .from('cover_letters')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setLetters(letters.filter(item => item.id !== id));
      if (selectedLetter?.id === id) {
        setSelectedLetter(null);
      }
    } catch (err) {
      console.error('Delete error:', err);
      alert('Mektup silinirken bir hata oluştu.');
    }
  }

  const filteredLetters = letters.filter(item => 
    item.company_name.toLowerCase().includes(search.toLowerCase()) ||
    item.job_title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-8 py-4 font-sans text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight">Motivasyon Mektuplarım</h1>
          <p className="text-slate-400 text-sm mt-1.5">Şirketlere özel oluşturduğunuz yapay zeka destekli motivasyon mektupları.</p>
        </div>
        <Link 
          href="/cover-letters/new" 
          className="inline-flex items-center justify-center gap-2 bg-white text-black px-4 py-2.5 rounded-xl font-semibold text-sm hover:bg-slate-200 transition-all shadow-lg shadow-white/5 active:scale-95"
        >
          <Plus className="w-4 h-4" /> Yeni Mektup Üret
        </Link>
      </div>

      {/* Search & Stats */}
      {letters.length > 0 && (
        <div className="flex items-center gap-3 bg-white/5 px-4 py-3 rounded-xl border border-white/10 max-w-md">
          <Search className="w-4 h-4 text-slate-500" />
          <input
            type="text"
            placeholder="Şirket veya pozisyon ara..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-none outline-none text-sm placeholder:text-slate-500 w-full focus:ring-0 focus:outline-none"
          />
        </div>
      )}

      {/* Main Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-44 bg-white/5 border border-white/10 rounded-2xl animate-pulse"></div>
          ))}
        </div>
      ) : filteredLetters.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center border border-dashed border-white/10 rounded-2xl p-8 bg-white/[0.01]">
          <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4 text-slate-500">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="font-bold text-lg text-slate-300">Mektup Bulunmamaktadır</h3>
          <p className="text-slate-500 text-sm max-w-xs mt-1.5">Henüz şirket analizli bir motivasyon mektubu oluşturmadınız. Hemen bir tane üretin!</p>
          <Link 
            href="/cover-letters/new" 
            className="mt-5 inline-flex items-center justify-center gap-2 bg-white/10 text-white border border-white/25 hover:bg-white/15 px-4 py-2 rounded-lg font-medium text-xs transition-all"
          >
            İlk Mektubunu Oluştur
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLetters.map(item => (
            <div 
              key={item.id} 
              className="group relative flex flex-col justify-between p-5 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/15 hover:bg-white/[0.04] transition-all duration-300"
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center border border-white/10">
                      <Building2 className="w-4 h-4 text-indigo-400" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[15px] leading-tight text-white group-hover:text-indigo-300 transition-colors">
                        {item.company_name}
                      </h4>
                      {item.company_website && (
                        <a 
                          href={item.company_website.startsWith('http') ? item.company_website : `https://${item.company_website}`}
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-[10px] text-slate-500 hover:text-white flex items-center gap-0.5 mt-0.5"
                        >
                          {item.company_website.replace(/https?:\/\/(www\.)?/, '')} <ExternalLink className="w-2.5 h-2.5" />
                        </a>
                      )}
                    </div>
                  </div>
                </div>

                <div>
                  <div className="text-xs text-slate-400 font-medium">Pozisyon</div>
                  <div className="text-sm font-semibold text-white truncate">{item.job_title}</div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-slate-500">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{new Date(item.created_at).toLocaleDateString('tr-TR')}</span>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-5 pt-4 border-t border-white/[0.06]">
                <button
                  onClick={() => setSelectedLetter(item)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 bg-white/5 hover:bg-white/10 text-white rounded-lg py-2 text-xs font-semibold border border-white/10 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" /> İncele
                </button>
                <a
                  href={`/api/cover-letter/download?clId=${item.id}`}
                  className="inline-flex items-center justify-center gap-1 bg-white text-black hover:bg-slate-200 rounded-lg p-2 text-xs font-semibold transition-colors"
                  title="PDF İndir"
                >
                  <Download className="w-3.5 h-3.5" />
                </a>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="inline-flex items-center justify-center text-slate-500 hover:text-red-400 p-2 rounded-lg hover:bg-red-500/10 transition-all border border-transparent hover:border-red-500/10"
                  title="Mektubu Sil"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview Modal / Drawer */}
      {selectedLetter && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0c0c10] border border-white/10 w-full max-w-2xl rounded-2xl flex flex-col max-h-[85vh] shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/10">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold bg-indigo-500/15 text-indigo-400 px-2.5 py-0.5 rounded-full border border-indigo-500/30">AI Şirket Analizli</span>
                </div>
                <h3 className="font-bold text-lg text-white mt-1">{selectedLetter.company_name} - {selectedLetter.job_title}</h3>
              </div>
              <button 
                onClick={() => setSelectedLetter(null)}
                className="text-slate-400 hover:text-white p-1 hover:bg-white/5 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 text-slate-300 text-sm leading-relaxed whitespace-pre-wrap select-text">
              {selectedLetter.content}
            </div>

            {/* Actions Footer */}
            <div className="px-6 py-4 border-t border-white/10 flex items-center justify-end gap-3 bg-black/40">
              <button 
                onClick={() => setSelectedLetter(null)}
                className="bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-lg px-4 py-2 text-xs font-semibold transition-colors"
              >
                Kapat
              </button>
              <a 
                href={`/api/cover-letter/download?clId=${selectedLetter.id}`}
                className="bg-white text-black hover:bg-slate-200 rounded-lg px-4 py-2 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-lg shadow-white/5"
              >
                <Download className="w-3.5 h-3.5" /> PDF İndir
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
