import React, { useState } from 'react';
import { useTasks } from '../../hooks/useTasks';
import { useUserData } from '../../hooks/useUserData';
import { getPriorityText } from '../../utils/helpers';
import { formatDate } from '../../utils/format';
import { isLimitReached, getLimitErrorMessage, getLimitInfo } from '../../utils/subscription';
import ConfirmModal from '../../components/ConfirmModal';
import Modal from '../../components/Modal';


const Tasks: React.FC = () => {
  const { tasks, create, toggle, remove } = useTasks();
  const userData = useUserData();
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingId, setPendingId] = useState<string | null>(null);

  const confirmDelete = (id: string) => {
    setPendingId(id);
    setShowConfirm(true);
  };

  const handleConfirm = async () => {
    if (pendingId) {
      await remove(pendingId);
    }
    setShowConfirm(false);
    setPendingId(null);
  };
  const [form, setForm] = useState<{
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    dueDate: string;
  }>({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: ''
  });
  const [showAdd, setShowAdd] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLimitReached(tasks.length, userData, 'tasks')) {
      alert(getLimitErrorMessage('tasks'));
      return;
    }
    await create({ ...form, completed: false });
    setForm({ title: '', description: '', priority: 'medium', dueDate: '' });
    setShowAdd(false);
  };

  return (
    <div>
      <h2>Задачи</h2>
      <div style={{ marginBottom: '1rem', fontSize: '0.9rem', color: '#666' }}>
        {getLimitInfo(userData, tasks.length, 'tasks')}
      </div>
      <button 
        className="btn btn-primary" 
        onClick={() => {
          if (isLimitReached(tasks.length, userData, 'tasks')) {
            alert(getLimitErrorMessage('tasks'));
          } else {
            setShowAdd(true);
          }
        }}
        disabled={isLimitReached(tasks.length, userData, 'tasks')}
        style={{ marginBottom: 20 }}
      >
        Добавить задачу
      </button>
      {showAdd && (
        <Modal onClose={() => setShowAdd(false)}>
          <h2 className="modal-title">Новая задача</h2>
          <form onSubmit={handleSubmit} style={{ maxWidth: 500 }}>
        <div className="form-group">
          <label>Название</label>
          <input
            type="text"
            className="form-control"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
        </div>
        <div className="form-group">
          <label>Описание</label>
          <textarea
            className="form-control"
            rows={2}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>
        <div className="form-row">
          <div className="form-group" style={{ flex: 1 }}>
            <label>Приоритет</label>
            <select
              className="form-control"
              value={form.priority}
              onChange={(e) => setForm({ ...form, priority: e.target.value as 'low' | 'medium' | 'high' })}
            >
              <option value="low">Низкий</option>
              <option value="medium">Средний</option>
              <option value="high">Высокий</option>
            </select>
          </div>
          <div className="form-group" style={{ flex: 1 }}>
            <label>Дата выполнения</label>
            <input
              type="date"
              className="form-control"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            />
          </div>
        </div>
        <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
          Добавить задачу
        </button>
      </form>
      </Modal>
      )}

      <div className="transactions-section">
        <div className="transactions-list mobile-cards">
          {showConfirm && (
            <ConfirmModal
              message="Вы уверены, что хотите удалить задачу?"
              onConfirm={handleConfirm}
              onCancel={() => setShowConfirm(false)}
            />
          )}
          
          {/* Десктопная таблица */}
          <div className="desktop-table">
            <table>
              <thead>
                <tr>
                  <th>Название</th>
                  <th>Описание</th>
                  <th>Приоритет</th>
                  <th>Дата</th>
                  <th>Статус</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map(task => (
                  <tr key={task.id}>
                    <td>{task.title}</td>
                    <td>{task.description || '-'}</td>
                    <td>{getPriorityText(task.priority)}</td>
                    <td>{formatDate(task.dueDate)}</td>
                    <td>{task.completed ? 'Выполнено' : 'В процессе'}</td>
                    <td>
                      <div className="action-buttons">
                        <button
                          className="btn btn-outline action-btn"
                          onClick={() => toggle(task.id, !task.completed)}
                        >
                          {task.completed ? 'Возобновить' : 'Завершить'}
                        </button>
                        <button
                          className="btn btn-outline action-btn"
                          onClick={() => confirmDelete(task.id)}
                        >
                          Удалить
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Мобильные карточки */}
          <div className="transaction-cards-container">
            {tasks.map(task => (
              <div 
                key={task.id} 
                className={`transaction-card-mobile ${task.completed ? 'completed' : ''}`}
              >
                {/* Заголовок: название и статус */}
                <div className="transaction-header">
                  <div className="transaction-date">
                    <i className={`fas ${task.completed ? 'fa-check-circle' : 'fa-circle'}`}></i>
                    <span>{task.title}</span>
                  </div>
                  <div 
                    className={`transaction-type-badge ${task.priority}`}
                    style={{
                      background: task.priority === 'high' ? 'rgba(245, 101, 101, 0.1)' 
                        : task.priority === 'medium' ? 'rgba(237, 137, 54, 0.1)'
                        : 'rgba(72, 187, 120, 0.1)',
                      color: task.priority === 'high' ? 'var(--danger)'
                        : task.priority === 'medium' ? 'var(--warning)'
                        : 'var(--success)'
                    }}
                  >
                    {getPriorityText(task.priority)}
                  </div>
                </div>

                {/* Основное содержимое: описание */}
                <div className="transaction-content">
                  <div className="transaction-description">
                    <div className={`transaction-description-text ${!task.description ? 'transaction-description-empty' : ''}`}>
                      {task.description || 'Без описания'}
                    </div>
                  </div>
                  <div className="transaction-amount">
                    <div className="transaction-amount-value" style={{ 
                      color: task.completed ? 'var(--success)' : 'var(--warning)',
                      fontSize: 'var(--fs-base)'
                    }}>
                      {task.completed ? '✓ Выполнено' : 'В процессе'}
                    </div>
                  </div>
                </div>

                {/* Футер карточки: дата и действия */}
                <div className="transaction-footer">
                  <div className="transaction-category">
                    <div className="category-badge">
                      <i className="fas fa-calendar"></i>
                      <span>{formatDate(task.dueDate) || 'Без даты'}</span>
                    </div>
                  </div>
                  <div className="transaction-actions">
                    <button 
                      className="action-button btn-outline" 
                      onClick={() => toggle(task.id, !task.completed)}
                    >
                      <i className={`fas ${task.completed ? 'fa-redo' : 'fa-check'}`}></i>
                      <span>{task.completed ? 'Возобновить' : 'Готово'}</span>
                    </button>
                    <button 
                      className="action-button btn-outline" 
                      onClick={() => confirmDelete(task.id)}
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

export default Tasks;
