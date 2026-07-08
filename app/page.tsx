'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight, Check, Star, Zap, ChevronDown,
  Link2, Sparkles, Share2, BarChart2, Shield, Users,
  CheckCircle2, TrendingUp, Play, Lock, Brain
} from 'lucide-react';

/* ─── Pricing data ─── */
const plans = [
  {
    name: 'Ücretsiz',
    price: '₺0',
    period: '/ 14 gün boyunca',
    desc: 'Başlamak için mükemmel',
    features: [
      'Sınırsız CV taslağı',
      '1 modern şablon',
      'PDF indirme (14 gün)',
      'Geçici paylaşım linki (14 gün)',
      '1 LinkedIn import hakkı',
    ],
    locked: [
      'Kalıcı paylaşım linki',
      'AI kariyer koçu',
      'Görüntülenme analitiği',
    ],
    cta: 'Ücretsiz Başla',
    popular: false,
  },
  {
    name: 'Pro',
    price: '₺300',
    period: '/ay',
    desc: 'Ciddi iş arayanlar için',
    features: [
      'Sınırsız CV taslağı',
      'Tüm premium şablonlar',
      'Sınırsız PDF indirme',
      'Kalıcı paylaşım linki',
      'Sınırsız LinkedIn import',
      'AI kariyer koçu (sınırsız)',
      'Görüntülenme analitiği',
      '14 gün iade garantisi',
    ],
    locked: [],
    cta: "Pro'ya Başla",
    popular: true,
  },
];

/* ─── Reviews ─── */
const reviews = [
  { name: 'Cem A.', role: 'Frontend Dev @ Trendyol', rating: 5, text: "LinkedIn'den 2dk'da CV çıkardım. AI optimizasyonuyla Google'a mülakat daveti aldım." },
  { name: 'Selin K.', role: 'PM @ Getir', rating: 5, text: 'Şirkete özel link özelliği muhteşem. HR\'lar CV\'mi açıp bakarken bildirim geliyor.' },
  { name: 'Burak T.', role: 'Data Scientist @ N11', rating: 5, text: 'AI koç mülakat hazırlığımda inanılmaz yardımcı oldu. İlk denemede işe girdim!' },
];

/* ─── Features ─── */
const features = [
  {
    icon: <Link2 className="w-6 h-6" />,
    title: 'LinkedIn Profil Import',
    desc: 'LinkedIn profil linkinizi yapıştırın; Apify scraper teknolojimiz tüm deneyim, eğitim ve yeteneklerinizi 30 saniyede otomatik çeksin.',
    demo: (
      <div className="flex items-center gap-3 bg-[#f8f9ff] p-3 rounded-lg border border-[#c6c6cd]/40 mt-4">
        <div className="w-8 h-8 rounded bg-[#e5eeff] flex items-center justify-center text-xs font-bold text-[#4648d4]">in</div>
        <div className="flex-1 h-2 bg-[#e5eeff] rounded-full overflow-hidden">
          <div className="h-full bg-[#4648d4] w-3/4 rounded-full" />
        </div>
        <span className="text-xs font-semibold text-[#4648d4]">%94 tamamlandı</span>
      </div>
    ),
  },
  {
    icon: <Sparkles className="w-6 h-6" />,
    title: 'AI ile Optimizasyon',
    desc: 'Claude AI, CV\'nizi hedef pozisyona ve şirkete göre analiz eder. ATS engellerini aşar, başarıları ölçülebilir hale getirir.',
    demo: (
      <div className="bg-[#f8f9ff] p-3 rounded-lg border border-[#c6c6cd]/40 mt-4 text-sm">
        <p className="line-through text-[#76777d] mb-2 text-xs">"Ekibi yönettim ve projeleri teslim ettim."</p>
        <p className="text-[#009485] font-medium flex items-start gap-1.5 text-xs">
          <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0" />
          "8 kişilik ekibi yöneterek 3 büyük ürün lansmanını zamanında tamamladım, kullanıcı bağlılığını %40 artırdım."
        </p>
      </div>
    ),
  },
  {
    icon: <Share2 className="w-6 h-6" />,
    title: 'Canlı Paylaşım Linki',
    desc: 'PDF\'den vazgeçin. Her cihazda mükemmel görünen takip edilebilir bir web linki paylaşın.',
    demo: (
      <div className="flex items-center justify-between bg-[#f8f9ff] p-3 rounded-lg border border-[#c6c6cd]/40 mt-4">
        <span className="text-xs text-[#45464d] truncate font-mono">cvio.app/cv/ali-yildiz</span>
        <div className="flex items-center gap-2 ml-2">
          <span className="text-xs font-semibold text-[#4648d4]">523 görüntülenme</span>
        </div>
      </div>
    ),
  },
];

/* ─── Steps ─── */
const steps = [
  { icon: '🔗', step: '01', title: 'LinkedIn Linkini Yapıştır', desc: 'Profil URL\'nizi girin. Apify teknolojisiyle tüm verileriniz 30 saniyede çekilir.' },
  { icon: '🤖', step: '02', title: 'AI ile Optimize Et', desc: 'Claude AI hedeflediğiniz şirkete ve pozisyona göre CV\'nizi yeniden yazar.' },
  { icon: '🚀', step: '03', title: 'Paylaş & Takip Et', desc: 'Özel linkinizi gönderin. Kim baktı, kaç kez, gerçek zamanlı görün.' },
];

const faqs = [
  { q: 'LinkedIn import nasıl çalışır?', a: 'Profil URL\'nizi girin; Apify scraper teknolojisiyle tüm iş deneyimi, eğitim, sertifika ve becerilerinizi otomatik çekeriz. Gizliliğiniz korunur.' },
  { q: 'AI optimizasyon gerçekten fark yaratıyor mu?', a: 'Evet. Claude modelimiz CV\'nizi ATS kriterlerine göre analiz eder, başarıları ölçülebilir hale getirir. Kullanıcılarımızın %94\'ü mülakat daveti almaktadır.' },
];

export default function HomePage() {
  const [linkedInUrl, setLinkedInUrl] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleHeroSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.href = `/register?linkedin=${encodeURIComponent(linkedInUrl)}`;
  };

  return (
    <div className="min-h-screen bg-[#f7f9fb] text-[#191c1e] font-sans selection:bg-[#4648d4] selection:text-white">

      {/* ─── STICKY HEADER ─── */}
      <header className="sticky top-0 z-50 bg-[#f7f9fb]/90 backdrop-blur-md border-b border-[#c6c6cd]/30 shadow-sm transition-all duration-300">
        <div className="max-w-[1280px] mx-auto px-6 md:px-16">
          <div className="flex justify-between items-center h-20">
            {/* Premium Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-tr from-[#4648d4] via-[#5c5ee6] to-[#009485] shadow-lg shadow-[#4648d4]/30 border border-white/20 group-hover:scale-105 transition-transform">
                <Brain className="text-white w-5 h-5" />
              </div>
              <span className="font-black text-2xl tracking-tighter text-[#191c1e]">cvio<span className="text-[#4648d4]">.</span></span>
            </Link>

            {/* Nav */}
            <nav className="hidden md:flex gap-8 items-center">
              <Link href="/jobs" className="text-[#45464d] hover:text-[#4648d4] font-medium text-sm transition-colors">İş İlanları</Link>
              <a href="#features" onClick={(e) => handleScroll(e, 'features')} className="text-[#45464d] hover:text-[#4648d4] font-medium text-sm transition-colors">Özellikler</a>
              <a href="#nasil-calisir" onClick={(e) => handleScroll(e, 'nasil-calisir')} className="text-[#45464d] hover:text-[#4648d4] font-medium text-sm transition-colors">Nasıl Çalışır?</a>
              <Link href="/login" className="text-[#45464d] hover:text-[#4648d4] font-medium text-sm transition-colors">Giriş Yap</Link>
            </nav>

            <Link href="/register" className="inline-flex items-center gap-1.5 bg-[#4648d4] hover:bg-[#4648d4]/90 text-white font-semibold text-sm py-2.5 px-6 rounded-lg transition-all active:scale-95">
              Ücretsiz Başla <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* ─── HERO ─── */}
      <section className="relative pt-16 pb-24 md:pt-24 md:pb-32 px-6 md:px-16 overflow-hidden">
        {/* Background Image & Overlay */}
        <div className="absolute inset-0 z-0">
          <img src="/main_hero_bg.png" alt="CVio Hero Background" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[4px]" />
        </div>

        <div className="relative z-10 max-w-[1280px] mx-auto flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Left content */}
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-blue-200 border border-white/20 backdrop-blur-md">
                <Sparkles className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Next-Gen Kariyer Araçları</span>
              </div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#009485]/20 text-[#20e8d3] border border-[#009485]/30 backdrop-blur-md">
                <Shield className="w-3.5 h-3.5" />
                <span className="text-[10px] font-bold uppercase tracking-wider">%100 KVKK & GDPR Uyumlu</span>
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-[1.08] tracking-tight mb-6 drop-shadow-lg">
              AI Destekli <br />
              <span className="text-blue-400 relative">
                Kariyer Yönetimi
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-blue-400/50" fill="none" viewBox="0 0 200 9" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.00035 7.15585C46.8529 2.45391 100.865 -1.02636 198.053 6.94042" stroke="currentColor" strokeLinecap="round" strokeWidth="3" />
                </svg>
              </span>
            </h1>

            <p className="text-lg text-white/80 mb-10 max-w-xl leading-relaxed drop-shadow-md">
              LinkedIn profilinizi ATS uyumlu, iş ilanına özel bir CV'ye dönüştürün. Claude AI'nın gücüyle dakikalar içinde işe alım görevlilerini etkileyin.
            </p>

            {/* LinkedIn URL input */}
            <form onSubmit={handleHeroSubmit} className="bg-white/10 backdrop-blur-xl p-2 rounded-xl shadow-2xl border border-white/20 flex flex-col sm:flex-row gap-2 max-w-2xl">
              <div className="flex-1 relative flex items-center">
                <Link2 className="absolute left-4 text-white/60 w-5 h-5 shrink-0" />
                <input
                  type="url"
                  value={linkedInUrl}
                  onChange={(e) => setLinkedInUrl(e.target.value)}
                  placeholder="LinkedIn profil URL'nizi yapıştırın..."
                  className="w-full pl-12 pr-4 py-4 rounded-lg border-none focus:ring-2 focus:ring-blue-400/50 bg-transparent text-white placeholder-white/60 text-sm outline-none"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm px-8 py-4 rounded-lg flex items-center justify-center gap-2 transition-all whitespace-nowrap shadow-lg group"
              >
                <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                CV'ye Dönüştür
              </button>
            </form>
            <p className="text-xs text-white/60 mt-3 drop-shadow-sm">Kredi kartı gerekmez</p>
          </motion.div>

          {/* Right: Floating CV mockup */}
          <motion.div
            className="flex-1 w-full relative h-[400px] lg:h-[500px] flex items-center justify-center"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-3xl opacity-50" />
            <div className="relative w-full max-w-md h-[400px] bg-white/90 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 p-6 flex flex-col gap-4 overflow-hidden">
              {/* Skeleton CV */}
              <div className="flex items-start gap-4 pb-4 border-b border-[#c6c6cd]/30">
                <div className="w-14 h-14 rounded-full bg-[#eceef0] animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-3/4 bg-[#eceef0] rounded animate-pulse" />
                  <div className="h-3.5 w-1/2 bg-[#eceef0] rounded animate-pulse" />
                </div>
              </div>
              <div className="space-y-4 pt-2">
                <div className="h-3.5 w-1/3 bg-blue-500/20 rounded animate-pulse" />
                <div className="space-y-2">
                  <div className="h-3 w-full bg-[#eceef0] rounded animate-pulse" />
                  <div className="h-3 w-5/6 bg-[#eceef0] rounded animate-pulse" />
                  <div className="h-3 w-4/6 bg-[#eceef0] rounded animate-pulse" />
                </div>
                <div className="h-3.5 w-1/3 bg-blue-500/20 rounded animate-pulse" />
                <div className="space-y-2">
                  <div className="h-3 w-full bg-[#eceef0] rounded animate-pulse" />
                  <div className="h-3 w-4/6 bg-[#eceef0] rounded animate-pulse" />
                </div>
              </div>
              {/* Floating AI badge */}
              <div className="absolute bottom-6 right-6 bg-white/90 backdrop-blur-md px-3 py-2 rounded-full flex items-center gap-2 shadow-lg border border-blue-500/20 animate-bounce" style={{ animationDuration: '3s' }}>
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span className="text-xs font-semibold text-[#191c1e]">AI Optimize Ediliyor...</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ─── STATS ─── */}
      <section className="bg-white border-y border-[#c6c6cd]/30 py-12">
        <div className="max-w-[1280px] mx-auto px-6 md:px-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: '2.400+', label: 'Aktif Kullanıcı' },
            { value: '%94', label: 'Mülakat Başarısı' },
            { value: '60sn', label: 'Ortalama Oluşturma' },
            { value: '4.9★', label: 'Kullanıcı Puanı' },
          ].map((stat, i) => (
            <div key={i} className="space-y-1">
              <div className="text-3xl font-black text-[#4648d4]">{stat.value}</div>
              <div className="text-xs text-[#76777d] font-medium uppercase tracking-wider">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── FEATURES ─── */}
      <section id="features" className="py-24 px-6 md:px-16 bg-[#f2f4f6]">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#4648d4]/10 text-[#4648d4] mb-4">
              <span className="text-xs font-bold uppercase tracking-wider">Güçlü Özellikler</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#191c1e] tracking-tight mb-4">
              Kariyeriniz İçin Hassas Mühendislik
            </h2>
            <p className="text-[#45464d] text-base leading-relaxed">
              AI'mız sadece metni biçimlendirmez; sizi hedef rolleriniz için optimum şekilde konumlandırmak üzere sektör bağlamını anlar.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((feat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-white p-8 rounded-2xl shadow-sm border border-[#c6c6cd]/20 hover:-translate-y-1 hover:shadow-md transition-all duration-300 group"
              >
                <div className="w-12 h-12 bg-[#4648d4]/10 rounded-xl flex items-center justify-center mb-6 text-[#4648d4] group-hover:scale-110 transition-transform">
                  {feat.icon}
                </div>
                <h3 className="text-lg font-bold text-[#191c1e] mb-3">{feat.title}</h3>
                <p className="text-sm text-[#45464d] leading-relaxed">{feat.desc}</p>
                {feat.demo}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section id="nasil-calisir" className="py-24 px-6 md:px-16 bg-white">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#4648d4]/10 text-[#4648d4] mb-4">
              <span className="text-xs font-bold uppercase tracking-wider">Nasıl Çalışır?</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#191c1e] tracking-tight mb-4">3 Adımda Mülakatınızı Garantileyin</h2>
            <p className="text-[#45464d] text-base">Mükemmel bir CV oluşturmak hiç bu kadar zahmetsiz olmamıştı.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {steps.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-[#f7f9fb] border border-[#c6c6cd]/30 rounded-2xl p-8 space-y-4 hover:border-[#4648d4]/30 hover:shadow-sm transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-[#4648d4]/10 border border-[#4648d4]/20 flex items-center justify-center text-2xl">
                  {s.icon}
                </div>
                <div className="text-[10px] font-black text-[#4648d4] tracking-widest uppercase">Adım {s.step}</div>
                <h3 className="text-base font-bold text-[#191c1e]">{s.title}</h3>
                <p className="text-sm text-[#45464d] leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>



      {/* ─── TESTIMONIALS ─── */}
      <section id="yorumlar" className="py-24 px-6 md:px-16 bg-white">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#4648d4]/10 text-[#4648d4] mb-4">
              <span className="text-xs font-bold uppercase tracking-wider">Kullanıcı Yorumları</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#191c1e] tracking-tight mb-4">
              Kullanıcılarımız Neler Diyor?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {reviews.map((r, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-[#f7f9fb] border border-[#c6c6cd]/30 rounded-2xl p-8 space-y-4 hover:border-[#4648d4]/30 hover:shadow-sm transition-all duration-300"
              >
                <div className="flex">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star key={star} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-[#45464d] text-sm leading-relaxed italic">"{r.text}"</p>
                <div className="flex items-center gap-3 pt-3 border-t border-[#c6c6cd]/30">
                  <div className="w-9 h-9 rounded-full bg-[#4648d4]/10 text-[#4648d4] flex items-center justify-center font-bold text-sm border border-[#4648d4]/20">
                    {r.name[0]}
                  </div>
                  <div>
                    <h5 className="font-bold text-[#191c1e] text-xs">{r.name}</h5>
                    <p className="text-[10px] text-[#76777d]">{r.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="py-24 px-6 md:px-16 bg-[#f2f4f6]">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-black text-[#191c1e] text-center mb-12">Sık Sorulan Sorular</h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="bg-white border border-[#c6c6cd]/30 rounded-xl overflow-hidden shadow-sm">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left text-sm font-bold text-[#191c1e] hover:bg-[#f7f9fb] transition-colors"
                >
                  {faq.q}
                  <ChevronDown className={`w-4 h-4 text-[#76777d] transition-transform duration-200 shrink-0 ml-4 ${openFaq === i ? 'rotate-180' : ''}`} />
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 pt-1 text-sm text-[#45464d] leading-relaxed border-t border-[#c6c6cd]/30">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="py-24 px-6 md:px-16 bg-white">
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-3xl bg-gradient-to-br from-[#4648d4] to-[#2f2ebe] text-white overflow-hidden px-8 py-20 text-center space-y-6 shadow-2xl shadow-[#4648d4]/20">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4 pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4 pointer-events-none" />
            <div className="relative z-10 space-y-4">
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">
                Hayalinizdeki Mülakata <br /> Hazır Mısınız?
              </h2>
              <p className="text-white/70 text-sm sm:text-base max-w-lg mx-auto">
                60 saniyede profesyonel CV'nizi oluşturun ve şirketlere özel paylaşım linkinizi gönderin.
              </p>
              <div className="pt-4">
                <Link href="/register" className="inline-flex items-center justify-center bg-white text-[#4648d4] font-black text-sm py-4 px-8 rounded-xl hover:bg-[#f7f9fb] transition-all shadow-lg">
                  Ücretsiz Başla <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </div>
              <p className="text-[11px] text-white/50">Kredi kartı gerekmez · Kolay kurulum</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-[#c6c6cd]/30 py-16 px-6 md:px-16 bg-[#f7f9fb]">
        <div className="max-w-[1280px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-tr from-[#4648d4] via-[#5c5ee6] to-[#009485] shadow-lg shadow-[#4648d4]/30 border border-white/20">
                  <Brain className="text-white w-5 h-5" />
                </div>
                <span className="font-black text-2xl tracking-tighter text-[#191c1e]">cvio<span className="text-[#4648d4]">.</span></span>
              </div>
              <p className="text-xs text-[#76777d] leading-relaxed mb-6">
                Türkiye'nin en güvenilir, yapay zeka destekli CV ve kariyer platformu. Verileriniz KVKK ve GDPR kapsamında korunmaktadır.
              </p>
              <div className="flex items-center gap-3 text-xs font-bold text-[#009485] bg-[#009485]/10 px-3 py-2 rounded-lg inline-flex">
                <Shield className="w-4 h-4" />
                256-bit SSL Korumalı
              </div>
            </div>

            <div>
              <h4 className="font-bold text-[#191c1e] mb-4">Şirket</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-sm text-[#76777d] hover:text-[#4648d4] transition-colors">Hakkımızda</a></li>
                <li><a href="#" className="text-sm text-[#76777d] hover:text-[#4648d4] transition-colors">Kariyer</a></li>
                <li><Link href="/iletisim" className="text-sm text-[#76777d] hover:text-[#4648d4] transition-colors">İletişim</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-[#191c1e] mb-4">Yasal</h4>
              <ul className="space-y-3">
                <li><Link href="/kullanim-kosullari" className="text-sm text-[#76777d] hover:text-[#4648d4] transition-colors">Kullanım Koşulları</Link></li>
                <li><Link href="/gizlilik-politikasi" className="text-sm text-[#76777d] hover:text-[#4648d4] transition-colors">Gizlilik Politikası</Link></li>
                <li><Link href="/mesafeli-satis-sozlesmesi" className="text-sm text-[#76777d] hover:text-[#4648d4] transition-colors">Mesafeli Satış Sözleşmesi</Link></li>
                <li><Link href="/iptal-ve-iade-kosullari" className="text-sm text-[#76777d] hover:text-[#4648d4] transition-colors">İptal ve İade Koşulları</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-[#191c1e] mb-4">İletişim</h4>
              <ul className="space-y-3 text-sm text-[#76777d]">
                <li className="flex items-start gap-2">
                  <strong className="text-[#45464d] min-w-[50px]">Email:</strong>
                  <a href="mailto:destek@cvio-ai.com.tr" className="hover:text-[#4648d4]">destek@cvio-ai.com.tr</a>
                </li>
                <li className="flex items-start gap-2">
                  <strong className="text-[#45464d] min-w-[50px]">Adres:</strong>
                  <span>Maslak Mah. Büyükdere Cad. No:235 <br/> Sarıyer / İstanbul</span>
                </li>
                <li className="flex items-start gap-2 mt-4 text-[11px] opacity-70">
                  <strong className="text-[#45464d] min-w-[50px]">Mersis:</strong>
                  <span>0123-4567-8901-2345</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-[#c6c6cd]/30 flex flex-col md:flex-row justify-between items-center gap-4">
            <span className="text-sm text-[#45464d]">© {new Date().getFullYear()} CVio Yazılım Teknolojileri A.Ş. Tüm Hakları Saklıdır.</span>
            <div className="flex items-center gap-4 opacity-60 grayscale hover:opacity-90 transition-opacity">
              <span className="font-extrabold text-sm tracking-tight text-[#0b1c30] flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-emerald-600" /> iyzico ile Güvenli Ödeme
              </span>
              <span className="font-bold text-base italic text-[#0b1c30]">VISA</span>
              <span className="font-bold text-base text-[#0b1c30]">MasterCard</span>
              <span className="font-bold text-base text-[#0b1c30] tracking-wide">TROY</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
