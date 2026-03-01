import React, { useState, useEffect, useMemo } from 'react';
import { useUserData } from '../../hooks/useUserData';
import { useDebts } from '../../hooks/useDebts';
import { useGoals } from '../../hooks/useGoals';
import { useTasks } from '../../hooks/useTasks';
import { useTransactions } from '../../hooks/useTransactions';
import { useAuth } from '../../context/AuthContext';
import ConfirmModal from '../../components/ConfirmModal';
import { deleteUserDocument } from '../../services/firestore';
import { auth } from '../../firebase';
import { deleteUser } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { formatDate, formatCurrency } from '../../utils/format';
import { subscribeCards, addCard, deleteCard } from '../../services/firestore';
import { Card } from '../../types';
import { getTrackingStreak } from '../../utils/streak';

const Profile: React.FC = () => {
  const userData = useUserData();
  const { user, logout } = useAuth();
  const { transactions } = useTransactions();
  const { goals } = useGoals();
  const { debts } = useDebts();
  const { tasks } = useTasks();
  const [cards, setCards] = useState<Card[]>([]);
  const [newCard, setNewCard] = useState({ last4: '', expiry: '', holder: '' });

  useEffect(() => {
    if (!user) return;
    const unsub = subscribeCards(user.uid, setCards);
    return unsub;
  }, [user]);

  const stats = useMemo(() => {
    const income = transactions.filter(t => t.type === 'income').reduce((s, t) => s + (Number(t.amount) || 0), 0);
    const expense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + (Number(t.amount) || 0), 0);
    const streak = getTrackingStreak(transactions.map(t => t.date).filter(Boolean));
    return { income, expense, balance: income - expense, streak, goalsCount: goals.length, debtsCount: debts.length, tasksCount: tasks.length };
  }, [transactions, goals, debts, tasks]);

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    const card: Card = { id: '', last4: newCard.last4, expiry: newCard.expiry, holder: newCard.holder };
    await addCard(user.uid, card as any);
    setNewCard({ last4: '', expiry: '', holder: '' });
  };

  const navigate = useNavigate();
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [deleting, setDeleting] = React.useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error(err);
      alert('Не удалось выйти. Попробуйте ещё раз.');
      return;
    }
    navigate('/');
  };

  const handleDeleteAccount = async () => {
    if (!user) return;
    setDeleting(true);
    try {
      // delete firestore user doc
      await deleteUserDocument(user.uid);
      // delete auth user (requires recent login)
      if (auth.currentUser) {
        await deleteUser(auth.currentUser);
      }
      navigate('/');
    } catch (err: any) {
      console.error('Delete account failed', err);
      alert(err.message || 'Не удалось удалить аккаунт. Возможно, требуется повторная аутентификация.');
    } finally {
      setDeleting(false);
      setConfirmOpen(false);
    }
  };

  const handleDeleteCard = async (id: string) => {
    if (!user) return;
    await deleteCard(user.uid, id);
  };

  if (!user) return <p>Загрузка профиля...</p>;

  const displayName = userData?.name || user.displayName || user.email?.split('@')[0] || 'Пользователь';
  const displayEmail = userData?.email || user.email || '-';

  return (
    <div className="profile-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Личный кабинет</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-outline" onClick={handleLogout}>Выйти</button>
          <button className="btn" style={{ background: 'var(--danger)', color: '#fff' }} onClick={() => setConfirmOpen(true)}>Удалить аккаунт</button>
        </div>
      </div>
      <div className="stats-cards">
        <div className="stat-card">
          <h3>Основная информация</h3>
          <div>Имя: {displayName}</div>
          <div>Email: {displayEmail}</div>
          <div>Дата регистрации: {userData?.createdAt ? formatDate(userData.createdAt) : '-'}</div>
        </div>
        <div className="stat-card income">
          <h3>Общий доход</h3>
          <div className="amount">{formatCurrency(stats.income)}</div>
        </div>
        <div className="stat-card expense">
          <h3>Общий расход</h3>
          <div className="amount">{formatCurrency(stats.expense)}</div>
        </div>
        <div className="stat-card balance">
          <h3>Баланс</h3>
          <div className="amount">{formatCurrency(stats.balance)}</div>
        </div>
        <div className="stat-card streak">
          <h3>Дней подряд ведёте учёт</h3>
          <div className="amount">{stats.streak} 🔥</div>
        </div>
        <div className="stat-card">
          <h3>Активность</h3>
          <div>Целей: {stats.goalsCount} · Долгов: {stats.debtsCount} · Задач: {stats.tasksCount}</div>
        </div>
      </div>
      {confirmOpen && (
        <ConfirmModal
          message={deleting ? 'Удаление аккаунта...' : 'Вы действительно хотите удалить аккаунт? Это действие нельзя отменить.'}
          onConfirm={handleDeleteAccount}
          onCancel={() => setConfirmOpen(false)}
          confirmText="Удалить"
        />
      )}
      <div className="table-container">
        <h3>Банковские карты</h3>
        {cards.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--gray)' }}>Карты не добавлены</p>
        ) : (
          cards.map(card => (
            <div key={card.id} className="card-item">
              <div className="card-info">
                <div className="card-icon">💳</div>
                <div>
                  <div className="card-number">**** **** **** {card.last4}</div>
                  <div style={{ color: 'var(--gray)', fontSize: '0.9rem' }}>
                    {card.holder} • {card.expiry}
                  </div>
                </div>
              </div>
              <div className="card-actions">
                <button className="btn btn-outline action-btn" onClick={() => handleDeleteCard(card.id)}>
                  Удалить
                </button>
              </div>
            </div>
          ))
        )}
       
      </div>
    </div>
  );
};

export default Profile;
