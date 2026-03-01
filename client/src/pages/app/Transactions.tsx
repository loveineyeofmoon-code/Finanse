import React, { useState } from 'react';
import { useTransactions } from '../../hooks/useTransactions';
import { categories } from '../../utils/categories';
import { formatCurrency, formatDate } from '../../utils/format';
import Modal from '../../components/Modal';
import { useNavigate } from 'react-router-dom';

const Transactions: React.FC = () => {
  const { transactions, create, remove } = useTransactions();
  const navigate = useNavigate();
  const [showAdd, setShowAdd] = useState(false);
  const [formData, setFormData] = useState({
    type: 'expense',
    amount: '',
    categoryId: categories.find(c => c.type === 'expense')?.id || 1,
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = Number(formData.amount);
    if (isNaN(amount) || amount <= 0) return;
    try {
      await create({ ...formData, amount } as any);
      setFormData({ ...formData, amount: '', description: '' });
      setShowAdd(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h2>Транзакции</h2>
        <div className="controls">
          <button className="btn btn-primary" onClick={() => setShowAdd(true)}>Добавить транзакцию</button>
          <button className="btn btn-outline" onClick={() => navigate('/app/analytics')}>Аналитика</button>
        </div>
      </div>

      {showAdd && (
          <Modal onClose={() => setShowAdd(false)}>
          <h2 className="modal-title">Новая транзакция</h2>
          <form onSubmit={handleSubmit} className="modal-form">
            <div className="form-group">
              <label>Тип</label>
              <select
                className="form-control"
                value={formData.type}
                onChange={(e) => {
                  const type = e.target.value;
                  setFormData({
                    ...formData,
                    type,
                    categoryId:
                      categories.find(c => c.type === type)?.id || categories[0].id
                  });
                }}
              >
                <option value="income">Доход</option>
                <option value="expense">Расход</option>
              </select>
            </div>
            <div className="form-group">
              <label>Сумма</label>
              <input
                type="number"
                className="form-control"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                required
                step="0.01"
              />
            </div>
            <div className="form-group">
              <label>Категория</label>
              <select
                className="form-control"
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: parseInt(e.target.value || '0') })}
                required
              >
                {categories
                  .filter(c => c.type === formData.type)
                  .map(c => (
                    <option key={c.id} value={c.id}>
                      {c.icon} {c.name}
                    </option>
                  ))}
              </select>
            </div>
            <div className="form-group">
              <label>Описание</label>
              <input
                type="text"
                className="form-control"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Дата</label>
              <input
                type="date"
                className="form-control"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
            <button type="submit" className="btn btn-primary full-width">
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
                  <th>Дата</th>
                  <th>Тип</th>
                  <th>Описание</th>
                  <th>Категория</th>
                  <th>Сумма</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map(tx => {
                  const cat = categories.find(c => c.id === tx.categoryId);
                  const badgeColor = cat?.color || 'var(--gray)';
                  const badgeBgColor = cat?.color ? `${cat.color}15` : 'rgba(113, 128, 150, 0.1)';
                  
                  return (
                    <tr key={tx.id} className="transaction-item">
                      <td data-label="Дата" className="transaction-date">{formatDate(tx.date)}</td>
                      <td data-label="Тип" className="transaction-type">
                        <span className={`type-badge ${tx.type === 'income' ? 'badge-income' : 'badge-expense'}`}>
                          {tx.type === 'income' ? 'Доход' : 'Расход'}
                        </span>
                      </td>
                      <td data-label="Описание" className="transaction-description">{tx.description || '-'}</td>
                      <td data-label="Категория" className="transaction-category">
                        <div className="table-badge category-badge" style={{ 
                          backgroundColor: badgeBgColor, 
                          color: badgeColor
                        }}>
                          <i className={cat?.icon || 'fas fa-question'}></i>
                          <span>{cat ? cat.name : 'Неизвестно'}</span>
                        </div>
                      </td>
                      <td data-label="Сумма" className={`transaction-amount ${tx.type === 'income' ? 'tx-income' : 'tx-expense'}`}>
                        <span className="amount-value">
                          {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                        </span>
                      </td>
                      <td data-label="Действия" className="transaction-actions">
                        <button className="btn btn-outline action-btn" onClick={() => remove(tx.id)}>
                          <i className="fas fa-trash"></i>
                          <span className="action-text">Удалить</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          
          {/* Мобильные карточки */}
          <div className="transaction-cards-container">
            {transactions.map(tx => {
              const cat = categories.find(c => c.id === tx.categoryId);
              const badgeColor = cat?.color || 'var(--gray)';
              const badgeBgColor = cat?.color ? `${cat.color}15` : 'rgba(113, 128, 150, 0.1)';
              
              return (
                <div key={tx.id} className={`transaction-card-mobile ${tx.type === 'income' ? 'income' : 'expense'}`}>
                  {/* Верхняя строка: дата и тип */}
                  <div className="transaction-header">
                    <div className="transaction-date">
                      <i className="fas fa-calendar-alt"></i>
                      <span>{formatDate(tx.date)}</span>
                    </div>
                    <div className={`transaction-type-badge ${tx.type}`}>
                      {tx.type === 'income' ? 'Доход' : 'Расход'}
                    </div>
                  </div>
                  
                  {/* Основное содержимое: описание и сумма */}
                  <div className="transaction-content">
                    <div className="transaction-description">
                      <div className={`transaction-description-text ${!tx.description ? 'transaction-description-empty' : ''}`}>
                        {tx.description || 'Без описания'}
                      </div>
                    </div>
                    <div className="transaction-amount">
                      <div className={`transaction-amount-value ${tx.type}`}>
                        {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                      </div>
                    </div>
                  </div>
                  
                  {/* Футер карточки: категория и действия */}
                  <div className="transaction-footer">
                    <div className="transaction-category">
                      <div className="category-badge" style={{ 
                        backgroundColor: badgeBgColor, 
                        color: badgeColor
                      }}>
                        <i className={cat?.icon || 'fas fa-question'}></i>
                        <span>{cat ? cat.name : 'Без категории'}</span>
                      </div>
                    </div>
                    <div className="transaction-actions">
                      <button className="action-button btn-outline" onClick={() => remove(tx.id)}>
                        <i className="fas fa-trash"></i>
                        <span>Удалить</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Transactions;
