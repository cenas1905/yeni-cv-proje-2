import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';

export default function PrivacyPolicyPage() {
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
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-[#0b1c30]">Gizlilik Politikası</h1>
            <p className="text-sm text-[#76777d] mt-1">Son Güncelleme: {new Date().toLocaleDateString('tr-TR')}</p>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white border border-[#c6c6cd]/50 rounded-2xl p-8 sm:p-10 shadow-sm space-y-6 text-sm leading-relaxed text-[#45464d]">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#0b1c30]">1. Giriş</h2>
            <p>
              CVio ("Platform"), kullanıcılarımızın gizliliğini korumayı taahhüt eder. Bu Gizlilik Politikası, web sitemiz (cvio-ai.com.tr) üzerinden CV oluşturma, düzenleme ve yapay zeka entegrasyonu hizmetlerimizi kullanırken kişisel verilerinizin nasıl toplandığını, işlendiğini ve korunduğunu açıklar.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#0b1c30]">2. Toplanan Veriler</h2>
            <p>
              Platformumuzu kullandığınızda aşağıdaki veriler toplanmaktadır:
            </p>
            <ul className="list-disc list-inside pl-4 space-y-1">
              <li><strong>Hesap Bilgileri:</strong> E-posta adresiniz, adınız, soyadınız.</li>
              <li><strong>CV İçeriği:</strong> İş deneyimleri, eğitim geçmişi, yetenekler, kişisel özet, sertifikalar ve CV'ye eklediğiniz diğer kariyer verileri.</li>
              <li><strong>Kullanım Verileri:</strong> Sayfa görüntülemeleri, analitik veriler, IP adresi ve cihaz bilgileri.</li>
              <li><strong>Ödeme Bilgileri:</strong> Ödemeleriniz iyzico güvencesiyle doğrudan iyzico altyapısında gerçekleşmektedir. Kredi kartı bilgileriniz hiçbir şekilde sunucularımızda saklanmaz.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#0b1c30]">3. Verilerin Kullanım Amacı</h2>
            <p>
              Toplanan kişisel verileriniz şu amaçlarla işlenmektedir:
            </p>
            <ul className="list-disc list-inside pl-4 space-y-1">
              <li>CV oluşturma, düzenleme ve indirme süreçlerinin yürütülmesi.</li>
              <li>Yapay zeka modellerimiz (Gemini/OpenAI) yardımıyla CV içeriklerinin iyileştirilmesi.</li>
              <li>Hesap güvenliğinin sağlanması ve teknik destek sunulması.</li>
              <li>iyzico üzerinden yasal faturalandırma işlemlerinin yapılması.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#0b1c30]">4. Veri Güvenliği ve Paylaşımı</h2>
            <p>
              Verileriniz güvenli bulut altyapılarında (Supabase) şifrelenmiş olarak saklanır. CV içeriklerinizi iyileştirmek amacıyla verileriniz yapay zeka API sağlayıcılarına (Google Gemini / OpenAI) anonimleştirilerek gönderilebilir. Kişisel verileriniz hiçbir üçüncü şahsa reklam veya pazarlama amacıyla satılmaz veya devredilmez.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-[#0b1c30]">5. Kullanıcı Hakları (KVKK)</h2>
            <p>
              6698 sayılı Kişisel Verilerin Korunması Kanunu (KVKK) uyarınca, verilerinizin silinmesini, güncellenmesini veya işlenip işlenmediğini öğrenmeyi talep etme hakkınız vardır. Bu talepleriniz için bizimle <strong>destek@cvio-ai.com.tr</strong> adresi üzerinden iletişime geçebilirsiniz.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
