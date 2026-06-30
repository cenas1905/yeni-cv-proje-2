import crypto from 'crypto';

export interface ShopierPaymentData {
  orderId: string;
  totalAmount: number;
  currency?: 0 | 1 | 2; // 0: TRY, 1: USD, 2: EUR
  productName: string;
  productType?: 1 | 2; // 1: Physical, 2: Digital
  buyer: {
    id: string;
    name: string;
    surname: string;
    email: string;
    phone: string;
  };
  billingAddress: {
    address: string;
    city: string;
    country: string;
    postcode: string;
  };
}

export function generateShopierForm(data: ShopierPaymentData, returnUrl: string): string {
  const apiKey = process.env.SHOPIER_API_KEY;
  const apiSecret = process.env.SHOPIER_API_SECRET;

  if (!apiKey || !apiSecret) {
    throw new Error('Shopier API_KEY or API_SECRET is missing in environment variables.');
  }

  const randomNr = Math.floor(Math.random() * 1000000).toString();
  const signatureString = randomNr + data.orderId + data.totalAmount + (data.currency || 0);
  
  const signature = crypto
    .createHmac('sha256', apiSecret)
    .update(signatureString)
    .digest('base64');

  const formFields = {
    API_key: apiKey,
    website_index: '1',
    platform_order_id: data.orderId,
    product_name: data.productName,
    product_type: (data.productType || 2).toString(), // Default to Digital
    buyer_name: data.buyer.name,
    buyer_surname: data.buyer.surname,
    buyer_email: data.buyer.email,
    buyer_account_age: '0',
    buyer_id_nr: data.buyer.id,
    buyer_phone: data.buyer.phone,
    billing_address: data.billingAddress.address,
    billing_city: data.billingAddress.city,
    billing_country: data.billingAddress.country,
    billing_postcode: data.billingAddress.postcode,
    shipping_address: data.billingAddress.address,
    shipping_city: data.billingAddress.city,
    shipping_country: data.billingAddress.country,
    shipping_postcode: data.billingAddress.postcode,
    total_order_value: data.totalAmount.toString(),
    currency: (data.currency || 0).toString(),
    platform: '0',
    is_in_frame: '0',
    current_language: '0',
    modul_version: '1.0.4',
    random_nr: randomNr,
    signature: signature,
    return_url: returnUrl,
    custom_return: returnUrl
  };

  const inputs = Object.entries(formFields)
    .map(([key, value]) => `<input type="hidden" name="${key}" value="${value}" />`)
    .join('\n');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Shopier Güvenli Ödeme Noktasına Yönlendiriliyorsunuz...</title>
      <meta charset="utf-8">
      <style>
        body { font-family: sans-serif; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; background: #f9fafb; margin: 0; }
        .loader { border: 4px solid #f3f3f3; border-top: 4px solid #4648d4; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin-bottom: 20px; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
      </style>
    </head>
    <body>
      <div class="loader"></div>
      <h3>Güvenli ödeme sayfasına yönlendiriliyorsunuz...</h3>
      <p>Lütfen bekleyin.</p>
      <form id="shopier_form_post" method="post" action="https://www.shopier.com/ShowProduct/api_pay4.php">
        ${inputs}
      </form>
      <script type="text/javascript">
        document.getElementById('shopier_form_post').submit();
      </script>
    </body>
    </html>
  `;
}

export function verifyShopierCallback(postData: any): boolean {
  const apiSecret = process.env.SHOPIER_API_SECRET;
  if (!apiSecret) return false;

  const { status } = postData;
  if (status !== 'success') return false;

  return true;
}
