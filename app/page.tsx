'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  ArrowRight, Check, Star, Zap, ChevronDown,
  Link2, Sparkles, Share2, BarChart2, Shield, Users,
  CheckCircle2, TrendingUp, Play
} from 'lucide-react';

/* ─── Pricing data ─── */
const plans = [
  {
    name: 'Ücretsiz',
    price: '₺0',
    period: '/sonsuza kadar',
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
    price: '₺199',
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
  { q: 'Fiyatlar TL mi?', a: 'Evet, tüm fiyatlar Türk Lirası cinsindendir. Kredi/banka kartı ve havale ile ödeme yapabilirsiniz.' },
  { q: 'İptal edersem ne olur?', a: 'İstediğiniz zaman iptal edebilirsiniz. İptal sonrası abonelik süreniz bitene kadar Pro özelliklerine erişim devam eder.' },
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
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-[#4648d4]">
                <span className="text-white font-black text-sm">C</span>
              </div>
              <span className="font-black text-xl tracking-tight text-[#191c1e]">CV<span className="text-[#4648d4]">io</span></span>
            </Link>

            {/* Nav */}
            <nav className="hidden md:flex gap-8 items-center">
              <a href="#features" onClick={(e) => handleScroll(e, 'features')} className="text-[#45464d] hover:text-[#4648d4] font-medium text-sm transition-colors">Özellikler</a>
              <a href="#nasil-calisir" onClick={(e) => handleScroll(e, 'nasil-calisir')} className="text-[#45464d] hover:text-[#4648d4] font-medium text-sm transition-colors">Nasıl Çalışır?</a>
              <a href="#pricing" onClick={(e) => handleScroll(e, 'pricing')} className="text-[#45464d] hover:text-[#4648d4] font-medium text-sm transition-colors">Fiyatlar</a>
              <Link href="/login" className="text-[#45464d] hover:text-[#4648d4] font-medium text-sm transition-colors">Giriş Yap</Link>
            </nav>

            <Link href="/register" className="inline-flex items-center gap-1.5 bg-[#4648d4] hover:bg-[#4648d4]/90 text-white font-semibold text-sm py-2.5 px-6 rounded-lg transition-all active:scale-95">
              Ücretsiz Başla <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* ─── HERO ─── */}
      <section className="relative pt-16 pb-24 md:pt-24 md:pb-32 px-6 md:px-16 max-w-[1280px] mx-auto overflow-hidden">
        {/* Subtle background gradient */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-bl from-[#4648d4]/5 to-transparent -z-10 rounded-bl-full pointer-events-none" />

        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Left content */}
          <motion.div
            className="flex-1 z-10"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#4648d4]/10 text-[#4648d4] mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-bold uppercase tracking-wider">Next-Gen Kariyer Araçları</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-[#191c1e] leading-[1.08] tracking-tight mb-6">
              AI Destekli <br />
              <span className="text-[#4648d4] relative">
                Kariyer Yönetimi
                <svg className="absolute w-full h-3 -bottom-1 left-0 text-[#4648d4]/30" fill="none" viewBox="0 0 200 9" xmlns="http://www.w3.org/2000/svg">
                  <path d="M2.00035 7.15585C46.8529 2.45391 100.865 -1.02636 198.053 6.94042" stroke="currentColor" strokeLinecap="round" strokeWidth="3" />
                </svg>
              </span>
            </h1>

            <p className="text-lg text-[#45464d] mb-10 max-w-xl leading-relaxed">
              LinkedIn profilinizi ATS uyumlu, iş ilanına özel bir CV'ye dönüştürün. Claude AI'nın gücüyle dakikalar içinde işe alım görevlilerini etkileyin.
            </p>

            {/* LinkedIn URL input */}
            <form onSubmit={handleHeroSubmit} className="bg-white p-2 rounded-xl shadow-sm border border-[#c6c6cd]/30 flex flex-col sm:flex-row gap-2 max-w-2xl">
              <div className="flex-1 relative flex items-center">
                <Link2 className="absolute left-4 text-[#45464d] w-5 h-5 shrink-0" />
                <input
                  type="url"
                  value={linkedInUrl}
                  onChange={(e) => setLinkedInUrl(e.target.value)}
                  placeholder="LinkedIn profil URL'nizi yapıştırın..."
                  className="w-full pl-12 pr-4 py-4 rounded-lg border-none focus:ring-2 focus:ring-[#4648d4]/50 bg-transparent text-[#191c1e] placeholder-[#76777d] text-sm outline-none"
                />
              </div>
              <button
                type="submit"
                className="bg-gradient-to-r from-[#4648d4] to-[#009485] hover:opacity-90 text-white font-semibold text-sm px-8 py-4 rounded-lg flex items-center justify-center gap-2 transition-all whitespace-nowrap group"
              >
                <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
                CV'ye Dönüştür
              </button>
            </form>
            <p className="text-xs text-[#76777d] mt-3">Kredi kartı gerekmez · 7 günlük ücretsiz deneme</p>
          </motion.div>

          {/* Right: Floating CV mockup */}
          <motion.div
            className="flex-1 w-full relative h-[400px] lg:h-[500px] flex items-center justify-center"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-[#4648d4]/10 to-[#009485]/10 rounded-full blur-3xl opacity-50" />
            <div className="relative w-full max-w-md h-[400px] bg-white rounded-2xl shadow-lg border border-[#c6c6cd]/20 p-6 flex flex-col gap-4 overflow-hidden">
              {/* Skeleton CV */}
              <div className="flex items-start gap-4 pb-4 border-b border-[#c6c6cd]/20">
                <div className="w-14 h-14 rounded-full bg-[#eceef0] animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-3/4 bg-[#eceef0] rounded animate-pulse" />
                  <div className="h-3.5 w-1/2 bg-[#eceef0] rounded animate-pulse" />
                </div>
              </div>
              <div className="space-y-4 pt-2">
                <div className="h-3.5 w-1/3 bg-[#4648d4]/20 rounded animate-pulse" />
                <div className="space-y-2">
                  <div className="h-3 w-full bg-[#eceef0] rounded animate-pulse" />
                  <div className="h-3 w-5/6 bg-[#eceef0] rounded animate-pulse" />
                  <div className="h-3 w-4/6 bg-[#eceef0] rounded animate-pulse" />
                </div>
                <div className="h-3.5 w-1/3 bg-[#4648d4]/20 rounded animate-pulse" />
                <div className="space-y-2">
                  <div className="h-3 w-full bg-[#eceef0] rounded animate-pulse" />
                  <div className="h-3 w-4/6 bg-[#eceef0] rounded animate-pulse" />
                </div>
              </div>
              {/* Floating AI badge */}
              <div className="absolute bottom-6 right-6 bg-white/80 backdrop-blur-md px-3 py-2 rounded-full flex items-center gap-2 shadow-lg border border-[#4648d4]/20 animate-bounce" style={{ animationDuration: '3s' }}>
                <Sparkles className="w-3.5 h-3.5 text-[#4648d4]" />
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

      {/* ─── PRICING ─── */}
      <section id="pricing" className="py-24 px-6 md:px-16 bg-[#f2f4f6]">
        <div className="max-w-[1280px] mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#4648d4]/10 text-[#4648d4] mb-4">
              <span className="text-xs font-bold uppercase tracking-wider">Fiyatlandırma</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-[#191c1e] tracking-tight mb-4">
              Bir Sonraki Hamlenize Yatırım Yapın
            </h2>
            <p className="text-[#45464d] text-base">Şeffaf fiyatlandırma. Gizli ücret yok. İstediğiniz zaman iptal.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {plans.map((plan, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`bg-white p-8 rounded-2xl flex flex-col h-full relative ${
                  plan.popular
                    ? 'border-2 border-[#4648d4] shadow-lg shadow-[#4648d4]/10'
                    : 'border border-[#c6c6cd]/30 shadow-sm'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#4648d4] text-white text-xs font-black px-4 py-1 rounded-full uppercase tracking-wider">
                    En Popüler ⚡
                  </div>
                )}

                <div className="mb-8">
                  <h3 className="text-xl font-bold text-[#191c1e] mb-1">{plan.name}</h3>
                  <p className="text-sm text-[#76777d]">{plan.desc}</p>
                </div>

                <div className="mb-8">
                  <span className="text-5xl font-black text-[#191c1e]">{plan.price}</span>
                  <span className="text-sm text-[#76777d] ml-1">{plan.period}</span>
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-[#191c1e]">
                      <Check className="w-4 h-4 text-[#4648d4] shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                  {plan.locked.map((f, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-sm text-[#c6c6cd] line-through">
                      <Check className="w-4 h-4 text-[#c6c6cd] shrink-0 mt-0.5" />
                      {f}
                    </li>
                  ))}
                </ul>

                <Link href="/register">
                  <button className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all ${
                    plan.popular
                      ? 'bg-[#4648d4] hover:bg-[#4648d4]/90 text-white shadow-md shadow-[#4648d4]/20'
                      : 'border-2 border-[#c6c6cd]/50 text-[#191c1e] hover:bg-[#f2f4f6]'
                  }`}>
                    {plan.cta}
                  </button>
                </Link>
              </motion.div>
            ))}
          </div>

          <p className="text-center text-[#76777d] text-xs mt-8 flex items-center justify-center gap-2">
            <Shield className="w-4 h-4 text-[#009485]" />
            14 gün koşulsuz para iade garantisi · SSL Güvenli Altyapı
          </p>
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
              <p className="text-[11px] text-white/50">Kredi kartı gerekmez · Kolay kurulum · 7 gün ücretsiz</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FOOTER ─── */}
      <footer className="border-t border-[#c6c6cd]/30 py-12 px-6 md:px-16 bg-[#f7f9fb]">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-6 h-6 rounded-md bg-[#4648d4] flex items-center justify-center">
                <span className="text-white font-black text-xs">C</span>
              </div>
              <span className="font-black text-base text-[#191c1e]">CV<span className="text-[#4648d4]">io</span></span>
            </div>
            <p className="text-xs text-[#76777d] leading-relaxed">AI destekli CV oluşturucu ile kariyer hedeflerinize daha hızlı ulaşın.</p>
          </div>
          <div className="md:col-span-3 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <span className="text-sm text-[#45464d]">© {new Date().getFullYear()} CVio. Tüm Hakları Saklıdır.</span>
            <nav className="flex flex-wrap gap-4 md:gap-6">
              <a href="#" className="text-sm text-[#76777d] hover:text-[#4648d4] transition-colors">Gizlilik Politikası</a>
              <a href="#" className="text-sm text-[#76777d] hover:text-[#4648d4] transition-colors">Kullanım Koşulları</a>
              <a href="mailto:support@cvio.app" className="text-sm text-[#76777d] hover:text-[#4648d4] transition-colors">İletişim</a>
            </nav>
          </div>
        </div>
      </footer>
    </div>
  );
}
