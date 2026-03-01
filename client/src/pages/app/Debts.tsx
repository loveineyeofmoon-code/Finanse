import React, { useState } from 'react';
import { useDebts } from '../../hooks/useDebts';
import { formatCurrency, formatDate } from '../../utils/format';
import Modal from '../../components/Modal';
import { useNavigate } from 'react-router-dom';

const Debts: React.FC = () => {
  const { debts, create, remove } = useDebts();
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
    const amount = parseFloat(String(form.amount)) || 0;
    if (amount <= 0) return;
    await create({ ...form, amount } as any);
    setForm({ type: 'debt_income', amount: '', person: '', description: '', dueDate: '' });
    setShowAdd(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>Учет долгов</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn btn-primary" onClick={() => setShowAdd(true)}>Добавить долг</button>
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

      <div className="table-container">
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
                <td>{d.type === 'debt_income' ? 'Мне должны' : 'Я должен'}</td>
                <td>{d.person}</td>
                <td>{formatCurrency(d.amount)}</td>
                <td>{d.description || '-'}</td>
                <td>{formatDate(d.dueDate)}</td>
                <td>
                  <button className="btn btn-outline action-btn" onClick={() => remove(d.id)}>
                    Удалить
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Debts;
