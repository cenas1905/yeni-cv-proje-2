'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClientComponentClient } from '@/lib/supabase-client';
import { Check, ArrowLeft, Loader2, Shield, Zap, AlertTriangle } from 'lucide-react';

const proFeatures = [
  'Kalıcı paylaşım bağlantısı',
  'Sınırsız AI içerik üretimi',
  'LinkedIn profilini içe aktar',
  'Tüm premium şablonlar',
  'Sınırsız PDF indirme',
  'Kapak mektubu oluşturucu',
  'İş eşleştirme analitiği',
  'Gerçek zamanlı görüntülenme istatistikleri',
  'Şirkete özel paylaşım URL\'si',
  'Öncelikli destek',
];

function UpgradeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isExpired = searchParams.get('expired') === 'true';
  const slug = searchParams.get('slug');
  const supabase = createClientComponentClient();
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserId(user.id);
      } else {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUserId(session.user.id);
        }
      }
    };
    fetchUser();
  }, [supabase]);

  const handleUpgrade = async () => {
    let currentUserId = userId;
    
    // On-demand session check as fallback if state userId is null
    if (!currentUserId) {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        currentUserId = session.user.id;
        setUserId(currentUserId);
      }
    }

    if (!currentUserId) {
      router.push('/register');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planType: 'monthly', userId: currentUserId, returnUrl: window.location.origin + '/upgrade' })
      });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
    } catch {
      alert('Ödeme başlatılamadı, lütfen tekrar deneyin.');
    } finally {
      setLoading(false);
    }
  };

  const currentPrice = 300;

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] font-sans selection:bg-[#0051d5] selection:text-white">
      <div className="max-w-[900px] mx-auto px-6 py-12 sm:py-16">
        
        {/* Expired warning banner */}
        {isExpired && (
          <div className="mb-8 p-4 rounded-xl border border-amber-300 bg-amber-50 text-amber-800 text-sm flex items-start gap-3 leading-relaxed shadow-sm">
            <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5 text-amber-600" />
            <div>
              <div className="font-bold text-[#0b1c30] mb-1">Paylaşım Bağlantınızın Süresi Doldu!</div>
              <div>
                {slug ? (
                  <><strong>/cv/{slug}</strong> adresindeki paylaşım bağlantınız ücretsiz plan sınırını (7 gün) aşmıştır. </>
                ) : (
                  <>Paylaşım bağlantınızın süresi dolmuştur. </>
                )}
                Bağlantıyı tekrar aktif hale getirmek, kalıcı kılmak ve şirketlere özel URL'ler almak için lütfen Pro plana geçin.
              </div>
            </div>
          </div>
        )}
        
        {/* Back */}
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#45464d] hover:text-[#0051d5] transition-colors mb-12">
          <ArrowLeft className="w-4 h-4" /> Dashboard'a Dön
        </Link>

        {/* Header */}
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#c6c6cd] bg-white text-[12px] font-bold text-[#0051d5] shadow-sm">
            <Zap className="w-3.5 h-3.5 fill-current" /> CVio Pro
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-[#0b1c30]">
            Kariyerinize <span className="text-[#0051d5]">yatırım yapın.</span>
          </h1>
          <p className="text-[#45464d] text-base max-w-md mx-auto font-medium">
            Tek bir başarılı iş görüşmesi, üyelik ücretini fazlasıyla karşılar.
          </p>
        </div>

        {/* Main Pricing Card */}
        <div className="max-w-lg mx-auto mb-12">
          <div className="rounded-2xl border border-[#c6c6cd] bg-white p-8 sm:p-10 shadow-md">
            
            {/* Price */}
            <div className="mb-8 text-center sm:text-left">
              <div className="flex items-baseline justify-center sm:justify-start gap-2">
                <span className="text-5xl font-black text-[#0b1c30]">₺{currentPrice}</span>
                <span className="text-[#45464d] text-sm font-semibold">/ay</span>
              </div>
            </div>

            {/* CTA */}
            <button
              onClick={handleUpgrade}
              disabled={loading}
              className="w-full py-4 rounded-xl bg-[#0051d5] text-white font-bold text-[14px] hover:bg-[#316bf3] active:scale-98 transition-all disabled:opacity-75 flex items-center justify-center gap-2 mb-8 shadow-md shadow-[#0051d5]/20 cursor-pointer"
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Güvenli Ödeme Sayfasına Yönlendiriliyorsunuz...</>
              ) : (
                <>Pro Üyeliğe Geç — ₺{currentPrice}/ay</>
              )}
            </button>

            {/* Features */}
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-[#76777d] uppercase tracking-wider mb-2">Tüm Pro Özellikleri Dahil:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {proFeatures.map(f => (
                  <div key={f} className="flex items-center gap-3 text-[13px] text-[#45464d] font-medium">
                    <div className="w-5 h-5 rounded-full bg-[#eff4ff] border border-[#0051d5]/20 flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3 text-[#0051d5] stroke-[3]" />
                    </div>
                    {f}
                  </div>
                ))}
              </div>
            </div>

            {/* Trust */}
            <div className="mt-8 pt-6 border-t border-[#c6c6cd]/40 flex flex-wrap items-center justify-center gap-6 text-[11px] text-[#76777d] font-semibold">
              <span className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-emerald-600" /> SSL Güvenli Ödeme
              </span>
              <span className="flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" /> 14 Gün İade Garantisi
              </span>
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-emerald-600" /> Anında Etkinleştirme
              </span>
            </div>
          </div>
        </div>

        {/* Compare Table */}
        <div className="max-w-lg mx-auto">
          <div className="rounded-xl border border-[#c6c6cd] bg-white overflow-hidden shadow-sm">
            <table className="w-full text-[13px]">
              <thead>
                <tr className="border-b border-[#c6c6cd] bg-[#f8f9ff]">
                  <th className="px-5 py-4 text-left text-[#0b1c30] font-bold">Plan Özellikleri</th>
                  <th className="px-5 py-4 text-center text-[#45464d] font-semibold">Ücretsiz</th>
                  <th className="px-5 py-4 text-center text-[#0051d5] font-bold">Pro</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Özgeçmiş Oluşturma', 'Sınırsız', 'Sınırsız'],
                  ['Paylaşım Bağlantısı', '7 gün geçerli', 'Süresiz & Kalıcı'],
                  ['Yapay Zeka İçerik Üretimi', '1 kez', 'Sınırsız'],
                  ['LinkedIn Profil Import', '—', 'Sınırsız'],
                  ['Premium Tasarım Şablonları', '1 Şablon', 'Tüm Şablonlar'],
                  ['İzlenme Analitiği', '—', 'Detaylı İstatistikler'],
                ].map(([f, free, pro], i) => (
                  <tr key={f} className={`border-b border-[#c6c6cd]/40 ${i % 2 ? 'bg-[#f8f9ff]/30' : ''}`}>
                    <td className="px-5 py-3.5 text-[#0b1c30] font-medium">{f}</td>
                    <td className="px-5 py-3.5 text-center text-[#76777d]">{free}</td>
                    <td className="px-5 py-3.5 text-center text-[#0051d5] font-bold">{pro}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

export default function UpgradePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#0051d5]" />
          <p className="font-bold">Sayfa Yükleniyor...</p>
        </div>
      </div>
    }>
      <UpgradeContent />
    </Suspense>
  );
}
