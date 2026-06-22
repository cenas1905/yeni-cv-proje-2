'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { createClientComponentClient } from '@/lib/supabase-client';
import { motion } from 'framer-motion';
import { ArrowRight, Mail, Lock, User, AlertCircle, CheckCircle, Eye, EyeOff, Sparkles } from 'lucide-react';

export default function RegisterPage() {
  const supabase = createClientComponentClient();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const validateEmail = (val: string) => {
    setEmail(val);
    if (!val) { setEmailError(null); return; }
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(val)) {
      setEmailError('Geçersiz e-posta formatı');
    } else {
      setEmailError(null);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const isMock = !process.env.NEXT_PUBLIC_SUPABASE_URL;

    if (isMock) {
      // In mock mode, set the logged-in cookie and auto-redirect
      document.cookie = 'cvio_mock_logged_in=true; path=/; max-age=31536000';
      setMessage('Kayıt başarılı (Demo Modu)! Yönlendiriliyorsunuz...');
      setLoading(false);
      
      // Seed the profile in our mock DB via API call
      try {
        await fetch('/api/mock/db', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            table: 'profiles',
            operation: 'update',
            data: { full_name: fullName, email },
            filters: { id: 'mock-user-id-12345' },
            isSingle: true
          })
        });
      } catch (err) {
        console.error('Failed to seed mock profile:', err);
      }

      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1500);
      return;
    }

    if (!supabase) {
      setMessage('Demo modu aktif! Gerçek kayıt için Supabase yapılandırması gereklidir.');
      setLoading(false);
      return;
    }

    const { data, error: err } = await supabase.auth.signUp({
      email, password,
      options: {
        data: { full_name: fullName },
        emailRedirectTo: `${window.location.origin}/api/auth/callback`,
      },
    });

    if (err) {
      setError(err.message);
      setLoading(false);
    } else {
      // Send welcome email
      try {
        await fetch('/api/email/welcome', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, fullName }),
        });
      } catch { }

      // If Supabase returned a session immediately, email confirmation is disabled → auto-login
      if (data?.session) {
        setMessage('Kayıt başarılı! Dashboard\'a yönlendiriliyorsunuz...');
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 1000);
      } else {
        // Email confirmation is enabled — ask user to check inbox
        setMessage('Kayıt başarılı! 📧 E-posta adresinize bir doğrulama linki gönderdik. Lütfen e-postanızı kontrol edin ve linke tıklayın.');
        setLoading(false);
      }
    }
  };


  const pwStrength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : 3;
  const pwColor = ['', '#ba1a1a', '#f59e0b', '#10b981'][pwStrength];
  const pwLabel = ['', 'Zayıf', 'Orta', 'Güçlü'][pwStrength];

  return (
    <div className="min-h-screen bg-[#f8f9ff] flex" style={{ fontFamily: 'Inter, sans-serif' }}>

      {/* ── Left panel ── */}
      <div className="hidden lg:flex w-1/2 flex-col relative overflow-hidden">
        {/* Full Cover Image Background */}
        <div className="absolute inset-0 z-0">
          <img src="/hero_office.png" alt="CVio Office" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
        </div>

        <div className="relative z-10 flex flex-col h-full p-12 text-white">
          <Link href="/" className="flex items-center gap-2.5 mb-auto">
            <div className="w-8 h-8 rounded-lg bg-[#0051d5] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-xl text-white">CV<span className="text-blue-300">io</span></span>
          </Link>

          <div className="mb-auto space-y-6 max-w-md">
            <h2 className="text-4xl font-bold leading-tight text-white drop-shadow-md">
              Kariyer yolculuğunuz<br />
              <span className="text-blue-300">bugün başlıyor</span>
            </h2>

            <div className="space-y-3 bg-black/20 p-6 rounded-2xl backdrop-blur-md border border-white/10">
              {[
                { icon: '✅', text: 'Ücretsiz — kredi kartı gerekmez' },
                { icon: '⚡', text: 'Dakikalar içinde profesyonel CV hazırlama' },
                { icon: '🎯', text: 'ATS geçiş garantili AI içerik optimizasyonu' },
                { icon: '🔗', text: 'Paylaşılabilir dijital kariyer linki' },
              ].map(item => (
                <div key={item.text} className="flex items-center gap-3 text-white/90 text-sm font-medium">
                  <span className="text-lg">{item.icon}</span>
                  {item.text}
                </div>
              ))}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 pt-4">
              {[
                { v: '2.400+', l: 'Kullanıcı' },
                { v: '%94', l: 'Mülakat başarısı' },
                { v: '60sn', l: 'Oluşturma süresi' },
                { v: '4.9★', l: 'Puan' },
              ].map(s => (
                <div key={s.l} className="p-3 rounded-xl bg-black/30 backdrop-blur-md border border-white/10 shadow-sm">
                  <div className="text-xl font-bold text-blue-300">{s.v}</div>
                  <div className="text-xs text-white/70 mt-0.5 font-medium">{s.l}</div>
                </div>
              ))}
            </div>
          </div>

          <p className="text-xs text-white/60 drop-shadow-sm">© {new Date().getFullYear()} CVio</p>
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div className="flex-1 flex items-center justify-center p-6 overflow-y-auto bg-white">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md space-y-7 py-8">

          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-2.5 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-[#0051d5] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-xl text-[#0b1c30]">CV<span className="text-[#0051d5]">io</span></span>
          </Link>

          <div>
            <h1 className="text-3xl font-bold text-[#0b1c30] mb-2">Hesap Oluşturun</h1>
            <p className="text-[#45464d] text-sm">Dakikalar içinde profesyonel CV'nizi hazırlayın.</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2.5 p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">
                <AlertCircle className="w-4 h-4 shrink-0" /> {error}
              </div>
            )}
            {message && (
              <div className="flex items-start gap-2.5 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-sm text-emerald-700">
                <CheckCircle className="w-4 h-4 shrink-0 mt-0.5" /> {message}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#0b1c30]">Ad Soyad</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#76777d]" />
                <input type="text" required value={fullName} onChange={e => setFullName(e.target.value)}
                  placeholder="Ahmet Yılmaz"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#c6c6cd] bg-white text-[#0b1c30] placeholder-[#76777d]/60 text-sm outline-none focus:border-[#0051d5] focus:ring-2 focus:ring-[#0051d5]/20 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#0b1c30]">E-posta</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#76777d]" />
                <input type="email" required value={email} onChange={e => validateEmail(e.target.value)}
                  placeholder="isim@ornek.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#c6c6cd] bg-white text-[#0b1c30] placeholder-[#76777d]/60 text-sm outline-none focus:border-[#0051d5] focus:ring-2 focus:ring-[#0051d5]/20 transition-all"
                />
              </div>
              {emailError && (
                <p className="text-xs text-red-500 mt-1 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" /> {emailError}
                </p>
              )}
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#0b1c30]">Şifre</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#76777d]" />
                <input type={showPw ? 'text' : 'password'} required minLength={6} value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="En az 6 karakter"
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-[#c6c6cd] bg-white text-[#0b1c30] placeholder-[#76777d]/60 text-sm outline-none focus:border-[#0051d5] focus:ring-2 focus:ring-[#0051d5]/20 transition-all"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#76777d] hover:text-[#45464d]">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              {password && (
                <div className="space-y-1.5">
                  <div className="flex gap-1">
                    {[1, 2, 3].map(l => (
                      <div key={l} className="flex-1 h-1 rounded-full transition-all" style={{ background: pwStrength >= l ? pwColor : '#c6c6cd' }} />
                    ))}
                  </div>
                  <p className="text-[11px] font-semibold" style={{ color: pwColor }}>{pwLabel} şifre</p>
                </div>
              )}
            </div>

            <button type="submit" disabled={loading || !!emailError}
              className="w-full py-3.5 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-60 bg-[#0051d5] shadow-md shadow-[#0051d5]/20">
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Ücretsiz Hesap Oluştur <ArrowRight className="w-4 h-4" /></>
              )}
            </button>

            <p className="text-[11px] text-[#76777d] text-center">
              Kaydolarak <a href="#" className="text-[#45464d] underline">Gizlilik Politikası</a>'nı kabul etmiş olursunuz.
            </p>
          </form>

          <p className="text-center text-sm text-[#76777d]">
            Zaten hesabınız var mı?{' '}
            <Link href="/login" className="text-[#0051d5] hover:text-[#316bf3] font-semibold transition-colors">
              Giriş Yapın
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
