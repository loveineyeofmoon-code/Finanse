import React, { useState } from 'react';
import { useUserData } from '../../hooks/useUserData';
import { getActiveSubscriptionType, SUBSCRIPTION_LIMITS } from '../../utils/subscription';
import PaymentModal from '../../components/PaymentModal';

const Subscription: React.FC = () => {
  const userData = useUserData();
  const [showModal, setShowModal] = useState(false);

  if (!userData) {
    return <p>Загрузка данных...</p>;
  }

  const currentSubscription = getActiveSubscriptionType(userData);
  const currentLimits = SUBSCRIPTION_LIMITS[currentSubscription];

  const statusMessage = () => {
    if (currentSubscription === 'premium' && userData.subscriptionEndDate) {
      const now = new Date();
      const end = new Date(userData.subscriptionEndDate);
      const daysLeft = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return `✓ Премиум подписка активна (${daysLeft} дней осталось)`;
    }
    if (currentSubscription === 'trial' && userData.trialEndDate) {
      const now = new Date();
      const end = new Date(userData.trialEndDate);
      const daysLeft = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      return `🎁 Пробный период: ${daysLeft} дней осталось`;
    }
    return '📦 Бесплатный тариф';
  };

return (
    <div>
      <h2>Подписка Money in Sight</h2>
      <div className="subscription-status-card">
        <p style={{ margin: 0 }}>{statusMessage()}</p>
      </div>



<div className="subscription-plans">
        <div className="plan-card" style={{
          opacity: currentSubscription === 'free' ? 1 : 0.7
        }}>
          <div className="plan-name">Бесплатный</div>
          <div className="plan-price">0 ₽</div>
          <div className="plan-period">навсегда</div>
          <div className="plan-features">
            <p>• До 10 транзакций</p>
            <p>• До 5 задач</p>
            <p>• До 3 целей</p>
            <p>• ✗ Без аналитики</p>
          </div>
          <button className="btn btn-outline" disabled={currentSubscription !== 'free'}>
            {currentSubscription === 'free' ? 'Текущий план' : 'Понизить'}
          </button>
        </div>

        <div className="plan-card" style={{
          opacity: currentSubscription === 'trial' ? 1 : 0.7
        }}>
          <div className="plan-name">🎁 Пробный</div>
          <div className="plan-price">0 ₽</div>
          <div className="plan-period">14 дней</div>
          <div className="plan-features">
            <p>• Безлимитные транзакции</p>
            <p>• Безлимитные задачи</p>
            <p>• Безлимитные цели</p>
            <p>• ✓ Полная аналитика</p>
          </div>
          <button className="btn btn-outline" disabled={currentSubscription !== 'trial'}>
            {currentSubscription === 'trial' ? 'Активно' : 'Уже использован'}
          </button>
        </div>

        <div className="plan-card featured" style={{
          opacity: currentSubscription === 'premium' ? 1 : 0.9
        }}>
          <div className="plan-name">⭐ Премиум</div>
          <div className="plan-price">199 ₽</div>
          <div className="plan-period">в месяц</div>
          <div className="plan-features">
            <p>• Безлимитные транзакции</p>
            <p>• Безлимитные задачи</p>
            <p>• Безлимитные цели</p>
            <p>• ✓ Полная аналитика</p>
          </div>
          <button 
            className="btn btn-primary" 
            onClick={() => setShowModal(true)}
            disabled={currentSubscription === 'premium'}
          >
            {currentSubscription === 'premium' ? '✓ Активна' : 'Выбрать тариф'}
          </button>
        </div>
      </div>

      {showModal && <PaymentModal onClose={() => setShowModal(false)} />}
    </div>
  );
};

export default Subscription;
