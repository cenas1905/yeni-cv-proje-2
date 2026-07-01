import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';

export default function TermsOfUsePage() {
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
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[#0b1c30]">Kullanım Koşulları</h1>
            <p className="text-sm text-[#76777d] mt-1">Son Güncelleme: {new Date().toLocaleDateString('tr-TR')}</p>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white border border-[#c6c6cd]/50 rounded-2xl p-8 sm:p-10 shadow-sm space-y-6 text-sm leading-relaxed text-[#45464d]">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#0b1c30]">1. Kabul Etme</h2>
            <p>
              cvio-ai.com.tr web sitesine ("Site") erişerek ve CVio ("Hizmet") platformunu kullanarak, bu Kullanım Koşullarını ve yürürlükteki tüm yasal düzenlemeleri kabul etmiş sayılırsınız. Bu koşulları kabul etmiyorsanız, Hizmet'i kullanmamanız gerekir.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#0b1c30]">2. Hizmet Tanımı ve Hesap Kullanımı</h2>
            <p>
              CVio, kullanıcıların yapay zeka yardımıyla profesyonel CV tasarımları oluşturmalarına imkan tanıyan dijital bir SaaS (Yazılım Hizmeti) platformudur. Kullanıcılar hesap güvenliğinden kendileri sorumludur ve hesaplarını yasalara aykırı, yanıltıcı veya zararlı içerik oluşturmak amacıyla kullanamazlar.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#0b1c30]">3. Fikri Mülkiyet</h2>
            <p>
              CVio platformunun yazılım kodları, tasarımı, logoları, markası ve tüm görsel arayüzü CVio Yazılım Teknolojileri A.Ş.'ye aittir. Kullanıcıların platformu kullanarak oluşturdukları CV içerikleri ve kişisel veriler ise tamamen ilgili kullanıcının kendi mülkiyetindedir.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#0b1c30]">4. Ödemeler ve Dijital Abonelik</h2>
            <p>
              Hizmet'imizin premium özellikleri (PRO plan) ücretlidir. Fiyatlandırma ve ödeme detayları "Üyelik Yükseltme" sayfasında belirtilmiştir. Ödemeler iyzico Sanal POS altyapısı üzerinden güvenli bir şekilde alınır. iyzico ödeme sisteminin kullanımından kaynaklanan kurallar ve şartlar iyzico sözleşmelerine tabidir.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#0b1c30]">5. Sorumluluk Sınırları</h2>
            <p>
              Hizmet "olduğu gibi" sunulmaktadır. Yapay zeka tarafından oluşturulan içeriklerin doğruluğu veya CV'nin iş garantisi vermesi garanti edilmez. Platformun kullanımından doğabilecek dolaylı hiçbir zarardan veya veri kayıplarından CVio sorumlu tutulamaz.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
