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

  return (
    <div className="space-y-6" style={{ fontFamily: 'Inter, sans-serif' }}>
      {/* AI CV Improver Banner */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-[#eff4ff] to-[#f8f9ff] border border-[#0051d5]/20 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">
        <div>
          <h4 className="text-sm font-bold text-[#0051d5] flex items-center gap-1.5">
            <Wand2 className="w-4 h-4" />
            AI ile CV'nizi Güçlendirin
          </h4>
          <p className="text-xs text-[#45464d] mt-1">
            Claude AI ile özgeçmişinizi profesyonel standartlara ve ATS kriterlerine uygun hale getirin.
          </p>
        </div>
        <Button
          onClick={() => onOptimize()}
          disabled={optimizing}
          size="sm"
          className="bg-[#0051d5] hover:bg-[#316bf3] text-white shadow-md shadow-[#0051d5]/20 shrink-0 font-semibold"
        >
          {optimizing ? 'İyileştiriliyor...' : 'Yapay Zeka ile İyileştir'}
        </Button>
      </div>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid grid-cols-4 bg-[#f8f9ff] border border-[#c6c6cd] p-1 rounded-xl shadow-inner">
          <TabsTrigger value="personal" className="text-xs font-semibold text-[#45464d] data-[state=active]:bg-white data-[state=active]:text-[#0051d5] data-[state=active]:shadow-sm rounded-lg">Kişisel</TabsTrigger>
          <TabsTrigger value="experience" className="text-xs font-semibold text-[#45464d] data-[state=active]:bg-white data-[state=active]:text-[#0051d5] data-[state=active]:shadow-sm rounded-lg">Deneyim</TabsTrigger>
          <TabsTrigger value="education" className="text-xs font-semibold text-[#45464d] data-[state=active]:bg-white data-[state=active]:text-[#0051d5] data-[state=active]:shadow-sm rounded-lg">Eğitim</TabsTrigger>
          <TabsTrigger value="skills" className="text-xs font-semibold text-[#45464d] data-[state=active]:bg-white data-[state=active]:text-[#0051d5] data-[state=active]:shadow-sm rounded-lg">Yetenek & Sertifika</TabsTrigger>
        </TabsList>

        {/* PERSONAL DETAILS */}
        <TabsContent value="personal" className="space-y-4 pt-4">
          <div className="flex flex-col sm:flex-row gap-6 items-center border border-[#c6c6cd] p-4 rounded-xl bg-white shadow-sm mb-4">
            <div className="relative group w-24 h-24 rounded-full border-2 border-dashed border-[#c6c6cd] flex items-center justify-center overflow-hidden shrink-0 bg-[#f8f9ff]">
              {personal.photo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={personal.photo}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center text-[#76777d] p-2">
                  <span className="text-[10px] font-medium">Görsel Yok</span>
                </div>
              )}
            </div>
            <div className="space-y-2 text-left w-full">
              <Label htmlFor="photo-upload" className="text-[#0b1c30] text-xs font-semibold">Profil Fotoğrafı Yükle</Label>
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
                className="bg-[#f8f9ff] border-[#c6c6cd] text-[#0b1c30] focus-visible:ring-[#0051d5] text-xs file:bg-white file:text-[#0b1c30] file:border file:border-[#c6c6cd] file:rounded-md file:px-2 file:py-1 file:mr-2 hover:file:bg-[#f8f9ff] cursor-pointer"
              />
              <p className="text-[9px] text-[#76777d]">
                Önerilen: Kare boyutlu (1:1), maksimum 2MB PNG veya JPG görseli. Fotoğrafınız PDF çıktısında da görünecektir.
              </p>
              {personal.photo && (
                <Button
                  type="button"
                  variant="link"
                  onClick={() => handlePersonalChange('photo', '')}
                  className="text-red-500 text-[10px] font-semibold p-0 h-auto hover:text-red-600"
                >
                  Fotoğrafı Kaldır
                </Button>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-[#0b1c30] text-xs font-semibold">Ad Soyad</Label>
              <Input
                id="fullName"
                value={personal.fullName || ''}
                onChange={(e) => handlePersonalChange('fullName', e.target.value)}
                placeholder="Örn: Ahmet Yılmaz"
                className="bg-white border-[#c6c6cd] text-[#0b1c30] placeholder-[#76777d] focus-visible:ring-[#0051d5]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="headline" className="text-[#0b1c30] text-xs font-semibold">Ünvan</Label>
              <Input
                id="headline"
                value={personal.headline || ''}
                onChange={(e) => handlePersonalChange('headline', e.target.value)}
                placeholder="Örn: Senior Frontend Developer"
                className="bg-white border-[#c6c6cd] text-[#0b1c30] placeholder-[#76777d] focus-visible:ring-[#0051d5]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#0b1c30] text-xs font-semibold">E-posta</Label>
              <Input
                id="email"
                type="email"
                value={personal.email || ''}
                onChange={(e) => handlePersonalChange('email', e.target.value)}
                placeholder="ahmet@mail.com"
                className="bg-white border-[#c6c6cd] text-[#0b1c30] placeholder-[#76777d] focus-visible:ring-[#0051d5]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location" className="text-[#0b1c30] text-xs font-semibold">Konum</Label>
              <Input
                id="location"
                value={personal.location || ''}
                onChange={(e) => handlePersonalChange('location', e.target.value)}
                placeholder="İstanbul, Türkiye"
                className="bg-white border-[#c6c6cd] text-[#0b1c30] placeholder-[#76777d] focus-visible:ring-[#0051d5]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkedin" className="text-[#0b1c30] text-xs font-semibold">Kişisel Web Sitesi / Portfolyo</Label>
              <Input
                id="linkedin"
                value={personal.linkedin || ''}
                onChange={(e) => handlePersonalChange('linkedin', e.target.value)}
                placeholder="yazar.com veya github.com/ahmet"
                className="bg-white border-[#c6c6cd] text-[#0b1c30] placeholder-[#76777d] focus-visible:ring-[#0051d5]"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="summary" className="text-[#0b1c30] text-xs font-semibold">Özet / Hakkımda</Label>
            <Textarea
              id="summary"
              value={personal.summary || ''}
              onChange={(e) => handlePersonalChange('summary', e.target.value)}
              placeholder="Yaratıcı ve çözüm odaklı 5+ yıl deneyimli yazılım geliştirici..."
              rows={4}
              className="bg-white border-[#c6c6cd] text-[#0b1c30] placeholder-[#76777d] focus-visible:ring-[#0051d5] min-h-[100px]"
            />
          </div>
        </TabsContent>

        {/* EXPERIENCE DETAILS */}
        <TabsContent value="experience" className="space-y-4 pt-4">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-bold text-[#0b1c30]">İş Deneyimleri</h4>
            <Button
              onClick={addExperience}
              type="button"
              variant="outline"
              size="sm"
              className="border-[#0051d5]/30 text-[#0051d5] hover:bg-[#eff4ff] hover:text-[#0051d5] text-xs font-semibold gap-1 bg-white shadow-sm"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              İş Ekle
            </Button>
          </div>

          <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
            {experience.length === 0 ? (
              <div className="text-center py-6 text-[#76777d] text-xs border border-dashed border-[#c6c6cd] rounded-lg bg-[#f8f9ff]">
                Henüz deneyim eklemediniz.
              </div>
            ) : (
              experience.map((exp: any, idx: number) => (
                <div key={idx} className="p-4 rounded-xl bg-white border border-[#c6c6cd] shadow-sm relative space-y-3">
                  <button
                    type="button"
                    onClick={() => removeExperience(idx)}
                    className="absolute top-4 right-4 text-[#76777d] hover:text-red-500 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mr-6">
                    <div className="space-y-1">
                      <Label className="text-[#45464d] text-[10px] font-bold uppercase tracking-wider">Pozisyon</Label>
                      <Input
                        value={exp.title || ''}
                        onChange={(e) => handleExperienceChange(idx, 'title', e.target.value)}
                        placeholder="Frontend Architect"
                        className="h-8 text-xs bg-[#f8f9ff] border-[#c6c6cd]"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[#45464d] text-[10px] font-bold uppercase tracking-wider">Şirket Adı</Label>
                      <Input
                        value={exp.company || ''}
                        onChange={(e) => handleExperienceChange(idx, 'company', e.target.value)}
                        placeholder="Örn: Teknoloji Firması"
                        className="h-8 text-xs bg-[#f8f9ff] border-[#c6c6cd]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <Label className="text-[#45464d] text-[10px] font-bold uppercase tracking-wider">Başlangıç Tarihi</Label>
                      <Input
                        value={exp.startDate || ''}
                        onChange={(e) => handleExperienceChange(idx, 'startDate', e.target.value)}
                        placeholder="Ocak 2023"
                        className="h-8 text-xs bg-[#f8f9ff] border-[#c6c6cd]"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[#45464d] text-[10px] font-bold uppercase tracking-wider">Bitiş Tarihi</Label>
                      <Input
                        value={exp.endDate || ''}
                        onChange={(e) => handleExperienceChange(idx, 'endDate', e.target.value)}
                        placeholder="Aralık 2024"
                        disabled={exp.current}
                        className="h-8 text-xs bg-[#f8f9ff] border-[#c6c6cd]"
                      />
                    </div>
                    <div className="flex items-center space-x-2 pt-5">
                      <input
                        type="checkbox"
                        id={`current-${idx}`}
                        checked={exp.current || false}
                        onChange={(e) => handleExperienceChange(idx, 'current', e.target.checked)}
                        className="rounded border-[#c6c6cd] bg-white text-[#0051d5] focus:ring-[#0051d5]"
                      />
                      <label htmlFor={`current-${idx}`} className="text-[11px] font-medium text-[#45464d] cursor-pointer select-none">
                        Halen Çalışıyorum
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3">
                    <div className="space-y-1">
                      <Label className="text-[#45464d] text-[10px] font-bold uppercase tracking-wider">Açıklama / Başarılar</Label>
                      <Textarea
                        value={exp.description || ''}
                        onChange={(e) => handleExperienceChange(idx, 'description', e.target.value)}
                        placeholder="Proje başarılarınızı ve görevlerinizi listeleyin..."
                        rows={3}
                        className="text-xs bg-[#f8f9ff] border-[#c6c6cd]"
                      />
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </TabsContent>

        {/* EDUCATION DETAILS */}
        <TabsContent value="education" className="space-y-4 pt-4">
          <div className="flex justify-between items-center">
            <h4 className="text-sm font-bold text-[#0b1c30]">Eğitim Geçmişi</h4>
            <Button
              onClick={addEducation}
              type="button"
              variant="outline"
              size="sm"
              className="border-[#0051d5]/30 text-[#0051d5] hover:bg-[#eff4ff] hover:text-[#0051d5] text-xs font-semibold gap-1 bg-white shadow-sm"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Eğitim Ekle
            </Button>
          </div>

          <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1">
            {education.length === 0 ? (
              <div className="text-center py-6 text-[#76777d] text-xs border border-dashed border-[#c6c6cd] rounded-lg bg-[#f8f9ff]">
                Henüz eğitim eklemediniz.
              </div>
            ) : (
              education.map((edu: any, idx: number) => (
                <div key={idx} className="p-4 rounded-xl bg-white border border-[#c6c6cd] shadow-sm relative space-y-3">
                  <button
                    type="button"
                    onClick={() => removeEducation(idx)}
                    className="absolute top-4 right-4 text-[#76777d] hover:text-red-500 transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mr-6">
                    <div className="space-y-1">
                      <Label className="text-[#45464d] text-[10px] font-bold uppercase tracking-wider">Okul / Üniversite</Label>
                      <Input
                        value={edu.school || ''}
                        onChange={(e) => handleEducationChange(idx, 'school', e.target.value)}
                        placeholder="İstanbul Teknik Üniversitesi"
                        className="h-8 text-xs bg-[#f8f9ff] border-[#c6c6cd]"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[#45464d] text-[10px] font-bold uppercase tracking-wider">Derece (Örn: Lisans)</Label>
                      <Input
                        value={edu.degree || ''}
                        onChange={(e) => handleEducationChange(idx, 'degree', e.target.value)}
                        placeholder="Lisans"
                        className="h-8 text-xs bg-[#f8f9ff] border-[#c6c6cd]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="col-span-1 sm:col-span-2 space-y-1">
                      <Label className="text-[#45464d] text-[10px] font-bold uppercase tracking-wider">Bölüm / Alan</Label>
                      <Input
                        value={edu.field || ''}
                        onChange={(e) => handleEducationChange(idx, 'field', e.target.value)}
                        placeholder="Bilgisayar Mühendisliği"
                        className="h-8 text-xs bg-[#f8f9ff] border-[#c6c6cd]"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <Label className="text-[#45464d] text-[10px] font-bold uppercase tracking-wider">Başl. Yılı</Label>
                        <Input
                          value={edu.startYear || ''}
                          onChange={(e) => handleEducationChange(idx, 'startYear', e.target.value)}
                          placeholder="2018"
                          className="h-8 text-xs bg-[#f8f9ff] border-[#c6c6cd] px-1.5"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[#45464d] text-[10px] font-bold uppercase tracking-wider">Bitiş Yılı</Label>
                        <Input
                          value={edu.endYear || ''}
                          onChange={(e) => handleEducationChange(idx, 'endYear', e.target.value)}
                          placeholder="2022"
                          className="h-8 text-xs bg-[#f8f9ff] border-[#c6c6cd] px-1.5"
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
        <TabsContent value="skills" className="space-y-6 pt-4">
          {/* Skills Input */}
          <div className="space-y-2">
            <Label htmlFor="skills-input" className="text-[#0b1c30] text-xs font-bold">Yetenekler (Virgülle Ayırarak Yazın)</Label>
            <Textarea
              id="skills-input"
              value={skills.join(', ')}
              onChange={(e) => handleSkillsChange(e.target.value)}
              placeholder="TypeScript, React, Next.js, Node.js, TailwindCSS"
              rows={2}
              className="bg-white border-[#c6c6cd] text-[#0b1c30] placeholder-[#76777d] focus-visible:ring-[#0051d5] min-h-[60px] text-xs"
            />
            <p className="text-[10px] text-[#76777d]">
              Yeteneklerinizin listesini aralarına virgül koyarak yazın.
            </p>
          </div>

          <hr className="border-[#c6c6cd]/50" />

          {/* Certifications Input */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="text-sm font-bold text-[#0b1c30]">Sertifikalar</h4>
              <Button
                onClick={addCert}
                type="button"
                variant="outline"
                size="sm"
                className="border-[#0051d5]/30 text-[#0051d5] hover:bg-[#eff4ff] hover:text-[#0051d5] text-xs font-semibold gap-1 bg-white shadow-sm"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                Sertifika Ekle
              </Button>
            </div>

            <div className="space-y-4 max-h-[30vh] overflow-y-auto pr-1">
              {certifications.length === 0 ? (
                <div className="text-center py-6 text-[#76777d] text-xs border border-dashed border-[#c6c6cd] rounded-lg bg-[#f8f9ff]">
                  Henüz sertifika eklemediniz.
                </div>
              ) : (
                certifications.map((cert: any, idx: number) => (
                  <div key={idx} className="p-4 rounded-xl bg-white border border-[#c6c6cd] shadow-sm relative space-y-3">
                    <button
                      type="button"
                      onClick={() => removeCert(idx)}
                      className="absolute top-4 right-4 text-[#76777d] hover:text-red-500 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mr-6">
                      <div className="space-y-1">
                        <Label className="text-[#45464d] text-[10px] font-bold uppercase tracking-wider">Sertifika Adı</Label>
                        <Input
                          value={cert.name || ''}
                          onChange={(e) => handleCertChange(idx, 'name', e.target.value)}
                          placeholder="AWS Solutions Architect"
                          className="h-8 text-xs bg-[#f8f9ff] border-[#c6c6cd]"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label className="text-[#45464d] text-[10px] font-bold uppercase tracking-wider">Veren Kurum</Label>
                        <Input
                          value={cert.issuer || ''}
                          onChange={(e) => handleCertChange(idx, 'issuer', e.target.value)}
                          placeholder="Amazon Web Services"
                          className="h-8 text-xs bg-[#f8f9ff] border-[#c6c6cd]"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mr-6">
                      <div className="space-y-1">
                        <Label className="text-[#45464d] text-[10px] font-bold uppercase tracking-wider">Tarih</Label>
                        <Input
                          value={cert.date || ''}
                          onChange={(e) => handleCertChange(idx, 'date', e.target.value)}
                          placeholder="Eylül 2023"
                          className="h-8 text-xs bg-[#f8f9ff] border-[#c6c6cd]"
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
