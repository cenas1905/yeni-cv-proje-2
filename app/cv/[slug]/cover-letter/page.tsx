import React from 'react';
import { redirect } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabase';
import Link from 'next/link';
import { AlertTriangle, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface PublicCoverLetterPageProps {
  params: Promise<{ slug: string }>;
}

export default async function PublicCoverLetterPage({ params }: PublicCoverLetterPageProps) {
  const { slug } = await params;

  // 1. Fetch CV details matching the slug
  const { data: cv } = await supabaseAdmin
    .from('cvs')
    .select('*, profiles(full_name, plan)')
    .eq('slug', slug)
    .eq('is_public', true)
    .single();

  if (!cv) {
    redirect('/404');
  }

  // 2. Check if the link has expired (Free Plan limit)
  const isExpired = cv.link_expires_at && new Date(cv.link_expires_at) < new Date();
  if (isExpired) {
    redirect(`/upgrade?expired=true&slug=${slug}`);
  }

  const cvData = cv.data || {};
  const personal = cvData.personal || {};
  const coverLetterText = cvData.coverLetter;

  if (!coverLetterText) {
    redirect('/404');
  }

  const companyName = cvData.coverLetterCompany || 'Şirket Yetkilisi';
  const jobTitle = cvData.coverLetterJob || 'Açık Pozisyon';
  const isPro = cv.profiles?.plan === 'pro' || cv.profiles?.plan === 'annual';

  // 3. Log visitor views count using admin client (optional analytics)
  try {
    await supabaseAdmin.from('cv_views').insert({
      cv_id: cv.id,
      viewer_ip: 'anonymous_letter',
      viewer_country: 'TR'
    });

    await supabaseAdmin
      .from('cvs')
      .update({ view_count: (cv.view_count || 0) + 1 })
      .eq('id', cv.id);
  } catch (err) {
    console.error('Failed to log cover letter view:', err);
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 flex flex-col justify-between">
      
      {/* 7-day expiration warning info banner for free links */}
      {!isPro && cv.link_expires_at && (
        <div className="max-w-[21cm] mx-auto w-full mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-800 text-xs flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-left">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              Bu ön yazı bağlantısı <strong>7 günlük ücretsiz paylaşım</strong> modundadır. 
              Süresi dolduğunda ({new Date(cv.link_expires_at).toLocaleDateString('tr-TR')}) otomatik olarak kapanacaktır.
            </span>
          </div>
          <Link href="/upgrade" className="shrink-0">
            <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-[10px] h-8 px-3 rounded-lg gap-1">
              <Sparkles className="w-3 h-3 fill-slate-950" /> Kalıcı Yap
            </Button>
          </Link>
        </div>
      )}

      <div className="flex-1">
        {/* Printable Cover Letter sheet */}
        <div className="max-w-[21cm] min-h-[29.7cm] mx-auto p-12 bg-white shadow-xl border border-slate-200 font-serif leading-relaxed text-sm text-slate-800 flex flex-col justify-between">
          
          <div className="space-y-8">
            {/* Header info */}
            <div className="flex justify-between items-start border-b border-slate-200 pb-6">
              <div>
                <h1 className="text-xl font-bold text-slate-950">{personal.fullName || 'Aday İsmi'}</h1>
                {personal.headline && <p className="text-xs text-slate-500 italic mt-0.5">{personal.headline}</p>}
                <p className="text-xs text-slate-400 mt-2">
                  {personal.email && `✉ ${personal.email}`}
                  {personal.location && `  |  📍 ${personal.location}`}
                  {personal.linkedin && `  |  🔗 ${personal.linkedin}`}
                </p>
              </div>
              <div className="text-right text-xs text-slate-400">
                <p>{new Date().toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              </div>
            </div>

            {/* Recipient info */}
            <div className="text-left space-y-1">
              <p className="font-bold text-slate-950">{companyName}</p>
              <p className="text-xs text-slate-500 font-medium">İşe Alım Ekibi / Yetkili</p>
              <p className="text-xs text-slate-400">Konu: {jobTitle} Pozisyonu Başvurusu Ön Yazısı</p>
            </div>

            {/* Body */}
            <div className="text-justify text-slate-700 whitespace-pre-line leading-relaxed text-xs">
              {coverLetterText}
            </div>
          </div>

          {/* Signature */}
          <div className="mt-12 pt-8 border-t border-slate-100 text-left space-y-4">
            <p className="text-xs text-slate-500">Saygılarımla,</p>
            <div>
              <p className="font-bold text-slate-950">{personal.fullName || 'Aday İsmi'}</p>
              {personal.headline && <p className="text-[10px] text-slate-500">{personal.headline}</p>}
            </div>
          </div>

        </div>
      </div>

      {/* Footer */}
      <footer className="text-center mt-12 pb-4 text-xs text-slate-400">
        <p>
          Bu ön yazı{' '}
          <a
            href="/"
            className="text-indigo-600 hover:text-indigo-500 font-bold underline underline-offset-4"
          >
            CVio.app
          </a>{' '}
          ile oluşturulmuştur. Siz de 60 saniyede AI ön yazınızı ve özgeçmişinizi hazırlayın.
        </p>
      </footer>
      
    </div>
  );
}
