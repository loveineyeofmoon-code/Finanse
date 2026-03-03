import React from 'react';
import { useGoals } from '../../hooks/useGoals';
import { useUserData } from '../../hooks/useUserData';
import { formatCurrency, formatDate } from '../../utils/format';
import { isLimitReached, getLimitErrorMessage, getLimitInfo } from '../../utils/subscription';
import Modal from '../../components/Modal';

const Goals: React.FC = () => {
  const { goals, create, update, remove } = useGoals();
  const userData = useUserData();
  const [showModal, setShowModal] = React.useState(false);
  const [form, setForm] = React.useState({
    title: '',
    targetAmount: '',
    currentAmount: '',
    targetDate: '',
    category: 'auto'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLimitReached(goals.length, userData, 'goals')) {
      alert(getLimitErrorMessage('goals'));
      return;
    }
    const targetAmount = parseFloat(String(form.targetAmount)) || 0;
    const currentAmount = parseFloat(String(form.currentAmount)) || 0;
    if (!form.title || targetAmount <= 0) return;
    await create({ ...form, targetAmount, currentAmount, targetDate: form.targetDate } as any);
    setForm({ title: '', targetAmount: '', currentAmount: '', targetDate: '', category: 'auto' });
    setShowModal(false);
  };

  const progress = (goal: typeof goals[number]) => Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Финансовые цели</h2>
        <div style={{ marginRight: '1rem', fontSize: '0.9rem', color: '#666' }}>
          {getLimitInfo(userData, goals.length, 'goals')}
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <button 
          className="btn btn-primary" 
          onClick={() => {
            if (isLimitReached(goals.length, userData, 'goals')) {
              alert(getLimitErrorMessage('goals'));
            } else {
              setShowModal(true);
            }
          }}
          disabled={isLimitReached(goals.length, userData, 'goals')}
        >
          Добавить цель
        </button>
      </div>

      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          <h2 className="modal-title">Новая цель</h2>
          <form onSubmit={handleSubmit} style={{ maxWidth: 600 }}>
            <div className="form-group">
              <label>Название цели</label>
              <input
                type="text"
                className="form-control"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>
            <div className="form-row">
              <div className="form-group" style={{ flex: 1 }}>
                <label>Целевая сумма</label>
                <input
                  type="number"
                  className="form-control"
                  value={form.targetAmount}
                  onChange={(e) => setForm({ ...form, targetAmount: e.target.value })}
                  required
                  step="0.01"
                />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Текущие накопления</label>
                <input
                  type="number"
                  className="form-control"
                  value={form.currentAmount}
                  onChange={(e) => setForm({ ...form, currentAmount: e.target.value })}
                  step="0.01"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group" style={{ flex: 1 }}>
                <label>Дата цели</label>
                <input
                  type="date"
                  className="form-control"
                  value={form.targetDate}
                  onChange={(e) => setForm({ ...form, targetDate: e.target.value })}
                  required
                />
              </div>
              <div className="form-group" style={{ flex: 1 }}>
                <label>Категория цели</label>
                <select
                  className="form-control"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  <option value="auto">Автомобиль</option>
                  <option value="travel">Путешествие</option>
                  <option value="house">Недвижимость</option>
                  <option value="education">Образование</option>
                  <option value="other">Другое</option>
                </select>
              </div>
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Создать цель
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
                  <th>Название</th>
                  <th>Целевая</th>
                  <th>Текущая</th>
                  <th>Прогресс</th>
                  <th>Дата цели</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {goals.map(goal => (
                  <tr key={goal.id}>
                    <td>{goal.title}</td>
                    <td>{formatCurrency(goal.targetAmount)}</td>
                    <td>{formatCurrency(goal.currentAmount)}</td>
                    <td>
                      <div style={{ background: '#e2e8f0', borderRadius: 10, height: 10 }}>
                        <div
                          style={{
                            background: 'var(--primary)',
                            height: '100%',
                            borderRadius: 10,
                            width: `${progress(goal)}%`
                          }}
                        />
                      </div>
                      <div style={{ textAlign: 'center', marginTop: 5 }}>{progress(goal).toFixed(1)}%</div>
                    </td>
                    <td>{formatDate(goal.targetDate)}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn btn-outline action-btn"
                          onClick={() => {
                            const newAmt = prompt('Введите новую сумму', String(goal.currentAmount));
                            if (newAmt !== null) {
                              const val = parseFloat(newAmt);
                              if (!isNaN(val)) update(goal.id, { currentAmount: val });
                            }
                          }}
                        >💰 Добавить</button>
                        <button
                          className="btn btn-outline action-btn"
                          style={{ background: 'var(--danger)', color: 'white' }}
                          onClick={() => remove(goal.id)}
                        >🗑️ Удалить</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Мобильные карточки */}
          <div className="transaction-cards-container">
            {goals.map(goal => (
              <div key={goal.id} className="transaction-card-mobile">
                {/* Заголовок: название и категория */}
                <div className="transaction-header">
                  <div className="transaction-date">
                    <i className="fas fa-bullseye"></i>
                    <span>{goal.title}</span>
                  </div>
                </div>

                {/* Основное содержимое: целевая и текущая сумма */}
                <div className="transaction-content">
                  <div className="transaction-description">
                    <div className="transaction-description-text">
                      {formatCurrency(goal.currentAmount)}
                    </div>
                    <div style={{ fontSize: 'var(--fs-sm)', color: 'var(--gray)' }}>
                      из {formatCurrency(goal.targetAmount)}
                    </div>
                  </div>
                  <div className="transaction-amount">
                    <div className="transaction-amount-value" style={{ color: 'var(--primary)' }}>
                      {progress(goal).toFixed(1)}%
                    </div>
                  </div>
                </div>

                {/* Полоса прогресса */}
                <div style={{ marginBottom: 'var(--space-3)', paddingBottom: 'var(--space-3)', borderBottom: '1px solid rgba(0, 0, 0, 0.1)' }}>
                  <div style={{ background: '#e2e8f0', borderRadius: 10, height: 8, overflow: 'hidden' }}>
                    <div
                      style={{
                        background: 'var(--primary)',
                        height: '100%',
                        borderRadius: 10,
                        width: `${progress(goal)}%`,
                        transition: 'width 0.3s ease'
                      }}
                    />
                  </div>
                </div>

                {/* Футер карточки: дата и действия */}
                <div className="transaction-footer">
                  <div className="transaction-category">
                    <div className="category-badge">
                      <i className="fas fa-calendar"></i>
                      <span>{formatDate(goal.targetDate)}</span>
                    </div>
                  </div>
                  <div className="transaction-actions">
                    <button 
                      className="action-button btn-outline" 
                      onClick={() => {
                        const newAmt = prompt('Введите новую сумму', String(goal.currentAmount));
                        if (newAmt !== null) {
                          const val = parseFloat(newAmt);
                          if (!isNaN(val)) update(goal.id, { currentAmount: val });
                        }
                      }}
                    >
                      <i className="fas fa-plus"></i>
                      <span>Добавить</span>
                    </button>
                    <button 
                      className="action-button btn-outline" 
                      onClick={() => remove(goal.id)}
                    >
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

export default Goals;
