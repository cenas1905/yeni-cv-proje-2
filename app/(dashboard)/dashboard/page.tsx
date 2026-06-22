import React from 'react';
import Link from 'next/link';
import { createClient } from '@/lib/supabase-server';
import {
  PlusCircle, FileText, Eye, Edit, Share2,
  ArrowRight, Clock, Zap, AlertTriangle, CheckCircle2,
  TrendingUp, Download, Trash2, Calendar, Sparkles,
  BarChart2, Target, Link2
} from 'lucide-react';
import DeleteCVButton from '@/components/dashboard/DeleteCVButton';

export const dynamic = 'force-dynamic';

interface DashboardPageProps {
  searchParams: Promise<{ upgraded?: string }>;
}

export default async function DashboardPage(props: DashboardPageProps) {
  const searchParams = await props.searchParams;
  const isUpgradedSuccess = searchParams.upgraded === 'true';

  const supabase = await createClient();

  // Mock mode when Supabase is not configured
  if (!supabase) {
    return <DashboardUI firstName="Demo" isPro={false} cvs={[]} totalViews={0} activeLinks={0} isUpgradedSuccess={false} />;
  }

  const { data: { user } } = await supabase.auth.getUser();
  const userId = user?.id;

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', userId).single();
  const { data: cvs } = await supabase.from('cvs').select('*').eq('user_id', userId).order('created_at', { ascending: false });

  const isPro = profile?.plan === 'pro' || profile?.plan === 'annual';
  const firstName = profile?.full_name?.split(' ')[0] || 'Kullanıcı';
  const totalViews = cvs?.reduce((sum: number, cv: any) => sum + (cv.view_count || 0), 0) || 0;
  const activeLinks = cvs?.filter((cv: any) => cv.is_public && cv.slug)?.length || 0;

  return (
    <DashboardUI
      firstName={firstName}
      isPro={isPro}
      cvs={cvs || []}
      totalViews={totalViews}
      activeLinks={activeLinks}
      isUpgradedSuccess={isUpgradedSuccess}
    />
  );
}

function DashboardUI({
  firstName,
  isPro,
  cvs,
  totalViews,
  activeLinks,
  isUpgradedSuccess,
}: {
  firstName: string;
  isPro: boolean;
  cvs: any[];
  totalViews: number;
  activeLinks: number;
  isUpgradedSuccess: boolean;
}) {
  return (
    <div className="flex flex-col gap-6" style={{ fontFamily: 'Inter, sans-serif' }}>

      {/* ─── UPGRADE SUCCESS ALERT ─── */}
      {isUpgradedSuccess && (
        <div className="flex items-center gap-3 p-5 rounded-xl border border-emerald-300/30 bg-emerald-50 shadow-sm">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <span className="font-bold text-[#0b1c30] text-sm">Planınız Yükseltildi!</span>
            <p className="text-[#45464d] text-xs mt-0.5">CVio Pro özellikleri artık hesabınızda aktif.</p>
          </div>
        </div>
      )}

      {/* ─── WELCOME HEADER ─── */}
      <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-6 rounded-xl border border-[#c6c6cd]/50 shadow-sm relative overflow-hidden">
        <div className="relative z-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#0b1c30] mb-2">
            Hoş geldin, {firstName}.
          </h1>
          <p className="text-base text-[#45464d]">Kariyer yolculuğun bugün güçlü görünüyor.</p>
        </div>
        <Link
          href="/dashboard/cv/new"
          className="bg-[#0051d5] text-white px-6 py-3 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-[#316bf3] transition-colors shadow-sm whitespace-nowrap z-10 shrink-0"
        >
          <Link2 className="w-4 h-4" />
          LinkedIn'den İçe Aktar
        </Link>
        {/* Decorative background blur */}
        <div className="absolute -right-20 -top-20 w-64 h-64 bg-[#b4c5ff] rounded-full mix-blend-multiply filter blur-3xl opacity-30 pointer-events-none" />
      </section>

      {/* ─── BENTO GRID STATS ─── */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* ATS Score Card */}
        <div className="bg-white p-6 rounded-xl border border-[#c6c6cd]/50 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="flex justify-between items-start mb-6 z-10">
            <h2 className="text-lg font-semibold text-[#0b1c30]">ATS Skoru</h2>
            <BarChart2 className="w-5 h-5 text-[#0051d5]" />
          </div>
          <div className="flex flex-col items-center z-10">
            <div className="relative w-28 h-28 flex items-center justify-center mb-4">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="#e5eeff" strokeWidth="8" />
                <circle cx="50" cy="50" r="45" fill="none" stroke="#0051d5" strokeWidth="8"
                  strokeDasharray="283" strokeDashoffset={cvs.length > 0 ? "42" : "283"}
                  className="transition-all duration-1000 ease-out" />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-4xl font-bold text-[#0051d5] leading-none">{cvs.length > 0 ? 85 : 0}</span>
                <span className="text-xs font-semibold text-[#45464d]">%</span>
              </div>
            </div>
            <p className="text-sm text-center text-[#45464d]">{cvs.length > 0 ? 'Yüksek Optimizasyon' : 'CV Oluşturun'}</p>
          </div>
        </div>

        {/* Application Pipeline */}
        <div className="col-span-1 md:col-span-2 bg-white p-6 rounded-xl border border-[#c6c6cd]/50 shadow-sm flex flex-col relative">
          <div className="flex justify-between items-start mb-6">
            <h2 className="text-lg font-semibold text-[#0b1c30]">Başvuru Durumu</h2>
            <Link href="#" className="text-sm text-[#0051d5] hover:underline font-medium">Tümünü Gör</Link>
          </div>
          <div className="flex-1 flex gap-4 h-full">
            {[
              { label: 'CV\'ler', value: cvs.length, color: '#c6c6cd' },
              { label: 'Görüntülenme', value: totalViews, color: '#b4c5ff' },
              { label: 'Aktif Link', value: activeLinks, color: '#0051d5' },
              { label: 'Paylaşım', value: activeLinks, color: '#c6c6cd', opacity: activeLinks === 0 },
            ].map((item, i) => (
              <div key={i} className={`flex-1 flex flex-col justify-end bg-[#eff4ff] rounded-lg p-4 relative group cursor-pointer hover:bg-[#d3e4fe] transition-colors border border-transparent hover:border-[#c6c6cd] ${item.opacity ? 'opacity-50' : ''}`}>
                <span className="text-2xl font-bold text-[#0b1c30] mb-1">{item.value}</span>
                <span className="text-xs font-semibold text-[#45464d]">{item.label}</span>
                <div className="absolute bottom-0 left-0 w-full h-1 rounded-b-lg" style={{ backgroundColor: item.color }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRO UPGRADE BANNER ─── */}
      {!isPro && (
        <div className="p-6 rounded-xl border border-[#7073ff]/30 bg-[#7073ff]/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 backdrop-blur-sm">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#7073ff]/10 border border-[#7073ff]/20 flex items-center justify-center text-[#7073ff] shrink-0 mt-0.5">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#0b1c30]">Pro'ya Yükselt ⚡</h3>
              <p className="text-[#45464d] text-xs mt-0.5">Kalıcı paylaşım linkleri, sınırsız AI kariyer koçu, görüntülenme analitiği ve daha fazlası.</p>
            </div>
          </div>
          <Link
            href="/upgrade"
            className="inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-lg bg-[#7073ff] hover:bg-[#7073ff]/90 text-white text-xs font-bold shadow-md shadow-[#7073ff]/20 transition-all shrink-0 w-full sm:w-auto"
          >
            Pro Özellikleri Aç <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* ─── ACTIVITY & ROADMAP SPLIT ─── */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent CV Versions */}
        <div className="bg-white p-6 rounded-xl border border-[#c6c6cd]/50 shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-[#0b1c30]">Son CV Versiyonları</h2>
          </div>

          {cvs.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-12 gap-4">
              <div className="w-14 h-14 rounded-xl bg-[#0051d5]/10 border border-[#0051d5]/20 flex items-center justify-center">
                <FileText className="w-6 h-6 text-[#0051d5]" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-sm font-bold text-[#0b1c30]">Henüz CV Yok</h3>
                <p className="text-xs text-[#76777d] max-w-xs leading-relaxed">LinkedIn profilinizi içe aktararak ilk CV'nizi oluşturun.</p>
              </div>
              <Link href="/dashboard/cv/new" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#0051d5] text-white text-xs font-medium transition-colors hover:bg-[#316bf3]">
                <PlusCircle className="w-4 h-4" /> İlk CV'mi Oluştur
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {cvs.slice(0, 3).map((cv: any) => (
                <Link
                  key={cv.id}
                  href={`/dashboard/cv/${cv.id}/edit`}
                  className="flex items-center justify-between p-4 bg-[#f8f9ff] rounded-lg border border-[#c6c6cd]/50 hover:border-[#0051d5] transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded bg-[#316bf3] text-white flex items-center justify-center shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm text-[#0b1c30] font-bold group-hover:text-[#0051d5] transition-colors truncate max-w-[200px]">{cv.title}</h3>
                      <p className="text-xs text-[#76777d] mt-0.5">
                        {new Date(cv.updated_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'short' })} düzenlendi
                      </p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold bg-[#d3e4fe] px-2 py-1 rounded text-[#45464d]">
                    ATS: {85}%
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Career Growth Roadmap */}
        <div className="bg-white p-6 rounded-xl border border-[#c6c6cd]/50 shadow-sm flex flex-col relative overflow-hidden">
          <h2 className="text-lg font-semibold text-[#0b1c30] mb-6">Büyüme Yol Haritası</h2>
          <div className="relative flex-1 pl-6 border-l-2 border-[#d3e4fe]">
            {/* Timeline Item 1 */}
            <div className="mb-8 relative">
              <div className="absolute -left-[27px] top-1 w-4 h-4 rounded-full bg-[#0051d5] border-4 border-white" />
              <h3 className="text-sm text-[#0b1c30] font-bold mb-1">Mevcut Hedef: Kıdemli Pozisyon</h3>
              <p className="text-sm text-[#45464d] mb-3">Stratejik liderlik anahtar kelimelerine odaklanılıyor.</p>
              {/* AI Suggestion Card */}
              <div className="bg-white/70 backdrop-blur-xl p-3 rounded-lg flex items-start gap-3 shadow-sm border border-[#7073ff]/20">
                <Sparkles className="w-5 h-5 text-[#7073ff] shrink-0" />
                <div>
                  <h4 className="text-xs text-[#0b1c30] font-bold mb-1">AI Önerisi</h4>
                  <p className="text-xs text-[#45464d]">Deneyim bölümünüze "Çapraz fonksiyonel ekip yönetimi" ekleyerek eşleşme oranını %12 artırın.</p>
                  <button className="mt-2 text-[#7073ff] text-xs font-semibold hover:underline">Öneriyi Uygula</button>
                </div>
              </div>
            </div>
            {/* Timeline Item 2 */}
            <div className="relative opacity-60">
              <div className="absolute -left-[27px] top-1 w-4 h-4 rounded-full bg-[#c6c6cd] border-4 border-white" />
              <h3 className="text-sm text-[#0b1c30] font-bold mb-1">Gelecek: Direktör Pozisyonu</h3>
              <p className="text-sm text-[#45464d]">P&L ve pazar stratejisine daha fazla odaklanılması gerekiyor.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── CV CARDS GRID ─── */}
      {cvs.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-[#76777d] uppercase tracking-widest">Tüm CV'leriniz</h2>
            <span className="text-xs font-semibold text-[#45464d] bg-[#d3e4fe] px-3 py-1 rounded-full">{cvs.length} adet</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {cvs.map((cv: any) => {
              const hasExpired = cv.link_expires_at && new Date(cv.link_expires_at) < new Date();
              const isShared = cv.is_public && cv.slug;
              const daysLeft = cv.link_expires_at
                ? Math.max(0, Math.ceil((new Date(cv.link_expires_at).getTime() - Date.now()) / 86400000))
                : null;

              return (
                <div key={cv.id} className="group relative bg-white rounded-xl border border-[#c6c6cd]/50 shadow-sm hover:border-[#0051d5] transition-all p-5 flex flex-col justify-between min-h-[220px] hover:shadow-md">
                  {/* Header */}
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1 flex-1 min-w-0">
                        <h3 className="text-sm font-bold text-[#0b1c30] truncate group-hover:text-[#0051d5] transition-colors">{cv.title}</h3>
                        <p className="text-[10px] text-[#76777d] flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(cv.updated_at).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long' })}
                        </p>
                      </div>
                      <span className="shrink-0 text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#eff4ff] border border-[#c6c6cd]/50 text-[#45464d]">
                        {cv.template}
                      </span>
                    </div>

                    {/* Sharing status */}
                    {isShared ? (
                      hasExpired ? (
                        <div className="flex items-center justify-between p-3 rounded-lg bg-red-50 border border-red-200 text-xs">
                          <span className="flex items-center gap-2 text-red-600 font-medium">
                            <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                            Süresi doldu
                          </span>
                          <Link href="/upgrade" className="text-[10px] text-red-500 hover:text-red-700 font-bold uppercase tracking-wider shrink-0">Uzat ⚡</Link>
                        </div>
                      ) : (
                        <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs">
                          <div className="flex items-center gap-2 min-w-0">
                            <span className="relative flex h-1.5 w-1.5 shrink-0">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                            </span>
                            <Link href={`/cv/${cv.slug}`} target="_blank" className="text-emerald-600 font-mono hover:underline truncate text-[11px]">
                              /cv/{cv.slug}
                            </Link>
                          </div>
                          {daysLeft !== null && !isPro && (
                            <span className="text-[9px] font-bold text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded shrink-0 ml-2">{daysLeft} gün</span>
                          )}
                        </div>
                      )
                    ) : (
                      <div className="flex items-center justify-between p-3 rounded-lg bg-[#eff4ff] border border-[#c6c6cd]/50 text-xs">
                        <span className="text-[#76777d]">Bağlantı Pasif / Taslak</span>
                        <Link href={`/dashboard/cv/${cv.id}/preview`} className="text-[10px] text-[#0051d5] hover:text-[#316bf3] font-bold uppercase tracking-wider shrink-0">Aktifleştir →</Link>
                      </div>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-4 py-3 text-xs text-[#76777d]">
                    <div className="flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5" />
                      <span><strong className="text-[#45464d]">{cv.view_count || 0}</strong> izlenme</span>
                    </div>
                    {cv.target_company && (
                      <div className="flex items-center gap-1.5 text-[#7073ff]">
                        <TrendingUp className="w-3.5 h-3.5" />
                        <span className="truncate max-w-[100px]">{cv.target_company}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-3 border-t border-[#c6c6cd]/30">
                    <Link
                      href={`/dashboard/cv/${cv.id}/edit`}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-[#eff4ff] hover:bg-[#d3e4fe] text-xs font-bold text-[#0b1c30] transition-colors"
                    >
                      <Edit className="w-3.5 h-3.5" /> Düzenle
                    </Link>
                    <Link
                      href={`/dashboard/cv/${cv.id}/preview`}
                      className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-lg bg-[#0051d5]/10 hover:bg-[#0051d5]/20 text-xs font-bold text-[#0051d5] transition-colors"
                    >
                      <Share2 className="w-3.5 h-3.5" /> Paylaş
                    </Link>
                    <a
                      href={cv.pdf_url || `/api/cv/generate-pdf?cvId=${cv.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-[#eff4ff] hover:bg-[#d3e4fe] text-[#45464d] hover:text-[#0b1c30] transition-colors"
                      title="PDF İndir"
                    >
                      <Download className="w-4 h-4" />
                    </a>
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <DeleteCVButton id={cv.id} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
