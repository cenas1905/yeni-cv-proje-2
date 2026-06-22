'use client';

import React, { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@/lib/supabase-client';
import Link from 'next/link';
import CVForm from '@/components/cv-builder/CVForm';
import CVPreview from '@/components/cv-builder/CVPreview';
import TemplateSelector, { CVTemplate } from '@/components/cv-builder/TemplateSelector';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Save, Eye, ChevronRight, Wand2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface EditCVPageProps {
  params: Promise<{ slug: string }>;
}

export default function EditCVPage({ params }: EditCVPageProps) {
  const router = useRouter();
  const { slug } = use(params);
  const supabase = createClientComponentClient();

  const [title, setTitle] = useState('Yükleniyor...');
  const [template, setTemplate] = useState<CVTemplate>('modern');
  const [cvData, setCvData] = useState<any>({
    personal: { fullName: '', headline: '', location: '', email: '', linkedin: '', summary: '' },
    experience: [],
    education: [],
    skills: [],
    certifications: []
  });

  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [optimizing, setOptimizing] = useState(false);

  // AI Modal State
  const [optimizeModalOpen, setOptimizeModalOpen] = useState(false);
  const [targetCompany, setTargetCompany] = useState('');

  // 1. Fetch CV details on load
  useEffect(() => {
    async function loadData() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Profile details (to check if user is Pro)
      const { data: profData } = await supabase
        .from('profiles')
        .select('plan')
        .eq('id', user.id)
        .single();
      setProfile(profData);

      // CV details
      const { data, error } = await supabase
        .from('cvs')
        .select('*')
        .eq('id', slug)
        .eq('user_id', user.id)
        .single();

      if (error || !data) {
        alert('Özgeçmiş yüklenemedi ya da bu özgeçmişe erişim yetkiniz yok.');
        router.push('/dashboard');
        return;
      }

      setTitle(data.title);
      setTemplate(data.template as CVTemplate);
      if (data.data) {
        setCvData(data.data);
      }
      setLoading(false);
    }
    loadData();
  }, [slug, supabase, router]);

  const isPro = profile?.plan === 'pro' || profile?.plan === 'annual';

  // 2. Save CV Data to Database and generate PDF
  const handleSave = async (silent = false) => {
    setSaving(true);
    try {
      const response = await fetch('/api/cv/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cvId: slug,
          title,
          data: cvData,
          template,
          is_public: false // keep edit mode draft status
        })
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || 'Kaydedilirken bir hata oluştu.');
      }
    } catch (err: any) {
      alert(err.message || 'Kaydedilirken bir hata oluştu.');
    } finally {
      setSaving(false);
    }
  };

  // 3. Trigger Claude AI Optimization
  const handleAIOptimize = async () => {
    setOptimizeModalOpen(false);
    setOptimizing(true);

    try {
      const response = await fetch('/api/ai/improve-cv', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          cvData,
          targetCompany: targetCompany.trim() || undefined
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'AI optimizasyonu başarısız oldu.');
      }

      const result = await response.json();
      setCvData(result.data);
      // Auto-save the optimized data
      setTimeout(() => handleSave(true), 500);
    } catch (err: any) {
      alert(err.message || 'Yapay zeka ile iyileştirilirken bir hata oluştu.');
    } finally {
      setOptimizing(false);
      setTargetCompany('');
    }
  };

  const saveAndProceed = async () => {
    await handleSave(true);
    router.push(`/dashboard/cv/${slug}/preview`);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-[#76777d]">
        <div className="w-8 h-8 border-4 border-[#0051d5] border-t-transparent rounded-full animate-spin mb-4" />
        <span className="font-medium">Özgeçmiş Yükleniyor...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* Top action header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-[#c6c6cd]/50 pb-4">
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <Link href="/dashboard">
            <Button variant="ghost" size="icon" className="text-[#45464d] hover:text-[#0051d5] hover:bg-[#eff4ff] border border-[#c6c6cd]">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="CV Başlığı"
            className="bg-transparent border-none text-xl font-bold text-[#0b1c30] focus-visible:ring-0 focus-visible:ring-offset-0 px-0 h-auto"
          />
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
          <Button
            onClick={() => setOptimizeModalOpen(true)}
            variant="outline"
            disabled={optimizing}
            className="border-[#7073ff]/30 text-[#7073ff] hover:bg-[#eff4ff] hover:text-[#7073ff] font-semibold gap-1.5 shadow-sm"
          >
            <Wand2 className="w-4 h-4" />
            Şirkete Göre Optimize Et
          </Button>

          <Button
            onClick={() => handleSave()}
            variant="outline"
            disabled={saving}
            className="border-[#c6c6cd] text-[#45464d] hover:text-[#0b1c30] hover:bg-[#f8f9ff] font-semibold gap-1.5 shadow-sm"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Kaydediliyor...' : 'Kaydet'}
          </Button>

          <Button
            onClick={saveAndProceed}
            className="bg-[#0051d5] hover:bg-[#316bf3] text-white font-semibold gap-1.5 shadow-md shadow-[#0051d5]/20"
          >
            Devam Et
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Grid editor panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left column editor */}
        <div className="lg:col-span-5 space-y-6">
          <TemplateSelector selected={template} onChange={setTemplate} isPro={isPro} />

          <CVForm
            cvData={cvData}
            setCvData={setCvData}
            onOptimize={handleAIOptimize}
            optimizing={optimizing}
          />
        </div>

        {/* Right column preview */}
        <div className="lg:col-span-7 bg-[#f8f9ff] p-4 sm:p-6 rounded-2xl border border-[#c6c6cd]/50 shadow-inner overflow-y-auto max-h-[85vh] sticky top-24">
          <p className="text-[10px] text-[#76777d] uppercase tracking-widest font-bold mb-4">Canlı Önizleme (A4 Düzeni)</p>
          <CVPreview data={cvData} template={template} />
        </div>
      </div>

      {/* Target Company optimization Dialog */}
      <Dialog open={optimizeModalOpen} onOpenChange={setOptimizeModalOpen}>
        <DialogContent className="border-[#c6c6cd] bg-white text-[#0b1c30] max-w-sm">
          <DialogHeader>
            <DialogTitle>Şirkete Özel Optimizasyon</DialogTitle>
            <DialogDescription className="text-[#45464d] text-xs mt-1">
              Başvurmak istediğiniz şirketin adını veya alanını yazın (örn: Teknoloji Firması, Finans Şirketi). Claude AI, CV'nizi bu şirketin kültürüne ve aradığı değerlere göre optimize edecektir.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label htmlFor="company-name" className="text-[#0b1c30] text-xs font-semibold">Şirket Adı (İsteğe Bağlı)</label>
              <Input
                id="company-name"
                value={targetCompany}
                onChange={(e) => setTargetCompany(e.target.value)}
                placeholder="Örn: Teknoloji Firması"
                className="bg-[#f8f9ff] border-[#c6c6cd] text-[#0b1c30] focus-visible:ring-[#0051d5] h-9 text-sm"
              />
            </div>
          </div>
          <DialogFooter className="flex gap-2 justify-end mt-2">
            <Button variant="ghost" size="sm" onClick={() => setOptimizeModalOpen(false)} className="text-[#45464d] hover:text-[#0b1c30] hover:bg-[#f8f9ff]">
              İptal
            </Button>
            <Button onClick={handleAIOptimize} className="bg-[#0051d5] hover:bg-[#316bf3] text-white font-medium shadow-sm">
              Optimize Et
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
