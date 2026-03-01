export interface YooKassaPaymentResponse {
  success: boolean;
  paymentId?: string;
  confirmationUrl?: string;
  status?: string;
}

export async function createYooKassaPayment(email: string, userId: string): Promise<YooKassaPaymentResponse> {
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
      items: [{
        description: 'Премиум подписка Money in Sight (1 месяц)',
        quantity: '1',
        amount: { value: '199.00', currency: 'RUB' },
        vat_code: 1,
        payment_mode: 'full_payment',
        payment_subject: 'service'
      }]
    }
  };

  const response = await fetch('/.netlify/functions/create-payment', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ paymentData, idempotenceKey: orderId })
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const json = await response.json();
  return {
    success: true,
    paymentId: json.id,
    confirmationUrl: json.confirmation?.confirmation_url,
    status: json.status
  };
}

export async function checkYooKassaPaymentStatus(paymentId: string) {
  const response = await fetch(`/.netlify/functions/check-payment?paymentId=${paymentId}`);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return response.json();
}
