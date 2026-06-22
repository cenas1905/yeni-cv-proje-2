import React from 'react';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase-server';
import { supabaseAdmin } from '@/lib/supabase';
import CVPreview from '@/components/cv-builder/CVPreview';
import { CVTemplate } from '@/components/cv-builder/TemplateSelector';

interface PublicCVPageProps {
  params: Promise<{ slug: string }>;
}

export default async function PublicCVPage({ params }: PublicCVPageProps) {
  const { slug } = await params;
  const supabase = await createClient();

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
  if (cv.link_expires_at && new Date(cv.link_expires_at) < new Date()) {
    redirect(`/upgrade?expired=true&slug=${slug}`);
  }

  // 3. Log visitor and increment view count using admin client
  try {
    await supabaseAdmin.from('cv_views').insert({
      cv_id: cv.id,
      viewer_ip: 'anonymous', // Simple tracking placeholder
      viewer_country: 'TR'
    });

    await supabaseAdmin
      .from('cvs')
      .update({ view_count: (cv.view_count || 0) + 1 })
      .eq('id', cv.id);
  } catch (err) {
    console.error('Failed to log CV view:', err);
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 flex flex-col justify-between">
      <div className="flex-1">
        <CVPreview data={cv.data} template={cv.template as CVTemplate} />
      </div>

      {/* Brand Growth Hook Footer */}
      <footer className="text-center mt-12 pb-4 text-xs text-slate-400">
        <p>
          Bu özgeçmiş{' '}
          <a
            href="/"
            className="text-indigo-600 hover:text-indigo-500 font-bold underline underline-offset-4"
          >
            CVio.app
          </a>{' '}
          ile oluşturulmuştur. Siz de 60 saniyede AI CV'nizi hazırlayın.
        </p>
      </footer>
    </div>
  );
}
