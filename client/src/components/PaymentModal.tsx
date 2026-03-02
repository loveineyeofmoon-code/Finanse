import React, { useState } from 'react';
import { createYooKassaPayment, checkYooKassaPaymentStatus } from '../services/payments';
import { useUserData } from '../hooks/useUserData';
import { activateSubscription } from '../services/firestore';
import Modal from './Modal';

interface Props {
  onClose: () => void;
}

const PaymentModal: React.FC<Props> = ({ onClose }) => {
  const userData = useUserData();
  const [email, setEmail] = useState(userData?.email || '');
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userData) return;
    setLoading(true);
    setPaymentStatus('Создание платежа...');
    try {
      const res = await createYooKassaPayment(email, userData.uid);
      if (res.success && res.confirmationUrl) {
        setPaymentStatus('Откробывается страница оплаты...');
        
        // Открываем в новой вкладке
        const paymentWindow = window.open(res.confirmationUrl, '_blank');
        
        // Проверяем статус платежа каждые 3 секунды (макс 30 попыток = 1.5 минуты)
        let attempts = 0;
        const checkInterval = setInterval(async () => {
          attempts++;
          if (attempts > 30 || !paymentWindow) {
            clearInterval(checkInterval);
            setPaymentStatus('');
            return;
          }
          
          try {
            const status = await checkYooKassaPaymentStatus(res.paymentId!);
            
            if (status.status === 'succeeded') {
              clearInterval(checkInterval);
              setPaymentStatus('✓ Платеж прошел успешно! Активируем подписку...');
              
              // Активируем подписку на 1 месяц
              const endDate = new Date();
              endDate.setMonth(endDate.getMonth() + 1);
              await activateSubscription(userData.uid, endDate);
              
              setPaymentStatus('✓ Подписка активирована!');
              setTimeout(() => {
                onClose();
                window.location.reload();
              }, 2000);
            }
          } catch (err) {
            console.error('Error checking payment status:', err);
          }
        }, 3000);
      }
    } catch (err: any) {
      console.error(err);
      const msg = err.message || 'Ошибка при создании платежа';
      setPaymentStatus(`Ошибка: ${msg}`);
      setLoading(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <h2 className="modal-title">Оформление подписки</h2>
      {paymentStatus && <p style={{ textAlign: 'center', color: '#4299e1', marginBottom: '1rem' }}>{paymentStatus}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email для чека</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              required
              disabled={loading}
            />{' '}
            Согласен на продление и оферту
          </label>
        </div>
        <button 
          type="submit" 
          className="btn btn-primary" 
          disabled={loading || !agree} 
          style={{ width: '100%' }}
        >
          {loading ? 'Обработка...' : 'Оплатить 199 ₽'}
        </button>
      </form>
    </Modal>
  );
};

export default PaymentModal;
