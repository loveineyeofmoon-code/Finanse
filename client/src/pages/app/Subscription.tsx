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
    return '📦 План: бесплатный';
  };

  return (
    <div>
      <h2>Подписка Money in Sight</h2>
      <div style={{
        padding: '1rem',
        marginBottom: '1.5rem',
        background: '#f0f9ff',
        border: '1px solid #bfdbfe',
        borderRadius: '8px'
      }}>
        <p style={{ margin: 0 }}>{statusMessage()}</p>
      </div>

      <div style={{ marginBottom: '2rem' }}>
        <h3>Ваши текущие лимиты:</h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem'
        }}>
          <div style={{ padding: '1rem', background: '#f3f4f6', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.9rem', color: '#666' }}>Транзакции</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginTop: '0.5rem' }}>
              {currentLimits.maxTransactions === 999 ? '∞' : currentLimits.maxTransactions}
            </div>
          </div>
          <div style={{ padding: '1rem', background: '#f3f4f6', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.9rem', color: '#666' }}>Задачи</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginTop: '0.5rem' }}>
              {currentLimits.maxTasks === 999 ? '∞' : currentLimits.maxTasks}
            </div>
          </div>
          <div style={{ padding: '1rem', background: '#f3f4f6', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.9rem', color: '#666' }}>Цели</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginTop: '0.5rem' }}>
              {currentLimits.maxGoals === 999 ? '∞' : currentLimits.maxGoals}
            </div>
          </div>
          <div style={{ padding: '1rem', background: '#f3f4f6', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.9rem', color: '#666' }}>Долги</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginTop: '0.5rem' }}>
              {currentLimits.maxDebts === 999 ? '∞' : currentLimits.maxDebts}
            </div>
          </div>
          <div style={{ padding: '1rem', background: '#f3f4f6', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.9rem', color: '#666' }}>Аналитика</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginTop: '0.5rem' }}>
              {currentLimits.canUseAnalytics ? '✓' : '✗'}
            </div>
          </div>
        </div>
      </div>

      <div className="subscription-plans">
        <div className="plan-card" style={{
          opacity: currentSubscription === 'free' ? 1 : 0.7
        }}>
          <div className="plan-name">Бесплатный</div>
          <div className="plan-price">0 ₽</div>
          <div className="plan-period">навсегда</div>
          <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '1rem' }}>
            <p style={{ margin: '0.25rem 0' }}>• До 10 транзакций</p>
            <p style={{ margin: '0.25rem 0' }}>• До 5 задач</p>
            <p style={{ margin: '0.25rem 0' }}>• До 3 целей</p>
            <p style={{ margin: '0.25rem 0' }}>• ✗ Без аналитики</p>
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
          <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '1rem' }}>
            <p style={{ margin: '0.25rem 0' }}>• Безлимитные транзакции</p>
            <p style={{ margin: '0.25rem 0' }}>• Безлимитные задачи</p>
            <p style={{ margin: '0.25rem 0' }}>• Безлимитные цели</p>
            <p style={{ margin: '0.25rem 0' }}>• ✓ Полная аналитика</p>
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
          <div style={{ fontSize: '0.85rem', color: '#666', marginBottom: '1rem' }}>
            <p style={{ margin: '0.25rem 0' }}>• Безлимитные транзакции</p>
            <p style={{ margin: '0.25rem 0' }}>• Безлимитные задачи</p>
            <p style={{ margin: '0.25rem 0' }}>• Безлимитные цели</p>
            <p style={{ margin: '0.25rem 0' }}>• ✓ Полная аналитика</p>
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
