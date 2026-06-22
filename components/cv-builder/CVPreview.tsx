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

  // Render different styling wrapper based on templates
  const getTemplateStyles = () => {
    switch (template) {
      case 'minimal':
        return {
          container: 'font-mono text-[#45464d] p-8 bg-white border border-[#c6c6cd] shadow-xl max-w-[21cm] min-h-[29.7cm] mx-auto text-xs leading-relaxed',
          header: 'border-b border-[#c6c6cd] pb-4 mb-6',
          name: 'text-2xl font-bold uppercase tracking-tight text-[#0b1c30]',
          headline: 'text-xs text-[#76777d] font-medium tracking-wide mt-1 uppercase',
          contactInfo: 'flex flex-wrap gap-x-4 gap-y-1 mt-2 text-[#76777d] text-[10px]',
          sectionTitle: 'font-bold text-[#0b1c30] border-b border-[#c6c6cd] pb-1 mb-3 uppercase tracking-wider',
          company: 'font-bold text-[#45464d]',
          date: 'text-[#76777d] font-medium text-[10px]',
          badge: 'px-2 py-0.5 border border-[#c6c6cd] rounded text-[10px] text-[#45464d] font-mono bg-[#f8f9ff]'
        };
      case 'professional':
        return {
          container: 'font-sans text-[#45464d] p-10 bg-white border border-[#c6c6cd] shadow-xl max-w-[21cm] min-h-[29.7cm] mx-auto text-sm leading-relaxed',
          header: 'border-l-4 border-[#003896] pl-4 mb-6',
          name: 'text-2xl font-extrabold text-[#0b1c30] tracking-tight',
          headline: 'text-sm text-[#003896] font-semibold mt-1',
          contactInfo: 'flex flex-wrap gap-x-4 gap-y-1 mt-2 text-[#76777d] text-xs',
          sectionTitle: 'font-extrabold text-[#0b1c30] border-b-2 border-[#003896]/20 pb-1 mb-3 text-xs uppercase tracking-wider',
          company: 'font-semibold text-[#003896]',
          date: 'text-[#76777d] font-medium text-xs',
          badge: 'px-2 py-0.5 rounded bg-[#eff4ff] text-[#003896] text-xs font-semibold border border-[#003896]/20'
        };
      case 'warm':
        return {
          container: 'font-serif text-[#45464d] p-10 bg-white border border-[#c6c6cd] shadow-xl max-w-[21cm] min-h-[29.7cm] mx-auto text-sm leading-relaxed',
          header: 'text-center border-b border-[#7073ff] pb-6 mb-6',
          name: 'text-3xl font-normal text-[#0b1c30] tracking-wide serif',
          headline: 'text-sm text-[#7073ff] italic mt-1',
          contactInfo: 'flex justify-center flex-wrap gap-x-4 gap-y-1 mt-3 text-[#76777d] text-xs',
          sectionTitle: 'font-normal text-[#7073ff] border-b border-[#7073ff]/30 pb-1 mb-3 text-sm tracking-wider uppercase',
          company: 'font-medium text-[#0b1c30] italic',
          date: 'text-[#7073ff] italic text-xs',
          badge: 'px-2.5 py-0.5 rounded-full bg-[#f8f9ff] text-[#7073ff] text-xs font-medium border border-[#7073ff]/30'
        };
      case 'modern':
      default:
        return {
          container: 'font-sans text-[#45464d] p-10 bg-white border border-[#c6c6cd] shadow-xl max-w-[21cm] min-h-[29.7cm] mx-auto text-sm leading-relaxed',
          header: 'border-b-2 border-[#0051d5] pb-5 mb-6',
          name: 'text-3xl font-black text-[#0b1c30] tracking-tight',
          headline: 'text-base text-[#0051d5] font-bold tracking-wide mt-1',
          contactInfo: 'flex flex-wrap gap-x-4 gap-y-1 mt-3 text-[#76777d] text-xs font-medium',
          sectionTitle: 'font-black text-[#0b1c30] border-b border-[#c6c6cd] pb-1.5 mb-4 text-xs uppercase tracking-wider',
          company: 'font-semibold text-[#0b1c30]',
          date: 'text-[#76777d] font-medium text-xs',
          badge: 'px-2.5 py-1 rounded-md bg-[#eff4ff] text-[#0051d5] text-xs font-bold border border-[#0051d5]/20'
        };
    }
  };

  const styles = getTemplateStyles();

  const renderHeader = () => {
    if (template === 'warm') {
      return (
        <div className={styles.header}>
          {personal.photo && (
            <div className="flex justify-center mb-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={personal.photo} alt="Profile" className="w-24 h-24 rounded-full object-cover border-2 border-[#7073ff] shadow-sm" />
            </div>
          )}
          <h1 className={styles.name}>{personal.fullName || 'Ad Soyad'}</h1>
          {personal.headline && <p className={styles.headline}>{personal.headline}</p>}
          <div className={styles.contactInfo}>
            {personal.email && (
              <span className="flex items-center gap-1">
                <span>✉</span> {personal.email}
              </span>
            )}
            {personal.location && (
              <span className="flex items-center gap-1">
                <span>📍</span> {personal.location}
              </span>
            )}
            {personal.linkedin && (
              <span className="flex items-center gap-1">
                <span>🔗</span> {personal.linkedin}
              </span>
            )}
          </div>
        </div>
      );
    }

    // For modern, professional, minimal:
    let photoContainerClass = '';
    if (template === 'professional') {
      photoContainerClass = 'w-20 h-20 rounded-full border-2 border-[#003896]/20 overflow-hidden shrink-0';
    } else if (template === 'minimal') {
      photoContainerClass = 'w-20 h-20 rounded-lg border border-[#c6c6cd] overflow-hidden shrink-0';
    } else { // modern
      photoContainerClass = 'w-20 h-20 rounded-xl border-2 border-[#0051d5]/20 overflow-hidden shrink-0';
    }

    return (
      <div className={styles.header}>
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1">
            <h1 className={styles.name}>{personal.fullName || 'Ad Soyad'}</h1>
            {personal.headline && <p className={styles.headline}>{personal.headline}</p>}
            <div className={styles.contactInfo}>
              {personal.email && (
                <span className="flex items-center gap-1">
                  <span>✉</span> {personal.email}
                </span>
              )}
              {personal.location && (
                <span className="flex items-center gap-1">
                  <span>📍</span> {personal.location}
                </span>
              )}
              {personal.linkedin && (
                <span className="flex items-center gap-1">
                  <span>🔗</span> {personal.linkedin}
                </span>
              )}
            </div>
          </div>
          {personal.photo && (
            <div className={photoContainerClass}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={personal.photo} alt="Profile" className="w-full h-full object-cover" />
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      {renderHeader()}

      {/* Summary */}
      {personal.summary && (
        <div className="mb-6">
          <h2 className={styles.sectionTitle}>Özet</h2>
          <p className="text-[#45464d] text-justify text-xs whitespace-pre-line">{personal.summary}</p>
        </div>
      )}

      {/* Experience */}
      {experience && experience.length > 0 && (
        <div className="mb-6">
          <h2 className={styles.sectionTitle}>Deneyim</h2>
          <div className="space-y-4">
            {experience.map((exp: any, idx: number) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-bold text-[#0b1c30]">{exp.title}</span>
                    <span className="text-[#c6c6cd] mx-1.5">|</span>
                    <span className={styles.company}>{exp.company}</span>
                  </div>
                  <span className={styles.date}>
                    {exp.startDate} - {exp.current ? 'Günümüz' : exp.endDate}
                  </span>
                </div>
                {exp.location && <p className="text-[#76777d] text-xs">{exp.location}</p>}
                {exp.description && (
                  <p className="text-[#45464d] text-xs text-justify whitespace-pre-line mt-1">
                    {exp.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education */}
      {education && education.length > 0 && (
        <div className="mb-6">
          <h2 className={styles.sectionTitle}>Eğitim</h2>
          <div className="space-y-3">
            {education.map((edu: any, idx: number) => (
              <div key={idx} className="space-y-0.5">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-bold text-[#0b1c30]">{edu.school}</span>
                    {edu.degree && (
                      <>
                        <span className="text-[#c6c6cd] mx-1.5">|</span>
                        <span className="font-medium text-[#45464d]">
                          {edu.degree}{edu.field ? ` (${edu.field})` : ''}
                        </span>
                      </>
                    )}
                  </div>
                  <span className={styles.date}>
                    {edu.startYear} - {edu.endYear}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Certifications */}
      {certifications && certifications.length > 0 && (
        <div className="mb-6">
          <h2 className={styles.sectionTitle}>Sertifikalar</h2>
          <div className="space-y-3">
            {certifications.map((cert: any, idx: number) => (
              <div key={idx} className="space-y-0.5">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-bold text-[#0b1c30]">{cert.name}</span>
                    {cert.issuer && (
                      <>
                        <span className="text-[#c6c6cd] mx-1.5">|</span>
                        <span className="font-medium text-[#45464d]">{cert.issuer}</span>
                      </>
                    )}
                  </div>
                  {cert.date && <span className={styles.date}>{cert.date}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Skills */}
      {skills && skills.length > 0 && (
        <div>
          <h2 className={styles.sectionTitle}>Yetenekler</h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill: string, idx: number) => (
              <span key={idx} className={styles.badge}>
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
