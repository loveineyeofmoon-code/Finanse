import React, { useState } from 'react';
import { useDebts } from '../../hooks/useDebts';
import { useUserData } from '../../hooks/useUserData';
import { formatCurrency, formatDate } from '../../utils/format';
import { isLimitReached, getLimitErrorMessage, getLimitInfo } from '../../utils/subscription';
import Modal from '../../components/Modal';
import { useNavigate } from 'react-router-dom';

const Debts: React.FC = () => {
  const { debts, create, remove } = useDebts();
  const userData = useUserData();
  const navigate = useNavigate();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({
    type: 'debt_income',
    amount: '',
    person: '',
    description: '',
    dueDate: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLimitReached(debts.length, userData, 'debts')) {
      alert(getLimitErrorMessage('debts'));
      return;
    }
    const amount = parseFloat(String(form.amount)) || 0;
    if (amount <= 0) return;
    await create({ ...form, amount } as any);
    setForm({ type: 'debt_income', amount: '', person: '', description: '', dueDate: '' });
    setShowAdd(false);
  };

  return (
    <div>
      <div className="page-header">
        <h2>Учет долгов</h2>
        <div style={{ marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--gray)' }}>
          {getLimitInfo(userData, debts.length, 'debts')}
        </div>
        <div className="controls">
          <button 
            className="btn btn-primary" 
            onClick={() => {
              if (isLimitReached(debts.length, userData, 'debts')) {
                alert(getLimitErrorMessage('debts'));
              } else {
                setShowAdd(true);
              }
            }}
            disabled={isLimitReached(debts.length, userData, 'debts')}
          >
            Добавить долг
          </button>
          <button className="btn btn-outline" onClick={() => navigate('/app/profile')}>Профиль</button>
        </div>
      </div>

      {showAdd && (
        <Modal onClose={() => setShowAdd(false)}>
          <h2 className="modal-title">Новый долг</h2>
          <form onSubmit={handleSubmit} style={{ maxWidth: 500 }}>
            <div className="form-group">
              <label>Тип долга</label>
              <select
                className="form-control"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                required
              >
                <option value="debt_income">Мне должны</option>
                <option value="debt_expense">Я должен</option>
              </select>
            </div>
            <div className="form-group">
              <label>Сумма</label>
              <input
                type="number"
                className="form-control"
                value={form.amount}
                onChange={(e) => setForm({ ...form, amount: e.target.value })}
                required
                step="0.01"
              />
            </div>
            <div className="form-group">
              <label>Кто/кому</label>
              <input
                type="text"
                className="form-control"
                value={form.person}
                onChange={(e) => setForm({ ...form, person: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Описание</label>
              <input
                type="text"
                className="form-control"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Срок возврата</label>
              <input
                type="date"
                className="form-control"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Добавить
            </button>
          </form>
        </Modal>
      )}

      <div className="transactions-section">
        <div className="transactions-list mobile-cards">
          {/* Десктопная таблица */}
          <div className="desktop-table">
            <table>
              <thead>
                <tr>
                  <th>Тип</th>
                  <th>Кто/кому</th>
                  <th>Сумма</th>
                  <th>Описание</th>
                  <th>Срок</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {debts.map(d => (
                  <tr key={d.id}>
                    <td data-label="Тип">{d.type === 'debt_income' ? 'Мне должны' : 'Я должен'}</td>
                    <td data-label="Кто/кому">{d.person}</td>
                    <td data-label="Сумма">{formatCurrency(d.amount)}</td>
                    <td data-label="Описание">{d.description || '-'}</td>
                    <td data-label="Срок">{formatDate(d.dueDate)}</td>
                    <td data-label="Действия">
                      <button className="btn btn-outline action-btn" onClick={() => remove(d.id)}>
                        Удалить
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Мобильные карточки */}
          <div className="transaction-cards-container">
            {debts.map(d => (
              <div key={d.id} className={`transaction-card ${d.type === 'debt_income' ? 'income' : 'expense'}`}>
                {/* Заголовок: тип и сумма */}
                <div className="transaction-header">
                  <div className="transaction-date">
                    <i className="fas fa-user"></i>
                    <span>{d.person}</span>
                  </div>
                  <div className={`transaction-type-badge ${d.type === 'debt_income' ? 'income' : 'expense'}`}>
                    {d.type === 'debt_income' ? 'Мне должны' : 'Я должен'}
                  </div>
                </div>
                
                {/* Основное содержимое: описание и сумма */}
                <div className="transaction-content">
                  <div className="transaction-description">
                    <div className={`transaction-description-text ${!d.description ? 'transaction-description-empty' : ''}`}>
                      {d.description || 'Без описания'}
                    </div>
                  </div>
                  <div className="transaction-amount">
                    <div className={`transaction-amount-value ${d.type === 'debt_income' ? 'income' : 'expense'}`}>
                      {d.type === 'debt_income' ? '+' : '-'}{formatCurrency(d.amount)}
                    </div>
                  </div>
                </div>
                
                {/* Футер карточки: срок и действия */}
                <div className="transaction-footer">
                  <div className="transaction-category">
                    <div className="category-badge">
                      <i className="fas fa-calendar"></i>
                      <span>{formatDate(d.dueDate) || 'Без срока'}</span>
                    </div>
                  </div>
                  <div className="transaction-actions">
                    <button className="action-button btn-outline" onClick={() => remove(d.id)}>
                      <i className="fas fa-trash"></i>
                      <span>Удалить</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Debts;
