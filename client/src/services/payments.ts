import { createPaymentRecord, updatePaymentStatus, getPaymentByYookassaId } from './firestore';

export interface YooKassaPaymentResponse {
  success: boolean;
  paymentId?: string;
  confirmationUrl?: string;
  status?: string;
  recordId?: string; // ID в БД
}

export async function createYooKassaPayment(
  email: string,
  userId: string
): Promise<YooKassaPaymentResponse> {
  const orderId = 'ms_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  const paymentData = {
    amount: { value: '199.00', currency: 'RUB' },
    payment_method_data: { type: 'bank_card' },
    confirmation: { type: 'redirect', return_url: window.location.origin },
    description: 'Премиум подписка Money in Sight - 1 месяц',
    metadata: { userId, userEmail: email, orderId, product: 'premium_subscription_monthly' },
    capture: true,
    receipt: {
      customer: { email },
      items: [
        {
          description: 'Премиум подписка Money in Sight (1 месяц)',
          quantity: '1',
          amount: { value: '199.00', currency: 'RUB' },
          vat_code: 1,
          payment_mode: 'full_payment',
          payment_subject: 'service'
        }
      ]
    }
  };

  const response = await fetch('/.netlify/functions/create-payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ paymentData, idempotenceKey: orderId })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }

  const text = await response.text();
  console.log('create-payment response status', response.status, 'body', text);
  if (!text) {
    throw new Error(`Empty response from payment service (status ${response.status})`);
  }

  let json;
  try {
    json = JSON.parse(text);
  } catch (e) {
    throw new Error(`Failed to parse payment response: ${text}`);
  }

  if (json.error) {
    throw new Error(`Payment service error: ${json.error.description || json.error.message}`);
  }

  // Сохраняем платеж в БД
  const recordId = await createPaymentRecord(
    userId,
    json.id,
    199,
    email,
    orderId,
    json.status || 'pending'
  );

  return {
    success: true,
    paymentId: json.id,
    recordId,
    confirmationUrl: json.confirmation?.confirmation_url,
    status: json.status
  };
}

export async function checkYooKassaPaymentStatus(paymentId: string) {
  const response = await fetch(`/.netlify/functions/check-payment?paymentId=${paymentId}`);
  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`HTTP ${response.status}: ${errorText}`);
  }
  const text = await response.text();
  if (!text) {
    throw new Error('Empty response from payment status service');
  }
  try {
    return JSON.parse(text);
  } catch (e) {
    throw new Error(`Failed to parse payment status response: ${text}`);
  }
}

export async function verifyPaymentCompletion(yookassaPaymentId: string): Promise<boolean> {
  const status = await checkYooKassaPaymentStatus(yookassaPaymentId);
  return status.status === 'succeeded';
}
