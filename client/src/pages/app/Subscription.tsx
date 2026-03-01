import React, { useState } from 'react';
import { useUserData } from '../../hooks/useUserData';
import PaymentModal from '../../components/PaymentModal';

const Subscription: React.FC = () => {
  const userData = useUserData();
  const [showModal, setShowModal] = useState(false);

  if (!userData) {
    return <p>Загрузка данных...</p>;
  }

  const statusMessage = () => {
    if (userData.subscription === 'premium' && userData.subscriptionActive) {
      return 'Премиум подписка активна';
    }
    if (userData.subscription === 'trial' && userData.trialEndDate) {
      const now = new Date();
      const end = new Date(userData.trialEndDate);
      if (now < end) {
        const days = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        return `Пробный период: ${days} дней`; 
      }
    }
    return 'План: бесплатный';
  };

  return (
    <div>
      <h2>Подписка Money in Sight</h2>
      <p>{statusMessage()}</p>
      <div className="subscription-plans">
        <div className="plan-card">
          <div className="plan-name">Бесплатный</div>
          <div className="plan-price">0 ₽</div>
          <div className="plan-period">навсегда</div>
          <button className="btn btn-outline" disabled>
            Текущий план
          </button>
        </div>
        <div className="plan-card featured">
          <div className="plan-name">Премиум</div>
          <div className="plan-price">199 ₽</div>
          <div className="plan-period">в месяц</div>
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            Выбрать тариф
          </button>
        </div>
      </div>
      {showModal && <PaymentModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default Subscription;
