import Link from 'next/link';
import { ArrowLeft, Scale } from 'lucide-react';

export default function DistanceSalesAgreementPage() {
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
            <Scale className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[#0b1c30]">Mesafeli Satış Sözleşmesi</h1>
            <p className="text-sm text-[#76777d] mt-1">Son Güncelleme: {new Date().toLocaleDateString('tr-TR')}</p>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white border border-[#c6c6cd]/50 rounded-2xl p-8 sm:p-10 shadow-sm space-y-6 text-sm leading-relaxed text-[#45464d]">
          
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#0b1c30]">1. Taraflar</h2>
            <div className="space-y-2">
              <p><strong>SATICI:</strong></p>
              <ul className="list-none pl-4 space-y-1">
                <li><strong>Unvan:</strong> CVio Yazılım Teknolojileri A.Ş.</li>
                <li><strong>Adres:</strong> Maslak Mah. Büyükdere Cad. No:235 Şişli / İstanbul</li>
                <li><strong>E-posta:</strong> destek@cvio-ai.com.tr</li>
                <li><strong>Web Adresi:</strong> cvio-ai.com.tr</li>
              </ul>
              <p className="mt-4"><strong>ALICI (Tüketici):</strong></p>
              <p className="pl-4">
                CVio platformuna üye olan ve ödeme yaparak dijital hizmet (PRO plan) satın alan gerçek veya tüzel kişi.
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#0b1c30]">2. Sözleşmenin Konusu</h2>
            <p>
              İşbu Sözleşmenin konusu, ALICI'nın SATICI'ya ait cvio-ai.com.tr internet sitesinden elektronik ortamda sipariş verdiği, nitelikleri ve satış fiyatı belirtilen "CVio PRO Dijital Üyelik" hizmetinin satışı ve teslimi ile ilgili olarak 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri gereğince tarafların hak ve yükümlülüklerinin saptanmasıdır.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#0b1c30]">3. Hizmetin Nitelikleri ve Fiyatı</h2>
            <p>
              Sözleşme konusu hizmet, yapay zeka destekli CV oluşturma platformuna erişim sağlayan dijital PRO üyelik aboneliğidir. Fiyatlar aylık veya yıllık paketler olarak satın alma ekranında gösterilmekte olup, KDV dahil fiyatlar üzerinden iyzico Sanal POS aracılığıyla tahsil edilir.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#0b1c30]">4. Teslimat Şekli</h2>
            <p>
              Sözleşme konusu hizmet, tamamen dijital ortamda sunulan bir yazılım hizmeti (SaaS) olduğundan, kargo veya fiziksel teslimat yapılmamaktadır. Ödemenin iyzico üzerinden başarıyla gerçekleşmesiyle birlikte ALICI'nın hesabı otomatik olarak PRO statüsüne yükseltilir ve hizmet anında teslim edilmiş sayılır.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#0b1c30]">5. Cayma Hakkı</h2>
            <p>
              Mesafeli Sözleşmeler Yönetmeliği'nin 15. maddesinin 1. fıkrasının (ğ) bendi uyarınca, <strong>"elektronik ortamda anında ifa edilen hizmetler veya tüketiciye anında teslim edilen gayrimaddi mallara ilişkin sözleşmeler"</strong> cayma hakkının istisnaları kapsamında yer almaktadır. 
            </p>
            <p>
              Dolayısıyla, hizmet elektronik ortamda anında ifa edildiğinden ve teslimatı anında gerçekleştiğinden cayma hakkı bulunmamaktadır. Ancak CVio olarak müşteri memnuniyeti kapsamında belirli durumlarda destek ekibimiz üzerinden kısmi veya tam iade taleplerini değerlendirmekteyiz.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#0b1c30]">6. Uyuşmazlıkların Çözümü</h2>
            <p>
              İşbu sözleşmenin uygulanmasında, Tüketici Hakem Heyetleri ile SATICI'nın yerleşim yerindeki Tüketici Mahkemeleri yetkilidir.
            </p>
          </section>

        </div>
      </div>
    </div>
  );
}
