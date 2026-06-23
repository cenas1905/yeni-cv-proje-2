'use client';

import React, { useState } from 'react';
import { createClientComponentClient } from '@/lib/supabase-client';
import { Building2, Briefcase, MapPin, CheckCircle2, ChevronRight, Plus } from 'lucide-react';
import Link from 'next/link';

export default function PostJobPage() {
  const supabase = createClientComponentClient();
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    company_name: '',
    job_title: '',
    location: '',
    work_type: 'Ofis',
    salary_range: '',
    description: '',
    requirements: ''
  });

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const { data: { user } } = await supabase.auth.getUser();
    
    // Requirements'ı virgülle ayırıp array yapalım
    const reqArray = formData.requirements.split(',').map(r => r.trim()).filter(Boolean);

    if (user) {
      const { error } = await supabase.from('employer_jobs').insert({
        employer_user_id: user.id,
        company_name: formData.company_name,
        job_title: formData.job_title,
        location: formData.location,
        work_type: formData.work_type,
        salary_range: formData.salary_range,
        description: formData.description,
        requirements: reqArray,
        is_active: true
      });

      if (!error) {
        setSuccess(true);
      } else {
        alert('İlan verilirken bir hata oluştu: ' + error.message);
      }
    } else {
      alert('İlan vermek için giriş yapmalısınız.');
    }
    setLoading(false);
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#f8f9ff] flex items-center justify-center p-6" style={{ fontFamily: 'Inter, sans-serif' }}>
        <div className="bg-white max-w-md w-full p-8 rounded-3xl border border-[#c6c6cd] text-center shadow-lg animate-in zoom-in-95 duration-500">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-black text-[#0b1c30] mb-2">İlanınız Yayınlandı!</h2>
          <p className="text-[#45464d] mb-8">
            Yapay zeka asistanımız ilanınızı inceledi ve aday havuzundaki en uygun CV'lerle eşleştirmeye başladı bile.
          </p>
          <Link href="/dashboard" className="bg-[#0051d5] text-white px-6 py-3 rounded-xl font-bold w-full flex items-center justify-center gap-2 hover:bg-[#0051d5]/90 transition">
            Aday Paneline Git <ChevronRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f9ff] py-12 px-6" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="max-w-3xl mx-auto">
        <Link href="/" className="text-[#0051d5] font-bold text-lg mb-8 inline-block">
          &larr; Ana Sayfaya Dön
        </Link>
        
        <div className="bg-white rounded-3xl border border-[#c6c6cd] shadow-sm overflow-hidden">
          <div className="bg-[#0b1c30] p-8 text-white">
            <h1 className="text-3xl font-black mb-2 flex items-center gap-3">
              <Building2 className="w-8 h-8 text-[#0051d5]" />
              Yeni İş İlanı Oluştur
            </h1>
            <p className="text-gray-400">CVio AI altyapısıyla aradığınız yeteneği saniyeler içinde bulun.</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-[#0b1c30] mb-2">Şirket Adı</label>
                <input required name="company_name" value={formData.company_name} onChange={handleChange} placeholder="Örn: TechFlow A.Ş." className="w-full border border-[#c6c6cd] rounded-xl px-4 py-3 outline-none focus:border-[#0051d5] focus:ring-1 focus:ring-[#0051d5] transition-all" />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#0b1c30] mb-2">İlan Başlığı (Pozisyon)</label>
                <input required name="job_title" value={formData.job_title} onChange={handleChange} placeholder="Örn: Senior Frontend Developer" className="w-full border border-[#c6c6cd] rounded-xl px-4 py-3 outline-none focus:border-[#0051d5] focus:ring-1 focus:ring-[#0051d5] transition-all" />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-bold text-[#0b1c30] mb-2">Şehir / Konum</label>
                <input required name="location" value={formData.location} onChange={handleChange} placeholder="Örn: İstanbul" className="w-full border border-[#c6c6cd] rounded-xl px-4 py-3 outline-none focus:border-[#0051d5] transition-all" />
              </div>
              <div>
                <label className="block text-sm font-bold text-[#0b1c30] mb-2">Çalışma Şekli</label>
                <select name="work_type" value={formData.work_type} onChange={handleChange} className="w-full border border-[#c6c6cd] rounded-xl px-4 py-3 outline-none focus:border-[#0051d5] transition-all bg-white">
                  <option value="Ofis">Ofis</option>
                  <option value="Hibrit">Hibrit</option>
                  <option value="Uzaktan">Uzaktan (Remote)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-[#0b1c30] mb-2">Maaş Aralığı (Opsiyonel)</label>
                <input name="salary_range" value={formData.salary_range} onChange={handleChange} placeholder="Örn: 50.000 TL - 80.000 TL" className="w-full border border-[#c6c6cd] rounded-xl px-4 py-3 outline-none focus:border-[#0051d5] transition-all" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-[#0b1c30] mb-2">İş Tanımı</label>
              <textarea required name="description" value={formData.description} onChange={handleChange} placeholder="Bu pozisyondaki kişinin görevleri nelerdir?" rows={4} className="w-full border border-[#c6c6cd] rounded-xl px-4 py-3 outline-none focus:border-[#0051d5] transition-all resize-y" />
            </div>

            <div>
              <label className="block text-sm font-bold text-[#0b1c30] mb-2">Aranan Nitelikler (Virgülle ayırın)</label>
              <input required name="requirements" value={formData.requirements} onChange={handleChange} placeholder="Örn: React, Node.js, 3 Yıl Tecrübe, İngilizce" className="w-full border border-[#c6c6cd] rounded-xl px-4 py-3 outline-none focus:border-[#0051d5] transition-all" />
              <p className="text-xs text-gray-500 mt-2">Yapay zeka bu kelimeleri adayların CV'leriyle eşleştirecektir.</p>
            </div>

            <div className="pt-4 border-t border-[#e5e7eb]">
              <button disabled={loading} type="submit" className="w-full bg-[#0051d5] text-white py-4 rounded-xl font-bold text-lg hover:bg-[#0051d5]/90 transition-colors flex items-center justify-center gap-2 disabled:opacity-50">
                {loading ? 'Yayınlanıyor...' : (
                  <>
                    <Plus className="w-5 h-5" /> İlanı Yayınla
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
