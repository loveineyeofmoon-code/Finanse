import React, { useMemo } from 'react';
import { useTransactions } from '../../hooks/useTransactions';
import { formatCurrency } from '../../utils/format';
import { getTrackingStreak } from '../../utils/streak';
import { categories } from '../../utils/categories';
import { useNavigate } from 'react-router-dom';

const DashboardHome: React.FC = () => {
  const { transactions } = useTransactions();
  const navigate = useNavigate();

  const { totalIncome, totalExpense, balance, streak } = useMemo(() => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((s, t) => s + (Number(t.amount) || 0), 0);
    const expense = transactions
      .filter(t => t.type === 'expense')
      .reduce((s, t) => s + (Number(t.amount) || 0), 0);
    const dates = transactions.map(t => t.date).filter(Boolean);
    return {
      totalIncome: income,
      totalExpense: expense,
      balance: income - expense,
      streak: getTrackingStreak(dates)
    };
  }, [transactions]);

  return (
    <div className="dashboard-home">
      <div className="page-title">
        <h2>Добро пожаловать в Money in Sight</h2>
        <div className="controls">
          <button className="btn btn-outline btn-sm" onClick={() => navigate('/app/transactions')}>
            <i className="fas fa-plus"></i>Добавить транзакцию
          </button>
          <button className="btn btn-outline btn-sm" onClick={() => navigate('/app/goals')}>
            <i className="fas fa-bullseye"></i>Добавить цель
          </button>
          <button className="btn btn-outline btn-sm" onClick={() => navigate('/app/tasks')}>
            <i className="fas fa-tasks"></i>Добавить задачу
          </button>
        </div>
      </div>
      <div className="stats-cards">
        <div className="stat-card income">
          <div className="header">
            <h3>Доходы</h3>
            <i className="fas fa-arrow-up icon"></i>
          </div>
          <div className="amount">{formatCurrency(totalIncome)}</div>
        </div>
        <div className="stat-card expense">
          <div className="header">
            <h3>Расходы</h3>
            <i className="fas fa-arrow-down icon"></i>
          </div>
          <div className="amount">{formatCurrency(totalExpense)}</div>
        </div>
        <div className="stat-card balance">
          <div className="header">
            <h3>Баланс</h3>
            <i className="fas fa-chart-line icon"></i>
          </div>
          <div className="amount">{formatCurrency(balance)}</div>
        </div>
        <div className="stat-card streak">
          <div className="header">
            <h3>Дней подряд ведёте учёт</h3>
            <i className="fas fa-fire icon"></i>
          </div>
          <div className="amount">{streak}</div>
          <div className="subtext">Текущая серия активного отслеживания</div>
        </div>
      </div>
      <div className="transactions-section">
        <div className="section-header">
          <h3>Последние транзакции</h3>
          <button className="btn btn-outline btn-sm" onClick={() => navigate('/app/transactions')}>
            <i className="fas fa-eye"></i>Все транзакции
          </button>
        </div>
        
        {transactions.length === 0 ? (
          <div className="alert alert-info">
            <div className="alert-header">
              <i className="fas fa-info-circle alert-icon"></i>
              <div className="alert-title">Нет транзакций</div>
            </div>
            <div className="alert-message">Добавьте свою первую транзакцию, чтобы начать отслеживать финансы.</div>
          </div>
        ) : (
          <div className="transactions-list mobile-cards">
            {/* Десктопная таблица */}
            <div className="desktop-table">
              <table>
                <thead>
                  <tr>
                    <th>Дата</th>
                    <th>Описание</th>
                    <th>Категория</th>
                    <th>Сумма</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.slice(0, 5).map(tx => {
                    const cat = categories.find(c => c.id === tx.categoryId);
                    const badgeColor = cat?.color || 'var(--gray)';
                    const badgeBgColor = cat?.color ? `${cat.color}15` : 'rgba(113, 128, 150, 0.1)';
                    
                    return (
                      <tr key={tx.id} className="transaction-item">
                        <td data-label="Дата" className="transaction-date">{tx.date}</td>
                        <td data-label="Описание" className="transaction-description">{tx.description || '-'}</td>
                        <td data-label="Категория" className="transaction-category">
                          <div className="table-badge category-badge" style={{ 
                            backgroundColor: badgeBgColor, 
                            color: badgeColor
                          }}>
                            <i className={cat?.icon || 'fas fa-question'}></i>
                            <span>{cat ? cat.name : '-'}</span>
                          </div>
                        </td>
                        <td data-label="Сумма" className={`transaction-amount ${tx.type === 'income' ? 'tx-income' : 'tx-expense'}`}>
                          <span className="amount-value">
                            {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            {/* Мобильные карточки */}
            <div className="transaction-cards-container">
              {transactions.slice(0, 5).map(tx => {
                const cat = categories.find(c => c.id === tx.categoryId);
                const badgeColor = cat?.color || 'var(--gray)';
                const badgeBgColor = cat?.color ? `${cat.color}15` : 'rgba(113, 128, 150, 0.1)';
                
                return (
                  <div key={tx.id} className={`transaction-card-mobile ${tx.type === 'income' ? 'income' : 'expense'}`}>
                    {/* Верхняя строка: дата и тип */}
                    <div className="transaction-header">
                      <div className="transaction-date">
                        <i className="fas fa-calendar-alt"></i>
                        <span>{tx.date}</span>
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
                    
                    {/* Футер карточки: категория */}
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
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardHome;
