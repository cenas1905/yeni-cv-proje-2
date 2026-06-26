'use client';

import React from 'react';
import { CVTemplate } from './TemplateSelector';

interface CVPreviewProps {
  data: any;
  template: CVTemplate;
}

export default function CVPreview({ data, template }: CVPreviewProps) {
  const personal = data?.personal || {};
  const experience = Array.isArray(data?.experience) ? data.experience : [];
  const education = Array.isArray(data?.education) ? data.education : [];
  const skills = Array.isArray(data?.skills) ? data.skills : [];
  const certifications = Array.isArray(data?.certifications) ? data.certifications : [];

  // Common Icons
  const Icons = {
    Mail: () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>,
    MapPin: () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>,
    Link: () => <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>,
    User: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>,
    Briefcase: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="14" x="2" y="7" rx="2" ry="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>,
    Award: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>,
    Book: () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20"/></svg>
  };

  /* ==============================
     TEMPLATE 1: MODERN (SaaS Premium)
     ============================== */
  if (template === 'modern') {
    return (
      <div className="flex flex-col min-h-[29.7cm] max-w-[21cm] mx-auto bg-white shadow-2xl overflow-hidden font-sans text-[#333] relative">
        <header className="bg-[#0b1c30] text-white px-10 py-12 flex items-center justify-between">
          <div className="flex-1 pr-4">
            <h1 className="text-[38px] font-black tracking-tight uppercase leading-none mb-2">{personal.fullName || 'AD SOYAD'}</h1>
            {personal.headline && <p className="text-[17px] text-[#0051d5] font-bold uppercase tracking-[0.2em]">{personal.headline}</p>}
          </div>
          {personal.photo && (
            <div className="w-32 h-32 rounded-full border-4 border-white/10 overflow-hidden shrink-0 shadow-lg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={personal.photo} alt="Profile" className="w-full h-full object-cover" />
            </div>
          )}
        </header>

        <div className="flex flex-1">
          <aside className="w-[34%] bg-[#f4f5f8] px-8 py-10 border-r border-[#e2e4eb] flex flex-col gap-10">
            <div>
              <h2 className="text-[14px] font-black text-[#0b1c30] uppercase tracking-widest border-b-2 border-[#0051d5] pb-2 mb-5">İletişim</h2>
              <div className="space-y-4 text-[13px] text-[#45464d] font-semibold">
                {personal.email && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-[#0051d5] shrink-0"><Icons.Mail /></div>
                    <span className="break-all">{personal.email}</span>
                  </div>
                )}
                {personal.location && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-[#0051d5] shrink-0"><Icons.MapPin /></div>
                    <span>{personal.location}</span>
                  </div>
                )}
                {personal.linkedin && (
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-white shadow-sm flex items-center justify-center text-[#0051d5] shrink-0"><Icons.Link /></div>
                    <span className="break-all">{personal.linkedin}</span>
                  </div>
                )}
              </div>
            </div>

            {skills.length > 0 && (
              <div>
                <h2 className="text-[14px] font-black text-[#0b1c30] uppercase tracking-widest border-b-2 border-[#0051d5] pb-2 mb-5">Yetenekler</h2>
                <div className="flex flex-col gap-3">
                  {skills.map((s: string, i: number) => (
                    <div key={i} className="flex flex-col gap-1">
                      <span className="text-[13px] font-bold text-[#0b1c30]">{s}</span>
                      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                        <div className="h-full bg-[#0051d5] rounded-full w-[85%]"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {education.length > 0 && (
              <div>
                <h2 className="text-[14px] font-black text-[#0b1c30] uppercase tracking-widest border-b-2 border-[#0051d5] pb-2 mb-5">Eğitim</h2>
                <div className="space-y-6">
                  {education.map((edu: any, idx: number) => (
                    <div key={idx} className="relative">
                      <div className="text-[12px] text-[#0051d5] font-bold bg-white px-2 py-0.5 rounded shadow-sm inline-block mb-1.5 border border-[#e2e4eb]">
                        {edu.startYear} - {edu.endYear}
                      </div>
                      <div className="text-[14px] font-black text-[#0b1c30] leading-snug">
                        {edu.degree} {edu.field && <span className="font-semibold">({edu.field})</span>}
                      </div>
                      <div className="text-[13px] font-semibold text-[#76777d] mt-1">{edu.school}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </aside>

          <main className="w-[66%] px-10 py-10 flex flex-col gap-10">
            {personal.summary && (
              <div>
                <h2 className="text-[18px] font-black text-[#0b1c30] uppercase tracking-widest border-b-2 border-[#e2e4eb] pb-3 mb-5 flex items-center gap-3">
                  <div className="bg-[#eff4ff] p-2 rounded-lg text-[#0051d5]"><Icons.User /></div>
                  Profil
                </h2>
                <p className="text-[14px] text-[#45464d] font-medium leading-relaxed text-justify">{personal.summary}</p>
              </div>
            )}

            {experience.length > 0 && (
              <div>
                <h2 className="text-[18px] font-black text-[#0b1c30] uppercase tracking-widest border-b-2 border-[#e2e4eb] pb-3 mb-6 flex items-center gap-3">
                  <div className="bg-[#eff4ff] p-2 rounded-lg text-[#0051d5]"><Icons.Briefcase /></div>
                  İş Deneyimi
                </h2>
                <div className="space-y-0">
                  {experience.map((exp: any, idx: number) => (
                    <div key={idx} className="relative pl-6 border-l-2 border-[#e2e4eb] pb-8 last:pb-0">
                      <div className="absolute w-4 h-4 bg-white rounded-full -left-[9px] top-1 border-4 border-[#0051d5] shadow-sm"></div>
                      <div className="flex flex-col gap-1 mb-3">
                        <div className="flex justify-between items-start">
                          <h3 className="text-[17px] font-black text-[#0b1c30]">{exp.title}</h3>
                          <div className="text-[11.5px] font-bold text-[#0051d5] bg-[#eff4ff] px-2.5 py-1 rounded-md shrink-0 ml-4 border border-[#0051d5]/10 whitespace-nowrap">
                            {exp.startDate} - {exp.current ? 'Günümüz' : exp.endDate}
                          </div>
                        </div>
                        <div className="text-[14px] font-bold text-[#76777d] uppercase tracking-wide">{exp.company}</div>
                      </div>
                      {exp.description && <p className="text-[13.5px] font-medium text-[#45464d] leading-relaxed text-justify whitespace-pre-line">{exp.description}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {certifications.length > 0 && (
              <div>
                <h2 className="text-[18px] font-black text-[#0b1c30] uppercase tracking-widest border-b-2 border-[#e2e4eb] pb-3 mb-6 flex items-center gap-3">
                  <div className="bg-[#eff4ff] p-2 rounded-lg text-[#0051d5]"><Icons.Award /></div>
                  Sertifikalar
                </h2>
                <div className="grid grid-cols-1 gap-4">
                  {certifications.map((cert: any, idx: number) => (
                    <div key={idx} className="bg-[#f8f9ff] p-4 rounded-xl border border-[#e2e4eb]">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="text-[15px] font-bold text-[#0b1c30]">{cert.name}</h3>
                        {cert.date && <span className="text-[12px] font-bold text-[#76777d]">{cert.date}</span>}
                      </div>
                      {cert.issuer && <div className="text-[13px] font-semibold text-[#0051d5]">{cert.issuer}</div>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    );
  }

  /* ==============================
     TEMPLATE 2: PROFESSIONAL (Corporate)
     ============================== */
  if (template === 'professional') {
    return (
      <div className="flex min-h-[29.7cm] max-w-[21cm] mx-auto bg-white shadow-2xl overflow-hidden font-sans relative">
        {/* Left Sidebar (Dark Blue) */}
        <aside className="w-[36%] bg-[#1a2530] text-white px-8 py-12 flex flex-col gap-10">
          <div className="flex flex-col items-center text-center">
            {personal.photo && (
              <div className="w-40 h-40 rounded-full border-4 border-white/20 overflow-hidden mb-6 shadow-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={personal.photo} alt="Profile" className="w-full h-full object-cover" />
              </div>
            )}
            <h1 className="text-[32px] font-black tracking-tight leading-tight mb-2">{personal.fullName || 'Ad Soyad'}</h1>
            {personal.headline && <p className="text-[15px] text-[#4f83cc] font-bold uppercase tracking-widest">{personal.headline}</p>}
          </div>

          <div className="space-y-6">
            <h2 className="text-[15px] font-black uppercase tracking-widest border-b border-white/20 pb-2 text-[#e2e4eb]">İletişim</h2>
            <div className="space-y-4 text-[13px] font-medium text-white/90">
              {personal.email && (
                <div className="flex items-center gap-3">
                  <Icons.Mail /> <span>{personal.email}</span>
                </div>
              )}
              {personal.location && (
                <div className="flex items-center gap-3">
                  <Icons.MapPin /> <span>{personal.location}</span>
                </div>
              )}
              {personal.linkedin && (
                <div className="flex items-center gap-3">
                  <Icons.Link /> <span>{personal.linkedin}</span>
                </div>
              )}
            </div>
          </div>

          {education.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-[15px] font-black uppercase tracking-widest border-b border-white/20 pb-2 text-[#e2e4eb]">Eğitim</h2>
              <div className="space-y-5">
                {education.map((edu: any, idx: number) => (
                  <div key={idx}>
                    <div className="text-[12px] text-[#4f83cc] font-bold mb-1">{edu.startYear} - {edu.endYear}</div>
                    <div className="text-[14px] font-bold leading-snug">{edu.degree} {edu.field && <span>({edu.field})</span>}</div>
                    <div className="text-[13px] text-white/70 mt-1">{edu.school}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {skills.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-[15px] font-black uppercase tracking-widest border-b border-white/20 pb-2 text-[#e2e4eb]">Yetenekler</h2>
              <div className="flex flex-wrap gap-2">
                {skills.map((s: string, i: number) => (
                  <span key={i} className="bg-white/10 px-3 py-1.5 rounded text-[12px] font-semibold border border-white/10">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* Right Main Content */}
        <main className="w-[64%] px-10 py-12 flex flex-col gap-10 bg-[#fbfbfd]">
          {personal.summary && (
            <div>
              <h2 className="text-[18px] font-black text-[#1a2530] uppercase tracking-widest border-b-2 border-[#1a2530] pb-2 mb-4">Profil Profili</h2>
              <p className="text-[14px] text-[#45464d] font-medium leading-relaxed text-justify">{personal.summary}</p>
            </div>
          )}

          {experience.length > 0 && (
            <div>
              <h2 className="text-[18px] font-black text-[#1a2530] uppercase tracking-widest border-b-2 border-[#1a2530] pb-2 mb-6">İş Deneyimi</h2>
              <div className="space-y-8">
                {experience.map((exp: any, idx: number) => (
                  <div key={idx} className="relative">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-[17px] font-black text-[#1a2530]">{exp.title}</h3>
                        <div className="text-[14px] font-bold text-[#4f83cc]">{exp.company}</div>
                      </div>
                      <div className="text-[12px] font-bold text-[#76777d] bg-white border border-[#c6c6cd] px-2 py-1 rounded">
                        {exp.startDate} - {exp.current ? 'Günümüz' : exp.endDate}
                      </div>
                    </div>
                    {exp.description && <p className="text-[13.5px] font-medium text-[#45464d] leading-relaxed text-justify whitespace-pre-line">{exp.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}

          {certifications.length > 0 && (
            <div>
              <h2 className="text-[18px] font-black text-[#1a2530] uppercase tracking-widest border-b-2 border-[#1a2530] pb-2 mb-6">Sertifikalar</h2>
              <div className="space-y-4">
                {certifications.map((cert: any, idx: number) => (
                  <div key={idx} className="flex justify-between items-start border-l-2 border-[#4f83cc] pl-4">
                    <div>
                      <h3 className="text-[15px] font-bold text-[#1a2530]">{cert.name}</h3>
                      {cert.issuer && <div className="text-[13px] font-semibold text-[#76777d]">{cert.issuer}</div>}
                    </div>
                    {cert.date && <span className="text-[12px] font-bold text-[#4f83cc]">{cert.date}</span>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>
    );
  }

  /* ==============================
     TEMPLATE 3: MINIMAL (Startup)
     ============================== */
  if (template === 'minimal') {
    return (
      <div className="flex flex-col min-h-[29.7cm] max-w-[21cm] mx-auto bg-white shadow-2xl overflow-hidden font-sans text-[#111] px-16 py-16">
        <header className="border-b-4 border-black pb-8 mb-8 flex justify-between items-end gap-6">
          <div className="flex-1">
            <h1 className="text-[46px] font-black tracking-tighter leading-none mb-3 uppercase">{personal.fullName || 'Ad Soyad'}</h1>
            {personal.headline && <p className="text-[18px] font-bold text-gray-500 uppercase tracking-widest">{personal.headline}</p>}
            <div className="flex flex-wrap gap-4 mt-4 text-[13px] font-semibold text-gray-800">
              {personal.email && <span className="flex items-center gap-1.5"><Icons.Mail /> {personal.email}</span>}
              {personal.linkedin && <span className="flex items-center gap-1.5"><Icons.Link /> {personal.linkedin}</span>}
              {personal.location && <span className="flex items-center gap-1.5"><Icons.MapPin /> {personal.location}</span>}
            </div>
          </div>
          {personal.photo && (
            <div className="w-28 h-28 shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={personal.photo} alt="Profile" className="w-full h-full object-cover filter grayscale" />
            </div>
          )}
        </header>

        {personal.summary && (
          <section className="mb-10">
            <p className="text-[15px] font-medium leading-relaxed text-gray-700">{personal.summary}</p>
          </section>
        )}

        {experience.length > 0 && (
          <section className="mb-10">
            <h2 className="text-[20px] font-black uppercase tracking-widest mb-6">Deneyim</h2>
            <div className="space-y-8">
              {experience.map((exp: any, idx: number) => (
                <div key={idx}>
                  <div className="flex justify-between items-baseline mb-2">
                    <h3 className="text-[18px] font-black">{exp.title}</h3>
                    <span className="text-[13px] font-bold text-gray-500">{exp.startDate} - {exp.current ? 'Günümüz' : exp.endDate}</span>
                  </div>
                  <div className="text-[15px] font-bold text-gray-800 mb-2">{exp.company}</div>
                  {exp.description && <p className="text-[14px] leading-relaxed text-gray-600 whitespace-pre-line">{exp.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}

        <div className="grid grid-cols-2 gap-10">
          {education.length > 0 && (
            <section>
              <h2 className="text-[20px] font-black uppercase tracking-widest mb-6">Eğitim</h2>
              <div className="space-y-6">
                {education.map((edu: any, idx: number) => (
                  <div key={idx}>
                    <h3 className="text-[15px] font-black">{edu.school}</h3>
                    <div className="text-[14px] font-medium text-gray-700 mt-1">{edu.degree} {edu.field && <span>({edu.field})</span>}</div>
                    <div className="text-[12px] font-bold text-gray-500 mt-1">{edu.startYear} - {edu.endYear}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {skills.length > 0 && (
            <section>
              <h2 className="text-[20px] font-black uppercase tracking-widest mb-6">Yetenekler</h2>
              <p className="text-[14px] font-medium leading-relaxed text-gray-700">
                {skills.join(' • ')}
              </p>
            </section>
          )}
        </div>
      </div>
    );
  }

  /* ==============================
     TEMPLATE 4: WARM (Elegant Serif)
     ============================== */
  // Default to Warm
  return (
    <div className="flex min-h-[29.7cm] max-w-[21cm] mx-auto bg-white shadow-2xl overflow-hidden font-serif text-[#3e3a37] relative">
      <aside className="w-[32%] bg-[#f4ebe1] px-8 py-12 flex flex-col gap-10">
        <div className="text-center border-b border-[#d8c8b8] pb-8">
          {personal.photo && (
            <div className="w-36 h-36 mx-auto rounded-full border-4 border-white overflow-hidden mb-6 shadow-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={personal.photo} alt="Profile" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
        
        <div>
          <h2 className="text-[16px] font-bold uppercase tracking-widest text-[#7a6552] mb-4">İletişim</h2>
          <div className="space-y-4 text-[13px] font-medium text-[#5c4d40]">
            {personal.email && <div>{personal.email}</div>}
            {personal.location && <div>{personal.location}</div>}
            {personal.linkedin && <div>{personal.linkedin}</div>}
          </div>
        </div>

        {education.length > 0 && (
          <div>
            <h2 className="text-[16px] font-bold uppercase tracking-widest text-[#7a6552] mb-4">Eğitim</h2>
            <div className="space-y-5">
              {education.map((edu: any, idx: number) => (
                <div key={idx}>
                  <div className="text-[14px] font-bold">{edu.degree}</div>
                  <div className="text-[13px] text-[#7a6552] mt-0.5">{edu.school}</div>
                  <div className="text-[12px] text-[#9b8875] italic mt-1">{edu.startYear} - {edu.endYear}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {skills.length > 0 && (
          <div>
            <h2 className="text-[16px] font-bold uppercase tracking-widest text-[#7a6552] mb-4">Yetenekler</h2>
            <div className="space-y-2">
              {skills.map((s: string, i: number) => (
                <div key={i} className="text-[13px] font-medium border-b border-[#e6dcd0] pb-1">{s}</div>
              ))}
            </div>
          </div>
        )}
      </aside>

      <main className="w-[68%] px-12 py-12 flex flex-col gap-10 bg-[#faf9f7]">
        <header className="mb-4">
          <h1 className="text-[42px] font-normal tracking-tight text-[#2c2825] leading-none mb-3">{personal.fullName || 'Ad Soyad'}</h1>
          {personal.headline && <p className="text-[18px] text-[#7a6552] italic">{personal.headline}</p>}
        </header>

        {personal.summary && (
          <section>
            <h2 className="text-[18px] font-bold uppercase tracking-widest text-[#2c2825] mb-4 border-b border-[#e6dcd0] pb-2">Özet</h2>
            <p className="text-[15px] leading-relaxed text-[#5c4d40] text-justify">{personal.summary}</p>
          </section>
        )}

        {experience.length > 0 && (
          <section>
            <h2 className="text-[18px] font-bold uppercase tracking-widest text-[#2c2825] mb-6 border-b border-[#e6dcd0] pb-2">İş Deneyimi</h2>
            <div className="space-y-8">
              {experience.map((exp: any, idx: number) => (
                <div key={idx}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className="text-[18px] font-bold text-[#2c2825]">{exp.title}</h3>
                    <span className="text-[13px] italic text-[#7a6552]">{exp.startDate} - {exp.current ? 'Günümüz' : exp.endDate}</span>
                  </div>
                  <div className="text-[15px] font-medium text-[#7a6552] mb-3">{exp.company}</div>
                  {exp.description && <p className="text-[14px] leading-relaxed text-[#5c4d40] text-justify whitespace-pre-line">{exp.description}</p>}
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
