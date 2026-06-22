'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

export type CVTemplate = 'modern' | 'minimal' | 'professional' | 'warm';

interface TemplateSelectorProps {
  selected: CVTemplate;
  onChange: (template: CVTemplate) => void;
  isPro: boolean;
}

export default function TemplateSelector({ selected, onChange, isPro }: TemplateSelectorProps) {
  const templates = [
    {
      id: 'modern' as CVTemplate,
      name: 'Modern (Mavi)',
      desc: 'Mavi renk temalı, temiz ve dinamik düzen.',
      color: 'bg-[#0051d5]',
      isFree: true
    },
    {
      id: 'minimal' as CVTemplate,
      name: 'Minimal (Klasik)',
      desc: 'Sade ve son derece okunabilir, gereksiz süslerden uzak.',
      color: 'bg-[#45464d]',
      isFree: false
    },
    {
      id: 'professional' as CVTemplate,
      name: 'Profesyonel (Kurumsal)',
      desc: 'Sol kenar vurgulu ve geleneksel kurumsal düzen.',
      color: 'bg-[#003896]',
      isFree: false
    },
    {
      id: 'warm' as CVTemplate,
      name: 'Sıcak (Tasarım)',
      desc: 'Canlı vurgularıyla şık ve prestijli tasarım.',
      color: 'bg-[#7073ff]',
      isFree: false
    }
  ];

  return (
    <div className="space-y-4" style={{ fontFamily: 'Inter, sans-serif' }}>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-[#0b1c30]">CV Şablonu Seçin</h3>
        {!isPro && (
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#f8f9ff] text-[#0051d5] border border-[#0051d5]/20">
            Pro Şablonlar Kilitli 🔒
          </span>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {templates.map((tpl) => {
          const disabled = !tpl.isFree && !isPro;
          return (
            <Card
              key={tpl.id}
              onClick={() => {
                if (!disabled) onChange(tpl.id);
              }}
              className={cn(
                "border-[#c6c6cd] bg-white cursor-pointer transition-all duration-300 hover:border-[#0051d5]/50 shadow-sm",
                selected === tpl.id && "ring-2 ring-[#0051d5] border-transparent bg-[#eff4ff]",
                disabled && "opacity-60 cursor-not-allowed hover:border-[#c6c6cd]"
              )}
            >
              <CardContent className="p-4 flex items-center space-x-3">
                <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold shrink-0 shadow-sm", tpl.color)}>
                  {tpl.name[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-bold text-[#0b1c30] truncate">{tpl.name}</p>
                    {!tpl.isFree && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#f8f9ff] text-[#0051d5] border border-[#0051d5]/20 uppercase">
                        Pro
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#76777d] line-clamp-1 mt-0.5 font-medium">{tpl.desc}</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
