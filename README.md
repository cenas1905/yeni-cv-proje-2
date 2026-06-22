# CVio — Yapay Zeka Destekli Özgeçmiş & Kariyer Koçu (MVP)

Bu proje, LinkedIn profillerinden hızlıca özgeçmiş (CV) üretebilen, AI ile bunları optimize edebilen ve süreli/kalıcı paylaşım linkleri sunan modern bir Next.js uygulamasıdır.

---

## ⚡ Hızlı Başlangıç (Hiçbir Ayar Yapmadan Test Edin!)

Projede, geliştirme sürecini kolaylaştırmak amacıyla otomatik **Simülasyon Modu (Mock Mode)** entegre edilmiştir. Eğer `.env.local` dosyasındaki API anahtarlarını boş bırakırsanız, uygulama otomatik olarak yerel veritabanı (LocalStorage) ve sahte API'ler ile çalışacaktır.

### Adım 1: Bağımlılıkları Yükleyin (Zaten yüklendi)
```bash
npm install
```

### Adım 2: Geliştirme Sunucusunu Başlatın
```bash
npm run dev
```

Ardından tarayıcınızda **[http://localhost:3000](http://localhost:3000)** adresini açarak uygulamayı hemen test edebilirsiniz!

---

## 🎨 Simülasyon Modunda Neleri Deneyebilirsiniz?
1. **Giriş / Kayıt:** İstediğiniz herhangi bir e-posta ve şifreyi girerek anında panelinize erişebilirsiniz.
2. **LinkedIn İçe Aktarma:** LinkedIn linkinizi yapıştırın (Örn: `linkedin.com/in/elonmusk` veya herhangi bir isim). AI motoru profilinizi saniyeler içinde zenginleştirilmiş verilerle simüle ederek yükleyecektir.
3. **Yapay Zeka (AI) İyileştirmesi:** "Hedef Şirket" kısmına (örn. Google) bir şirket adı yazıp "Optimize Et" butonuna bastığınızda, iş açıklamalarınızın eylem fiilleri ve ATS uyumlu kelimelerle değiştiğini görebilirsiniz.
4. **Paylaşım Linki Expiry (Süre Dolumu):** Ücretsiz üyeliklerde 7 gün sonra sona eren linklerin, süre bittiğinde kullanıcıyı nasıl ödeme/yükseltme ekranına yönlendirdiğini test edebilirsiniz.
5. **Stripe Ödeme Simülasyonu:** Panelden "Pro Sürüme Yükselt" seçeneğine tıklayarak mock kart bilgileriyle ödeme yapabilir ve Pro sürümün kilidini açabilirsiniz.

---

## 🚀 Canlı Üretime (Production) Geçiş Ayarları

Eğer gerçek API'leri bağlamak isterseniz, `.env.local` dosyasındaki alanları doldurmanız yeterlidir:

1. **Supabase Kurulumu:**
   - Supabase'de yeni bir proje oluşturun.
   - `supabase/migrations/001_init.sql` dosyasındaki SQL sorgularını Supabase SQL Editor'da çalıştırarak tabloları oluşturun.
   - Proje ayarlarındaki `URL` ve `Anon Key` değerlerini `.env.local` dosyasına yapıştırın.

2. **Stripe Kurulumu:**
   - Stripe Dashboard'a girip test/canlı mod API anahtarlarınızı ve Ürün fiyat ID'lerini `.env.local` dosyasına ekleyin.

3. **Anthropic Claude AI:**
   - Anthropic Console'dan aldığınız API anahtarını `ANTHROPIC_API_KEY` değişkenine girin.

4. **Apify LinkedIn Scraper:**
   - Apify'dan bir API Token alıp `APIFY_TOKEN` alanına ekleyin.

---
*Deployment trigger: fresh build triggered on June 22, 2026*
