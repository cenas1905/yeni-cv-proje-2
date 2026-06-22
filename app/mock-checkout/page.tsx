'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Sparkles, ShieldCheck, Lock, CreditCard, Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

function MockCheckoutContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const userId = searchParams.get('userId');
  const planType = searchParams.get('planType') || 'pro';
  
  const [loading, setLoading] = useState(false);
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvc, setCvc] = useState('');

  const price = '₺300,00';
  const period = '/ay';

  // Format card number like 0000 0000 0000 0000
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 16) value = value.substring(0, 16);
    const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
    setCardNumber(formatted);
  };

  // Format expiry like MM/YY
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.substring(0, 4);
    if (value.length > 2) {
      value = `${value.substring(0, 2)}/${value.substring(2)}`;
    }
    setExpiry(value);
  };

  const handleCvcChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 3) value = value.substring(0, 3);
    setCvc(value);
  };

  const MOCK_SECRET = 'cvio_mock_2024_secret'; // Must match server env MOCK_CHECKOUT_SECRET

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId || !cardName || !cardNumber || !expiry || !cvc) return;
    
    setLoading(true);
    // Simulate 2s payment processing delay for realism
    setTimeout(() => {
      router.push(`/api/stripe/mock-success?userId=${userId}&planType=${planType}&token=${MOCK_SECRET}`);
    }, 2000);
  };

  if (!userId) {
    return (
      <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] flex items-center justify-center font-sans">
        <p className="text-[#76777d]">Geçersiz ödeme bağlantısı.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] flex flex-col font-sans selection:bg-[#0051d5] selection:text-white">
      <header className="border-b border-[#c6c6cd] bg-white px-6 h-16 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#0051d5] flex items-center justify-center shadow-sm">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-bold text-[#0b1c30] tracking-tight">CV<span className="text-[#0051d5]">io</span></span>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-[#45464d] bg-slate-50 px-3 py-1.5 rounded-full border border-[#c6c6cd]">
          <Lock className="w-3.5 h-3.5 text-[#0051d5]" /> 256-bit Güvenli Ödeme
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-16 items-center">
          
          {/* Order Summary */}
          <div className="order-2 md:order-1 flex flex-col justify-center">
            <Link href="/upgrade" className="inline-flex items-center gap-2 text-sm font-semibold text-[#45464d] hover:text-[#0051d5] transition-colors mb-8 w-fit">
              <ArrowLeft className="w-4 h-4" /> Geri Dön
            </Link>
            
            <h1 className="text-3xl lg:text-4xl font-extrabold text-[#0b1c30] tracking-tight mb-2">Siparişi Tamamla</h1>
            <p className="text-[#5c5d64] text-sm mb-8">CVio Pro ile sınırsız yapay zeka gücüne erişin.</p>

            <div className="p-6 rounded-2xl bg-white border border-[#c6c6cd] space-y-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-[#0b1c30] text-lg">CVio Pro</h3>
                  <p className="text-[#5c5d64] text-sm mt-0.5">Aylık Plan</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-[#0b1c30]">{price}</div>
                  <div className="text-[#76777d] text-xs font-semibold">{period}</div>
                </div>
              </div>

              <hr className="border-slate-100" />

              <ul className="space-y-3">
                {[
                  'Sınırsız Yapay Zeka Özgeçmiş Üretimi',
                  'Sınırsız Kapak Yazısı (Motivation Letter)',
                  'Premium Özgeçmiş Şablonları',
                  'Gelişmiş İş Eşleştirme ve Analitik'
                ].map((feature, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-[#45464d] font-medium">
                    <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="mt-8 text-xs text-[#76777d] text-justify leading-relaxed">
              <p>Bu ekran bir <strong className="text-[#0b1c30]">Mock (Test)</strong> ödeme ekranıdır. Gerçek bir kart numarası girmenize gerek yoktur. Test için herhangi bir değer girebilirsiniz.</p>
            </div>
          </div>

          {/* Payment Form */}
          <div className="order-1 md:order-2">
            <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#c6c6cd] shadow-md relative overflow-hidden">
              <div className="absolute -top-32 -right-32 w-64 h-64 bg-[#0051d5]/5 blur-3xl rounded-full pointer-events-none"></div>
              
              <h2 className="text-xl font-bold text-[#0b1c30] mb-6 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-[#0051d5]" />
                Ödeme Bilgileri
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-[#5c5d64] text-xs font-semibold">Kart Üzerindeki İsim</Label>
                  <Input
                    id="name"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value)}
                    required
                    placeholder="Ad Soyad"
                    className="w-full bg-white border-[#c6c6cd] text-[#0b1c30] placeholder-[#76777d]/50 focus-visible:ring-[#0051d5] h-11"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="card" className="text-[#5c5d64] text-xs font-semibold">Kart Numarası</Label>
                  <Input
                    id="card"
                    value={cardNumber}
                    onChange={handleCardNumberChange}
                    required
                    placeholder="0000 0000 0000 0000"
                    className="w-full bg-white border-[#c6c6cd] text-[#0b1c30] placeholder-[#76777d]/50 focus-visible:ring-[#0051d5] h-11 font-mono tracking-wider"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="expiry" className="text-[#5c5d64] text-xs font-semibold">Son Kullanma (AA/YY)</Label>
                    <Input
                      id="expiry"
                      value={expiry}
                      onChange={handleExpiryChange}
                      required
                      placeholder="MM/YY"
                      className="w-full bg-white border-[#c6c6cd] text-[#0b1c30] placeholder-[#76777d]/50 focus-visible:ring-[#0051d5] h-11 font-mono"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="cvc" className="text-[#5c5d64] text-xs font-semibold">CVC Kodu</Label>
                    <Input
                      id="cvc"
                      value={cvc}
                      onChange={handleCvcChange}
                      required
                      placeholder="123"
                      className="w-full bg-white border-[#c6c6cd] text-[#0b1c30] placeholder-[#76777d]/50 focus-visible:ring-[#0051d5] h-11 font-mono"
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all hover:scale-[1.02] bg-[#0051d5] hover:bg-[#316bf3] shadow-md shadow-[#0051d5]/20 cursor-pointer"
                  >
                    {loading ? (
                      <><Loader2 className="w-5 h-5 animate-spin" /> İşleniyor...</>
                    ) : (
                      <>{price} Öde ve Başla</>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

export default function MockCheckoutPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#0051d5]" />
      </div>
    }>
      <MockCheckoutContent />
    </Suspense>
  );
}
