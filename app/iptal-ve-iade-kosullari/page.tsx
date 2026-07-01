import Link from 'next/link';
import { ArrowLeft, RotateCcw } from 'lucide-react';

export default function RefundPolicyPage() {
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
            <RotateCcw className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[#0b1c30]">İptal ve İade Koşulları</h1>
            <p className="text-sm text-[#76777d] mt-1">Son Güncelleme: {new Date().toLocaleDateString('tr-TR')}</p>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white border border-[#c6c6cd]/50 rounded-2xl p-8 sm:p-10 shadow-sm space-y-6 text-sm leading-relaxed text-[#45464d]">
          
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#0b1c30]">1. Genel İade Şartları</h2>
            <p>
              CVio üzerinden satın aldığınız premium üyelik paketleri (PRO plan) tamamen anında ifa edilen dijital bir yazılım hizmeti (SaaS) kapsamındadır. Yasal olarak dijital ürünlerde cayma hakkı bulunmamakla birlikte, kullanıcı memnuniyetini ön planda tutmaktayız.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#0b1c30]">2. Abonelik İptali</h2>
            <p>
              Aylık veya yıllık olarak satın aldığınız aboneliklerinizi dilediğiniz zaman profil ayarlarınızdan iptal edebilirsiniz. Aboneliğinizi iptal ettiğinizde, mevcut fatura döneminin sonuna kadar PRO özellikleri kullanmaya devam edersiniz ve dönem sonunda kartınızdan yeni bir çekim yapılmaz.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#0b1c30]">3. Ücret İadesi</h2>
            <p>
              Aşağıdaki koşulların sağlanması durumunda satın alma tarihinden itibaren <strong>14 gün içinde</strong> iade talebinde bulunabilirsiniz:
            </p>
            <ul className="list-disc list-inside pl-4 space-y-1">
              <li>Platformun teknik bir aksaklık sebebiyle vaat ettiği hizmeti yerine getirememesi durumunda.</li>
              <li>Abonelik satın alımı sonrası yapay zeka araçlarının hiçbir şekilde kullanılmamış olması (hiçbir CV'de yapay zeka ile içerik üretilmemiş olması) durumunda.</li>
            </ul>
            <p className="mt-2">
              İade talebinizi <strong>destek@cvio-ai.com.tr</strong> adresine kayıtlı e-postanız ve fatura bilgilerinizle birlikte iletmeniz gerekmektedir. İade onaylandığı takdirde, tutar iyzico Sanal POS üzerinden kartınıza iade edilir. İadenin kartınıza yansıması bankanıza bağlı olarak 3-10 iş günü sürebilir.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#0b1c30]">4. Kötüye Kullanım</h2>
            <p>
              Sistemimizdeki tüm özellikleri ve yapay zeka limitlerini tüketip ardından haksız iade talebinde bulunan kullanıcıların iade talepleri reddedilir ve hesapları askıya alınabilir.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
