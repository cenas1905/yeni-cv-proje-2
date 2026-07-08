'use client';

import Link from 'next/link';
import { ArrowLeft, Mail, MapPin, Phone } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] font-sans selection:bg-[#0051d5] selection:text-white">
      <div className="max-w-[800px] mx-auto px-6 py-12">
        {/* Back */}
        <Link href="/" className="inline-flex items-center gap-2 text-[13px] font-semibold text-[#45464d] hover:text-[#0051d5] transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Ana Sayfaya Dön
        </Link>

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 bg-[#eff4ff] border border-[#0051d5]/20 rounded-lg text-[#0051d5]">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[#0b1c30]">İletişim</h1>
            <p className="text-sm text-[#76777d] mt-1">Sorularınız için bizimle iletişime geçebilirsiniz.</p>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Contact Details */}
          <div className="bg-white border border-[#c6c6cd]/50 rounded-2xl p-8 shadow-sm space-y-6">
            <h2 className="text-xl font-bold text-[#0b1c30] mb-4">Kurumsal Bilgiler</h2>
            
            <div className="flex items-start gap-4">
              <MapPin className="w-5 h-5 text-[#0051d5] shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-sm text-[#0b1c30]">Adres</h3>
                <p className="text-sm text-[#45464d] mt-1">
                  CVio Yazılım Teknolojileri A.Ş.<br />
                  Maslak Mah. Büyükdere Cad. No:235<br />
                  Sarıyer / İstanbul
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Mail className="w-5 h-5 text-[#0051d5] shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-sm text-[#0b1c30]">E-posta</h3>
                <p className="text-sm text-[#45464d] mt-1">
                  <a href="mailto:destek@cvio-ai.com.tr" className="text-[#0051d5] hover:underline">
                    destek@cvio-ai.com.tr
                  </a>
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Phone className="w-5 h-5 text-[#0051d5] shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-sm text-[#0b1c30]">Telefon</h3>
                <p className="text-sm text-[#45464d] mt-1">
                  +90 (212) 555 01 99
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-[#c6c6cd]/30 text-[11px] text-[#76777d] space-y-1">
              <p><strong>Mersis No:</strong> 0123-4567-8901-2345</p>
              <p><strong>Vergi Dairesi:</strong> Maslak Vergi Dairesi</p>
              <p><strong>Vergi No:</strong> 1234567890</p>
            </div>
          </div>

          {/* Message Form */}
          <div className="bg-white border border-[#c6c6cd]/50 rounded-2xl p-8 shadow-sm">
            <h2 className="text-xl font-bold text-[#0b1c30] mb-4">Bize Yazın</h2>
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <label className="block text-xs font-bold text-[#45464d] mb-1.5 uppercase">Adınız Soyadınız</label>
                <input type="text" className="w-full px-4 py-2.5 rounded-xl border border-[#cbd5e1] text-sm focus:outline-none focus:border-[#0051d5]" placeholder="Ahmet Yılmaz" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#45464d] mb-1.5 uppercase">E-posta Adresiniz</label>
                <input type="email" className="w-full px-4 py-2.5 rounded-xl border border-[#cbd5e1] text-sm focus:outline-none focus:border-[#0051d5]" placeholder="ahmet@example.com" required />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#45464d] mb-1.5 uppercase">Mesajınız</label>
                <textarea rows={4} className="w-full px-4 py-2.5 rounded-xl border border-[#cbd5e1] text-sm focus:outline-none focus:border-[#0051d5]" placeholder="Sorunuzu buraya yazın..." required></textarea>
              </div>
              <button type="submit" className="w-full py-3 rounded-xl bg-[#0051d5] text-white text-sm font-bold hover:bg-[#316bf3] transition-colors cursor-pointer">
                Mesajı Gönder
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
