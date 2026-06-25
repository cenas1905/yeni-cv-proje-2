import crypto from 'crypto';

/**
 * Generates the iyzico IYZWSv2 signature and authorization headers.
 * 
 * @param uri The request path (e.g., '/payment/iyzipos/checkoutform/initialize/auth/ecom')
 * @param body The request payload object
 * @param apiKey The merchant API Key
 * @param secretKey The merchant Secret Key
 */
export function generateIyzicoHeaders(
  uri: string,
  body: any,
  apiKey: string,
  secretKey: string
) {
  const randomString = crypto.randomBytes(16).toString('hex');
  const payloadString = body ? JSON.stringify(body) : '';
  
  // Signature creation string: randomKey + uri + requestBody
  const hashString = randomString + uri + payloadString;
  
  const signature = crypto
    .createHmac('sha256', secretKey)
    .update(hashString)
    .digest('hex');

  const authParams = [
    `apiKey:${apiKey}`,
    `randomKey:${randomString}`,
    `signature:${signature}`
  ].join('&');

  const encodedAuth = Buffer.from(authParams).toString('base64');
  
  return {
    'Authorization': `IYZWSv2 ${encodedAuth}`,
    'Content-Type': 'application/json',
    'x-iy-client-version': 'iyzipay-node-2.0.0'
  };
}

/**
 * Makes an authenticated POST request to the iyzico API.
 * 
 * @param uri The request path
 * @param body The request payload
 */
export async function makeIyzicoRequest(uri: string, body: any) {
  const apiKey = process.env.IYZICO_API_KEY;
  const secretKey = process.env.IYZICO_SECRET_KEY;
  const baseUrl = process.env.IYZICO_BASE_URL || 'https://sandbox-api.iyzipay.com';

  if (!apiKey || !secretKey) {
    throw new Error('iyzico API Key or Secret Key is not configured.');
  }

  const headers = generateIyzicoHeaders(uri, body, apiKey, secretKey);
  const response = await fetch(`${baseUrl}${uri}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`iyzico API request failed: ${response.statusText} - ${errorText}`);
  }

  return response.json();
}
