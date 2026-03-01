import React, { useState } from 'react';
import { createYooKassaPayment } from '../services/payments';
import { useUserData } from '../hooks/useUserData';
import Modal from './Modal';

interface Props {
  onClose: () => void;
}

const PaymentModal: React.FC<Props> = ({ onClose }) => {
  const userData = useUserData();
  const [email, setEmail] = useState(userData?.email || '');
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userData) return;
    setLoading(true);
    try {
      const res = await createYooKassaPayment(email, userData.uid);
      if (res.success && res.confirmationUrl) {
        window.open(res.confirmationUrl, '_blank');
        onClose();
      }
    } catch (err) {
      console.error(err);
      alert('Ошибка при создании платежа');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal onClose={onClose}>
      <h2 className="modal-title">Оформление подписки</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Email для чека</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>
            <input
              type="checkbox"
              checked={agree}
              onChange={(e) => setAgree(e.target.checked)}
              required
            />{' '}
            Согласен на продление и оферту
          </label>
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading || !agree} style={{ width: '100%' }}>
          {loading ? 'Создание...' : 'Оплатить 199 ₽'}
        </button>
      </form>
    </Modal>
  );
};

export default PaymentModal;
