# Stripe Ödeme Altyapısı Kurulum Kılavuzu

Bu kılavuz, Burhan Kocabıyık'ın **"Sıfırdan 11 Günde Uygulama Yapıp Satıyoruz! | Gün 6: Ödeme Altyapısı"** videosundaki adımları takip ederek Stripe ödeme sistemini CVio projesine entegre etmeniz için gereken tüm adımları içerir.

---

## 1. Stripe Test Hesabı ve Ürün Tanımlaması

1. **Stripe Paneline Giriş Yapın:**
   - [Stripe Dashboard](https://dashboard.stripe.com/) adresine gidin ve hesabınız yoksa yeni bir hesap oluşturun.
   - Sol menünün altındaki veya üst bardaki **"Test Mode"** (Test Modu) anahtarını aktifleştirin. (Videoda gösterildiği gibi tüm işlemlerimizi öncelikle test modunda yapacağız).

2. **Ürün ve Fiyatları Oluşturun (Product Catalog):**
   - Stripe Dashboard'da **"Product Catalog"** (Ürün Kataloğu) sayfasına gidin (Videodaki 2:27 / 147. saniyedeki ekran).
   - **"+ Add Product"** butonuna tıklayın.
   - **Product Details:**
     - **Name (Ürün Adı):** `CVio Pro`
     - **Description (Açıklama):** `CVio Pro Sınırsız Yapay Zeka Özellikleri ve Kalıcı Bağlantı`
   - **Price Information (Fiyat Bilgisi):**
     - **Price 1 (Aylık Plan):**
       - **Pricing model:** `Flat rate`
       - **Amount:** `300` `TRY`
       - **Billing period:** `Monthly` (Aylık)
     - **Price 2 (Yıllık Plan - Opsiyonel/Önerilen):**
       - **"+ Add another price"** seçeneğine tıklayın.
       - **Amount:** `2400` `TRY`
       - **Billing period:** `Yearly` (Yıllık)
   - Sağ üstten **"Save Product"** butonuna tıklayarak ürünü kaydedin.

3. **Price ID'leri Kopyalayın:**
   - Oluşturduğunuz **CVio Pro** ürününe tıklayarak detay sayfasına gidin.
   - Sayfanın altındaki "Pricing" (Fiyatlandırma) tablosunda her fiyatın yanında `price_1P...` şeklinde başlayan bir **API ID** (Fiyat Kimliği) göreceksiniz.
   - Aylık ve Yıllık fiyatların API ID'lerini kopyalayın ve `.env.local` dosyanıza veya Vercel panelinize şu şekilde ekleyin:
     ```env
     STRIPE_PRO_MONTHLY_PRICE_ID=price_kopyalanan_aylik_id
     STRIPE_PRO_ANNUAL_PRICE_ID=price_kopyalanan_yillik_id
     ```

---

## 2. API Anahtarlarını Alın

1. Stripe panelinde sağ üstteki **"Developers"** (Geliştiriciler) sekmesine tıklayın.
2. Sol menüden **"API Keys"** seçeneğine gidin.
3. Buradaki değerleri kopyalayın:
   - **Publishable key:** `pk_test_...` (Bunu `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` olarak kaydedin).
   - **Secret key:** `sk_test_...` (Bunu `STRIPE_SECRET_KEY` olarak kaydedin).

---

## 3. Webhook Ayarları (Yerel Test ve Canlı Ortam)

Stripe üzerinden ödeme başarılı olduğunda, abonelik iptal edildiğinde veya güncellendiğinde Supabase veritabanındaki kullanıcı planını otomatik güncellemek için Stripe Webhook'larını dinlememiz gerekir.

### A. Yerel Geliştirme (Local Development) ve Stripe CLI ile Test Etme

1. **Stripe CLI Kurulumu:**
   - Bilgisayarınızda Stripe CLI yüklü değilse [Stripe CLI Installation](https://docs.stripe.com/stripe-cli) sayfasından kurun.
   - Windows için PowerShell veya CMD üzerinde:
     ```powershell
     stripe login
     ```
     yazıp tarayıcıdan giriş yapın.

2. **Webhook Yönlendirmesini Başlatın:**
   - Yerel sunucunuz çalışırken (`npm run dev`), Stripe CLI ile webhook olaylarını uygulamanıza yönlendirin:
     ```powershell
     stripe listen --forward-to localhost:3000/api/stripe/webhook
     ```
   - Terminalde size `whsec_...` ile başlayan bir webhook imza anahtarı (Webhook signing secret) verilecektir.
   - Bu anahtarı `.env.local` dosyanıza ekleyin:
     ```env
     STRIPE_WEBHOOK_SECRET=whsec_kopyalanan_webhook_imza_anahtari
     ```

3. **Test Ödemesi Gerçekleştirin:**
   - `/upgrade` sayfasına gidip bir plan seçin.
   - Stripe Checkout sayfasına yönlendirileceksiniz.
   - Kart numarası olarak `4242 4242 4242 4242` (Test Kartı), son kullanma tarihi gelecek bir tarih ve rastgele CVC girerek ödeme yapın.
   - CLI ekranında event'lerin aktığını göreceksiniz. Başarılı ödeme sonrası profiliniz otomatik olarak `pro` veya `annual` planına yükseltilecektir.

---

## 4. Vercel / Canlı Ortam Yapılandırması

Uygulamanızı Vercel gibi bir platformda canlıya aldığınızda ödemelerin çalışması için:

1. **Vercel Çevre Değişkenlerini Tanımlayın:**
   - Vercel Dashboard -> Projeniz -> Settings -> Environment Variables bölümüne giderek şu anahtarları ekleyin:
     - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
     - `STRIPE_SECRET_KEY`
     - `STRIPE_PRO_MONTHLY_PRICE_ID`
     - `STRIPE_PRO_ANNUAL_PRICE_ID`
     - `STRIPE_WEBHOOK_SECRET` (Sonraki adımda alınacak)
     - `NEXT_PUBLIC_URL` = `https://cvio-ai.com.tr`

2. **Canlı Webhook Tanımlayın:**
   - Stripe Dashboard -> Developers -> Webhooks sayfasına gidin.
   - **"Add an endpoint"** butonuna tıklayın.
   - **Endpoint URL:** `https://cvio-ai.com.tr/api/stripe/webhook`
   - **Select events:** Şu olayları seçin:
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
   - Ekledikten sonra size verilen **Signing Secret** (`whsec_...`) değerini Vercel'deki `STRIPE_WEBHOOK_SECRET` değişkenine kaydedin ve projeyi yeniden derleyin (Redeploy).

Artık CVio web siteniz hem yerel test ortamında hem de canlı sunucuda gerçek ödeme altyapısıyla çalışmaya hazırdır!
