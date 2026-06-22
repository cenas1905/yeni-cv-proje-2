'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { createClientComponentClient } from '@/lib/supabase-client';
import { motion } from 'framer-motion';
import { ArrowRight, Mail, Lock, AlertCircle, Eye, EyeOff, Sparkles, Link2 } from 'lucide-react';

export default function LoginPage() {
  const supabase = createClientComponentClient();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    if (!supabase) return;
    async function checkSession() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) window.location.href = '/dashboard';
    }
    checkSession();
  }, [supabase]);

  React.useEffect(() => {
    const savedEmail = localStorage.getItem('remembered_email');
    if (savedEmail) setEmail(savedEmail);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    if (!supabase) {
      window.location.href = '/dashboard';
      return;
    }
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) {
      setError('E-posta veya şifre hatalı. Lütfen tekrar deneyin.');
      setLoading(false);
    } else {
      localStorage.setItem('remembered_email', email);
      window.location.href = '/dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] flex" style={{ fontFamily: 'Inter, sans-serif' }}>

      {/* ── Left panel — branding ── */}
      <div className="hidden lg:flex w-1/2 flex-col relative overflow-hidden bg-gradient-to-br from-[#eff4ff] to-[#dce9ff] border-r border-[#c6c6cd]/30">
        {/* Decorative dots */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #0051d5 1px, transparent 0)', backgroundSize: '24px 24px' }} />
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-[#0051d5]/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col h-full p-12">
          <Link href="/" className="flex items-center gap-2.5 mb-auto">
            <div className="w-8 h-8 rounded-lg bg-[#0051d5] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-xl text-[#0b1c30]">CV<span className="text-[#0051d5]">io</span></span>
          </Link>

          <div className="mb-auto space-y-6 max-w-md">
            <h2 className="text-4xl font-bold leading-tight text-[#0b1c30]">
              Kariyer hedeflerinize<br />
              <span className="text-[#0051d5]">daha hızlı ulaşın</span>
            </h2>
            <div className="space-y-4">
              {[
                { icon: '⚡', text: '60 saniyede profesyonel CV oluşturun' },
                { icon: '🤖', text: 'Claude AI ile hedeflerinize göre optimize edin' },
                { icon: '🔗', text: 'Kalıcı paylaşım linki ile takip edin' },
              ].map(item => (
                <div key={item.text} className="flex items-center gap-3 text-[#45464d] text-sm">
                  <span className="text-lg">{item.icon}</span>
                  {item.text}
                </div>
              ))}
            </div>

            {/* Sizin bahsettiğiniz görsel buraya eklendi */}
            <div className="mt-8 relative rounded-2xl overflow-hidden shadow-2xl border border-[#c6c6cd]/40">
              <img 
                src="/hero_office.png" 
                alt="CVio Platform" 
                className="w-full h-auto object-cover hover:scale-105 transition-transform duration-700"
              />
            </div>
          </div>

          <p className="text-xs text-[#76777d]">© {new Date().getFullYear()} CVio</p>
        </div>
      </div>

      {/* ── Right panel — form ── */}
      <div className="flex-1 flex items-center justify-center p-6 bg-white">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-md space-y-8">

          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-2.5 lg:hidden">
            <div className="w-8 h-8 rounded-lg bg-[#0051d5] flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-xl text-[#0b1c30]">CV<span className="text-[#0051d5]">io</span></span>
          </Link>

          <div>
            <h1 className="text-3xl font-bold text-[#0b1c30] mb-2">Tekrar hoş geldiniz</h1>
            <p className="text-[#45464d] text-sm">Hesabınıza giriş yaparak devam edin.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="flex items-center gap-2.5 p-4 rounded-xl bg-red-50 border border-red-200 text-sm text-red-600">
                <AlertCircle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#0b1c30]">E-posta</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#76777d]" />
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)}
                  placeholder="isim@ornek.com"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-[#c6c6cd] bg-white text-[#0b1c30] placeholder-[#76777d]/60 text-sm outline-none focus:border-[#0051d5] focus:ring-2 focus:ring-[#0051d5]/20 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#0b1c30]">Şifre</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#76777d]" />
                <input type={showPw ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-[#c6c6cd] bg-white text-[#0b1c30] placeholder-[#76777d]/60 text-sm outline-none focus:border-[#0051d5] focus:ring-2 focus:ring-[#0051d5]/20 transition-all"
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#76777d] hover:text-[#45464d]">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-sm text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-60 bg-[#0051d5] shadow-md shadow-[#0051d5]/20">
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Giriş Yap <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-[#76777d]">
            Hesabınız yok mu?{' '}
            <Link href="/register" className="text-[#0051d5] hover:text-[#316bf3] font-semibold transition-colors">
              Ücretsiz Kayıt Olun
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
