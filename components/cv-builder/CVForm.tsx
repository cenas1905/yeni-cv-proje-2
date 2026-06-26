'use client';

import React from 'react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trash2, PlusCircle, Wand2 } from 'lucide-react';

interface CVFormProps {
  cvData: any;
  setCvData: React.Dispatch<React.SetStateAction<any>>;
  onOptimize: (targetCompany?: string) => Promise<void>;
  optimizing: boolean;
}

export default function CVForm({ cvData, setCvData, onOptimize, optimizing }: CVFormProps) {
  const {
    personal = { fullName: '', headline: '', location: '', email: '', linkedin: '', summary: '', photo: '' },
    experience = [],
    education = [],
    skills = [],
    certifications = []
  } = cvData;

  const handlePersonalChange = (field: string, value: string) => {
    setCvData((prev: any) => ({
      ...prev,
      personal: {
        ...prev.personal,
        [field]: value
      }
    }));
  };

  // Experience Handlers
  const handleExperienceChange = (index: number, field: string, value: any) => {
    setCvData((prev: any) => {
      const newExp = [...(prev.experience || [])];
      newExp[index] = { ...newExp[index], [field]: value };
      return { ...prev, experience: newExp };
    });
  };

  const addExperience = () => {
    setCvData((prev: any) => ({
      ...prev,
      experience: [
        ...(prev.experience || []),
        { title: '', company: '', startDate: '', endDate: '', current: false, description: '', location: '' }
      ]
    }));
  };

  const removeExperience = (index: number) => {
    setCvData((prev: any) => ({
      ...prev,
      experience: (prev.experience || []).filter((_: any, i: number) => i !== index)
    }));
  };

  // Education Handlers
  const handleEducationChange = (index: number, field: string, value: any) => {
    setCvData((prev: any) => {
      const newEdu = [...(prev.education || [])];
      newEdu[index] = { ...newEdu[index], [field]: value };
      return { ...prev, education: newEdu };
    });
  };

  const addEducation = () => {
    setCvData((prev: any) => ({
      ...prev,
      education: [
        ...(prev.education || []),
        { school: '', degree: '', field: '', startYear: '', endYear: '' }
      ]
    }));
  };

  const removeEducation = (index: number) => {
    setCvData((prev: any) => ({
      ...prev,
      education: (prev.education || []).filter((_: any, i: number) => i !== index)
    }));
  };

  // Certification Handlers
  const handleCertChange = (index: number, field: string, value: any) => {
    setCvData((prev: any) => {
      const newCerts = [...(prev.certifications || [])];
      newCerts[index] = { ...newCerts[index], [field]: value };
      return { ...prev, certifications: newCerts };
    });
  };

  const addCert = () => {
    setCvData((prev: any) => ({
      ...prev,
      certifications: [
        ...(prev.certifications || []),
        { name: '', issuer: '', date: '' }
      ]
    }));
  };

  const removeCert = (index: number) => {
    setCvData((prev: any) => ({
      ...prev,
      certifications: (prev.certifications || []).filter((_: any, i: number) => i !== index)
    }));
  };

  // Skills Handler
  const handleSkillsChange = (value: string) => {
    const skillList = value.split(',').map(s => s.trim()).filter(s => s.length > 0);
    setCvData((prev: any) => ({
      ...prev,
      skills: skillList
    }));
  };

  const inputClass = "h-12 bg-[#f4f5f8] border-[#e2e4eb] text-[#0b1c30] placeholder-[#76777d] focus-visible:bg-white focus-visible:ring-2 focus-visible:ring-[#0051d5] focus-visible:border-transparent transition-all rounded-lg text-sm";
  const labelClass = "text-[11px] font-bold uppercase tracking-widest text-[#0b1c30] mb-1.5 inline-block";

  return (
    <div className="space-y-8" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* AI CV Improver Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-[#0051d5] to-[#2f2ebe] flex flex-col md:flex-row items-center justify-between gap-5 shadow-xl shadow-[#0051d5]/20">
        <div>
          <h4 className="text-base font-black text-white flex items-center gap-2">
            <Wand2 className="w-5 h-5" />
            AI ile CV'nizi Güçlendirin
          </h4>
          <p className="text-sm text-white/80 mt-1 font-medium">
            Claude AI ile özgeçmişinizi profesyonel standartlara ve ATS kriterlerine uygun hale getirin.
          </p>
        </div>
        <Button
          onClick={() => onOptimize()}
          disabled={optimizing}
          size="lg"
          className="bg-white hover:bg-[#f4f5f8] text-[#0051d5] font-black shadow-lg shrink-0 rounded-xl"
        >
          {optimizing ? 'İyileştiriliyor...' : 'Yapay Zeka ile İyileştir'}
        </Button>
      </div>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid grid-cols-4 bg-[#f4f5f8] border border-[#e2e4eb] p-1.5 rounded-2xl shadow-inner mb-6">
          <TabsTrigger value="personal" className="text-xs font-bold text-[#45464d] data-[state=active]:bg-white data-[state=active]:text-[#0051d5] data-[state=active]:shadow-md rounded-xl py-2.5 transition-all">Kişisel</TabsTrigger>
          <TabsTrigger value="experience" className="text-xs font-bold text-[#45464d] data-[state=active]:bg-white data-[state=active]:text-[#0051d5] data-[state=active]:shadow-md rounded-xl py-2.5 transition-all">Deneyim</TabsTrigger>
          <TabsTrigger value="education" className="text-xs font-bold text-[#45464d] data-[state=active]:bg-white data-[state=active]:text-[#0051d5] data-[state=active]:shadow-md rounded-xl py-2.5 transition-all">Eğitim</TabsTrigger>
          <TabsTrigger value="skills" className="text-xs font-bold text-[#45464d] data-[state=active]:bg-white data-[state=active]:text-[#0051d5] data-[state=active]:shadow-md rounded-xl py-2.5 transition-all">Yetenek & Sertifika</TabsTrigger>
        </TabsList>

        {/* PERSONAL DETAILS */}
        <TabsContent value="personal" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex flex-col sm:flex-row gap-6 items-center border border-[#e2e4eb] p-6 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow">
            <div className="relative group w-28 h-28 rounded-full border-2 border-dashed border-[#c6c6cd] flex items-center justify-center overflow-hidden shrink-0 bg-[#f4f5f8]">
              {personal.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={personal.photo}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center text-[#76777d] p-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider">Görsel Yok</span>
                </div>
              )}
            </div>
            <div className="space-y-3 text-left w-full">
              <Label htmlFor="photo-upload" className={labelClass}>Profil Fotoğrafı Yükle</Label>
              <Input
                id="photo-upload"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onloadend = () => {
                      handlePersonalChange('photo', reader.result as string);
                    };
                    reader.readAsDataURL(file);
                  }
                }}
                className={`file:bg-white file:text-[#0b1c30] file:border file:border-[#e2e4eb] file:rounded-lg file:px-4 file:py-1.5 file:mr-4 file:font-bold file:text-xs hover:file:bg-[#f4f5f8] cursor-pointer pt-1.5 ${inputClass}`}
              />
              <p className="text-[11px] text-[#76777d] font-medium">
                Önerilen: Kare boyutlu (1:1), maksimum 2MB PNG veya JPG görseli.
              </p>
              {personal.photo && (
                <Button
                  type="button"
                  variant="link"
                  onClick={() => handlePersonalChange('photo', '')}
                  className="text-red-500 text-[11px] font-bold p-0 h-auto hover:text-red-600 uppercase tracking-widest"
                >
                  Fotoğrafı Kaldır
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <Label htmlFor="fullName" className={labelClass}>Ad Soyad</Label>
              <Input
                id="fullName"
                value={personal.fullName || ''}
                onChange={(e) => handlePersonalChange('fullName', e.target.value)}
                placeholder="Örn: Ahmet Yılmaz"
                className={inputClass}
              />
            </div>
            <div>
              <Label htmlFor="headline" className={labelClass}>Ünvan</Label>
              <Input
                id="headline"
                value={personal.headline || ''}
                onChange={(e) => handlePersonalChange('headline', e.target.value)}
                placeholder="Örn: Senior Frontend Developer"
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            <div>
              <Label htmlFor="email" className={labelClass}>E-posta</Label>
              <Input
                id="email"
                type="email"
                value={personal.email || ''}
                onChange={(e) => handlePersonalChange('email', e.target.value)}
                placeholder="ahmet@mail.com"
                className={inputClass}
              />
            </div>
            <div>
              <Label htmlFor="location" className={labelClass}>Konum</Label>
              <Input
                id="location"
                value={personal.location || ''}
                onChange={(e) => handlePersonalChange('location', e.target.value)}
                placeholder="İstanbul, Türkiye"
                className={inputClass}
              />
            </div>
            <div>
              <Label htmlFor="linkedin" className={labelClass}>Web Sitesi / Link</Label>
              <Input
                id="linkedin"
                value={personal.linkedin || ''}
                onChange={(e) => handlePersonalChange('linkedin', e.target.value)}
                placeholder="linkedin.com/in/ahmet"
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="summary" className={labelClass}>Özet / Hakkımda</Label>
            <Textarea
              id="summary"
              value={personal.summary || ''}
              onChange={(e) => handlePersonalChange('summary', e.target.value)}
              placeholder="Yaratıcı ve çözüm odaklı 5+ yıl deneyimli yazılım geliştirici..."
              rows={5}
              className={`${inputClass} min-h-[120px] resize-y py-3`}
            />
          </div>
        </TabsContent>

        {/* EXPERIENCE DETAILS */}
        <TabsContent value="experience" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex justify-between items-center bg-white p-4 border border-[#e2e4eb] rounded-2xl shadow-sm">
            <h4 className="text-sm font-black text-[#0b1c30] uppercase tracking-widest pl-2">İş Deneyimleri</h4>
            <Button
              onClick={addExperience}
              type="button"
              className="bg-[#0051d5] hover:bg-[#316bf3] text-white text-xs font-bold gap-2 rounded-xl h-10 px-4 shadow-md shadow-[#0051d5]/20"
            >
              <PlusCircle className="w-4 h-4" />
              Yeni İş Ekle
            </Button>
          </div>

          <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            {experience.length === 0 ? (
              <div className="text-center py-10 text-[#76777d] text-sm font-semibold border-2 border-dashed border-[#c6c6cd] rounded-2xl bg-[#f4f5f8]">
                Henüz deneyim eklemediniz. Yukarıdaki butondan ekleyebilirsiniz.
              </div>
            ) : (
              experience.map((exp: any, idx: number) => (
                <div key={idx} className="p-6 rounded-2xl bg-white border border-[#e2e4eb] shadow-sm relative space-y-5 hover:border-[#0051d5]/30 transition-colors group">
                  <button
                    type="button"
                    onClick={() => removeExperience(idx)}
                    className="absolute top-5 right-5 text-[#c6c6cd] hover:text-red-500 transition-colors bg-[#f4f5f8] hover:bg-red-50 p-2 rounded-lg opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mr-12">
                    <div>
                      <Label className={labelClass}>Pozisyon</Label>
                      <Input
                        value={exp.title || ''}
                        onChange={(e) => handleExperienceChange(idx, 'title', e.target.value)}
                        placeholder="Frontend Architect"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <Label className={labelClass}>Şirket Adı</Label>
                      <Input
                        value={exp.company || ''}
                        onChange={(e) => handleExperienceChange(idx, 'company', e.target.value)}
                        placeholder="Örn: Teknoloji Firması"
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div>
                      <Label className={labelClass}>Başlangıç Tarihi</Label>
                      <Input
                        value={exp.startDate || ''}
                        onChange={(e) => handleExperienceChange(idx, 'startDate', e.target.value)}
                        placeholder="Ocak 2023"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <Label className={labelClass}>Bitiş Tarihi</Label>
                      <Input
                        value={exp.endDate || ''}
                        onChange={(e) => handleExperienceChange(idx, 'endDate', e.target.value)}
                        placeholder="Aralık 2024"
                        disabled={exp.current}
                        className={inputClass}
                      />
                    </div>
                    <div className="flex items-center space-x-3 pt-6">
                      <input
                        type="checkbox"
                        id={`current-${idx}`}
                        checked={exp.current || false}
                        onChange={(e) => handleExperienceChange(idx, 'current', e.target.checked)}
                        className="w-5 h-5 rounded border-[#c6c6cd] bg-white text-[#0051d5] focus:ring-[#0051d5] cursor-pointer"
                      />
                      <label htmlFor={`current-${idx}`} className="text-sm font-bold text-[#0b1c30] cursor-pointer select-none">
                        Halen Çalışıyorum
                      </label>
                    </div>
                  </div>

                  <div>
                    <Label className={labelClass}>Açıklama / Başarılar</Label>
                    <Textarea
                      value={exp.description || ''}
                      onChange={(e) => handleExperienceChange(idx, 'description', e.target.value)}
                      placeholder="Proje başarılarınızı ve görevlerinizi listeleyin..."
                      rows={4}
                      className={`${inputClass} min-h-[100px] py-3`}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </TabsContent>

        {/* EDUCATION DETAILS */}
        <TabsContent value="education" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex justify-between items-center bg-white p-4 border border-[#e2e4eb] rounded-2xl shadow-sm">
            <h4 className="text-sm font-black text-[#0b1c30] uppercase tracking-widest pl-2">Eğitim Geçmişi</h4>
            <Button
              onClick={addEducation}
              type="button"
              className="bg-[#0051d5] hover:bg-[#316bf3] text-white text-xs font-bold gap-2 rounded-xl h-10 px-4 shadow-md shadow-[#0051d5]/20"
            >
              <PlusCircle className="w-4 h-4" />
              Eğitim Ekle
            </Button>
          </div>

          <div className="space-y-6 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
            {education.length === 0 ? (
              <div className="text-center py-10 text-[#76777d] text-sm font-semibold border-2 border-dashed border-[#c6c6cd] rounded-2xl bg-[#f4f5f8]">
                Henüz eğitim eklemediniz. Yukarıdaki butondan ekleyebilirsiniz.
              </div>
            ) : (
              education.map((edu: any, idx: number) => (
                <div key={idx} className="p-6 rounded-2xl bg-white border border-[#e2e4eb] shadow-sm relative space-y-5 hover:border-[#0051d5]/30 transition-colors group">
                  <button
                    type="button"
                    onClick={() => removeEducation(idx)}
                    className="absolute top-5 right-5 text-[#c6c6cd] hover:text-red-500 transition-colors bg-[#f4f5f8] hover:bg-red-50 p-2 rounded-lg opacity-0 group-hover:opacity-100"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mr-12">
                    <div>
                      <Label className={labelClass}>Okul / Üniversite</Label>
                      <Input
                        value={edu.school || ''}
                        onChange={(e) => handleEducationChange(idx, 'school', e.target.value)}
                        placeholder="İstanbul Teknik Üniversitesi"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <Label className={labelClass}>Derece (Örn: Lisans)</Label>
                      <Input
                        value={edu.degree || ''}
                        onChange={(e) => handleEducationChange(idx, 'degree', e.target.value)}
                        placeholder="Lisans"
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                    <div className="col-span-1 sm:col-span-2">
                      <Label className={labelClass}>Bölüm / Alan</Label>
                      <Input
                        value={edu.field || ''}
                        onChange={(e) => handleEducationChange(idx, 'field', e.target.value)}
                        placeholder="Bilgisayar Mühendisliği"
                        className={inputClass}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className={labelClass}>Başl. Yılı</Label>
                        <Input
                          value={edu.startYear || ''}
                          onChange={(e) => handleEducationChange(idx, 'startYear', e.target.value)}
                          placeholder="2018"
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <Label className={labelClass}>Bitiş Yılı</Label>
                        <Input
                          value={edu.endYear || ''}
                          onChange={(e) => handleEducationChange(idx, 'endYear', e.target.value)}
                          placeholder="2022"
                          className={inputClass}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </TabsContent>

        {/* SKILLS AND CERTIFICATIONS */}
        <TabsContent value="skills" className="space-y-8 pt-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          
          {/* Skills Input */}
          <div className="bg-white p-6 border border-[#e2e4eb] rounded-2xl shadow-sm">
            <Label htmlFor="skills-input" className={labelClass}>Yetenekler (Virgülle Ayırarak Yazın)</Label>
            <Textarea
              id="skills-input"
              value={skills.join(', ')}
              onChange={(e) => handleSkillsChange(e.target.value)}
              placeholder="TypeScript, React, Next.js, Node.js, TailwindCSS"
              rows={3}
              className={`${inputClass} min-h-[80px] py-3 mt-2`}
            />
            <p className="text-[11px] text-[#76777d] font-medium mt-3">
              Yeteneklerinizin listesini aralarına virgül koyarak yazın.
            </p>
          </div>

          {/* Certifications Input */}
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 border border-[#e2e4eb] rounded-2xl shadow-sm">
              <h4 className="text-sm font-black text-[#0b1c30] uppercase tracking-widest pl-2">Sertifikalar</h4>
              <Button
                onClick={addCert}
                type="button"
                className="bg-[#0051d5] hover:bg-[#316bf3] text-white text-xs font-bold gap-2 rounded-xl h-10 px-4 shadow-md shadow-[#0051d5]/20"
              >
                <PlusCircle className="w-4 h-4" />
                Sertifika Ekle
              </Button>
            </div>

            <div className="space-y-6 max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
              {certifications.length === 0 ? (
                <div className="text-center py-10 text-[#76777d] text-sm font-semibold border-2 border-dashed border-[#c6c6cd] rounded-2xl bg-[#f4f5f8]">
                  Henüz sertifika eklemediniz.
                </div>
              ) : (
                certifications.map((cert: any, idx: number) => (
                  <div key={idx} className="p-6 rounded-2xl bg-white border border-[#e2e4eb] shadow-sm relative space-y-5 hover:border-[#0051d5]/30 transition-colors group">
                    <button
                      type="button"
                      onClick={() => removeCert(idx)}
                      className="absolute top-5 right-5 text-[#c6c6cd] hover:text-red-500 transition-colors bg-[#f4f5f8] hover:bg-red-50 p-2 rounded-lg opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mr-12">
                      <div>
                        <Label className={labelClass}>Sertifika Adı</Label>
                        <Input
                          value={cert.name || ''}
                          onChange={(e) => handleCertChange(idx, 'name', e.target.value)}
                          placeholder="AWS Solutions Architect"
                          className={inputClass}
                        />
                      </div>
                      <div>
                        <Label className={labelClass}>Veren Kurum</Label>
                        <Input
                          value={cert.issuer || ''}
                          onChange={(e) => handleCertChange(idx, 'issuer', e.target.value)}
                          placeholder="Amazon Web Services"
                          className={inputClass}
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mr-12">
                      <div>
                        <Label className={labelClass}>Tarih</Label>
                        <Input
                          value={cert.date || ''}
                          onChange={(e) => handleCertChange(idx, 'date', e.target.value)}
                          placeholder="Eylül 2023"
                          className={inputClass}
                        />
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
