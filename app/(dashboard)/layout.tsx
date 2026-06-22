import React from 'react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase-server';
import {
  LayoutDashboard, Settings, LogOut,
  FileText, Briefcase, Brain, Plus, Zap,
  User, GraduationCap, Sparkles, HelpCircle,
  Bell, Download, Search
} from 'lucide-react';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();

  let user: any = null;
  let profile: any = null;

  if (supabase) {
    const { data: { user: authUser }, error } = await supabase.auth.getUser();
    if (error || !authUser) redirect('/login');
    user = authUser;

    const { data: profileData } = await supabase
      .from('profiles')
      .select('plan, full_name')
      .eq('id', user.id)
      .single();
    profile = profileData;
  }

  const isPro = profile?.plan === 'pro' || profile?.plan === 'annual';
  const fullName = profile?.full_name || '';
  const initials = fullName
    ? fullName.split(' ').map((n: string) => n[0]).slice(0, 2).join('').toUpperCase()
    : user?.email?.[0]?.toUpperCase() || 'D';
  const displayName = fullName || user?.email?.split('@')[0] || 'Demo';

  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5" /> },
    { href: '/dashboard/cv/new', label: 'Yeni CV', icon: <Plus className="w-5 h-5" /> },
    { href: '/cover-letters', label: 'Motivasyon', icon: <FileText className="w-5 h-5" /> },
    { href: '/dashboard/jobs', label: 'İş Fırsatlarım', icon: <Briefcase className="w-5 h-5" /> },
    { href: '/settings', label: 'Ayarlar', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] flex flex-col" style={{ fontFamily: 'Inter, sans-serif' }}>
      
      {/* ─── TOP NAVBAR ─── */}
      <header className="bg-white border-b border-[#c6c6cd] shadow-sm w-full h-16 shrink-0 z-50 sticky top-0">
        <div className="flex justify-between items-center px-6 w-full max-w-[1280px] mx-auto h-full">
          <div className="flex items-center gap-10 h-full">
            {/* Logo */}
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#0051d5] flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-[#0b1c30] tracking-tight">CV<span className="text-[#0051d5]">io</span></span>
            </Link>
            
            {/* Desktop Nav */}
            <nav className="hidden md:flex gap-6 h-full items-center">
              <Link href="/dashboard" className="text-[#0051d5] font-bold text-sm border-b-2 border-[#0051d5] h-full flex items-center pb-0.5">
                Dashboard
              </Link>
              <Link href="/dashboard/cv/new" className="text-[#45464d] font-medium text-sm hover:text-[#0051d5] transition-colors h-full flex items-center">
                CV Oluştur
              </Link>
              <Link href="/dashboard/jobs" className="text-[#45464d] font-medium text-sm hover:text-[#0051d5] transition-colors h-full flex items-center">
                İş Fırsatlarım
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            {!isPro && (
              <Link href="/upgrade" className="hidden md:flex bg-[#7073ff] text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-[#7073ff]/90 transition-colors items-center gap-1.5">
                <Zap className="w-4 h-4" />
                Pro'ya Geç
              </Link>
            )}
            {isPro && (
              <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#7073ff]/10 text-[#7073ff] text-xs font-bold">
                <Zap className="w-3.5 h-3.5" />
                Pro Üye
              </div>
            )}
            <button className="text-[#45464d] hover:text-[#0051d5] transition-colors p-2 rounded-full hover:bg-[#e5eeff]">
              <Bell className="w-5 h-5" />
            </button>
            <button className="text-[#45464d] hover:text-[#0051d5] transition-colors p-2 rounded-full hover:bg-[#e5eeff]">
              <Settings className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 rounded-full bg-[#d3e4fe] border border-[#c6c6cd] flex items-center justify-center text-xs font-bold text-[#0b1c30] ml-1">
              {initials}
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* ─── SIDEBAR ─── */}
        <aside className="hidden lg:flex flex-col w-64 bg-[#eff4ff] border-r border-[#c6c6cd] py-4 shrink-0 sticky top-16 h-[calc(100vh-4rem)]">
          {/* Current CV Preview */}
          <div className="px-4 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-14 bg-white border border-[#c6c6cd] rounded-sm flex items-center justify-center shadow-sm">
                <FileText className="w-5 h-5 text-[#76777d]" />
              </div>
              <div>
                <div className="text-sm font-bold text-[#0b1c30]">Aktif CV</div>
                <div className="text-xs text-[#0051d5] font-semibold">ATS Skoru: 85%</div>
              </div>
            </div>
            <button className="w-full bg-white border border-[#c6c6cd] text-[#0b1c30] text-sm font-medium py-2 rounded-lg hover:bg-[#d3e4fe] transition-colors flex items-center justify-center gap-2">
              <Download className="w-4 h-4" />
              PDF İndir
            </button>
          </div>

          {/* Nav Links */}
          <nav className="flex-1 flex flex-col gap-0.5">
            {navItems.map((item, i) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 p-3 mx-2 rounded-xl text-sm font-medium transition-all duration-150 ${
                  i === 0
                    ? 'bg-[#316bf3] text-white shadow-sm'
                    : 'text-[#45464d] hover:bg-[#d3e4fe] hover:translate-x-1'
                }`}
              >
                {item.icon}
                {item.label}
              </Link>
            ))}
            
            {/* AI Optimizer - special link */}
            <Link
              href="/dashboard/cv/new"
              className="flex items-center gap-3 p-3 mx-2 rounded-xl text-sm font-medium text-[#7073ff] bg-[#e1e0ff]/40 hover:bg-[#e1e0ff] hover:translate-x-1 transition-all duration-150 mt-1"
            >
              <Sparkles className="w-5 h-5" />
              AI Optimizer
            </Link>
          </nav>

          {/* Bottom Links */}
          <div className="mt-auto border-t border-[#c6c6cd] pt-3 mx-4 flex flex-col gap-0.5">
            <Link href="#" className="flex items-center gap-3 px-2 py-2 text-[#45464d] text-sm hover:text-[#0051d5] transition-colors rounded-xl hover:bg-[#d3e4fe]">
              <HelpCircle className="w-5 h-5" />
              Yardım
            </Link>
            <form action="/api/auth/logout" method="POST">
              <button type="submit" className="flex items-center gap-3 px-2 py-2 text-[#45464d] text-sm hover:text-red-500 transition-colors rounded-xl hover:bg-red-50 w-full text-left">
                <LogOut className="w-5 h-5" />
                Çıkış Yap
              </button>
            </form>
          </div>
        </aside>

        {/* ─── MOBILE BOTTOM NAV ─── */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-xl border-t border-[#c6c6cd] z-50 flex">
          {navItems.slice(0, 4).map((item, i) => (
            <Link key={item.href} href={item.href} className={`flex-1 flex flex-col items-center justify-center py-2.5 text-xs font-medium transition-colors ${i === 0 ? 'text-[#0051d5]' : 'text-[#76777d] hover:text-[#0051d5]'}`}>
              {item.icon}
              <span className="text-[10px] mt-1">{item.label.split(' ')[0]}</span>
            </Link>
          ))}
        </div>

        {/* ─── MAIN CONTENT ─── */}
        <main className="flex-1 overflow-y-auto bg-[#f8f9ff] pb-20 lg:pb-0">
          <div className="max-w-[1280px] mx-auto w-full p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
