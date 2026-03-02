import React, { useEffect, useRef, useMemo } from 'react';
import { useTransactions } from '../../hooks/useTransactions';
import { useUserData } from '../../hooks/useUserData';
import { categories } from '../../utils/categories';
import { getActiveSubscriptionType } from '../../utils/subscription';
import { Chart, ChartData, ChartOptions, ArcElement, Tooltip, Legend, DoughnutController } from 'chart.js';
import { formatCurrency } from '../../utils/format';
import { useNavigate } from 'react-router-dom';

Chart.register(DoughnutController, ArcElement, Tooltip, Legend);

const Analytics: React.FC = () => {
  const { transactions } = useTransactions();
  const userData = useUserData();
  const navigate = useNavigate();
  const subscriptionType = getActiveSubscriptionType(userData);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartRef = useRef<Chart | null>(null);

  const { totalExpenses, totalIncome, expenseByCategory } = useMemo(() => {
    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((s, t) => s + (Number(t.amount) || 0), 0);
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((s, t) => s + (Number(t.amount) || 0), 0);
    const byCat: Record<string, number> = {};
    transactions
      .filter(t => t.type === 'expense')
      .forEach(tx => {
        const cat = categories.find(c => c.id === tx.categoryId);
        const name = cat ? cat.name : 'Другое';
        byCat[name] = (byCat[name] || 0) + (Number(tx.amount) || 0);
      });
    return { totalExpenses: expenses, totalIncome: income, expenseByCategory: byCat };
  }, [transactions]);

  useEffect(() => {
    if (subscriptionType === 'free' || !canvasRef.current) return;

    if (chartRef.current) {
      chartRef.current.destroy();
      chartRef.current = null;
    }

    const labels = Object.keys(expenseByCategory);
    const data = Object.values(expenseByCategory);
    const colors = labels.map((label, idx) => {
      const cat = categories.find(c => c.name === label);
      return cat ? cat.color : `hsl(${idx * 30}, 70%, 50%)`;
    });

    if (labels.length === 0) return;

    chartRef.current = new Chart(canvasRef.current, {
      type: 'doughnut',
      data: {
        labels,
        datasets: [
          { data, backgroundColor: colors, borderColor: '#fff', borderWidth: 2 }
        ]
      } as ChartData,
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: { legend: { position: 'bottom' } }
      } as ChartOptions
    });

    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
        chartRef.current = null;
      }
    };
  }, [transactions, subscriptionType]);

  return (
    <div className="analytics-page">
      <h2>Аналитика</h2>
      
      {subscriptionType === 'free' && (
        <div style={{
          padding: '1.5rem',
          marginBottom: '1.5rem',
          background: '#fef3c7',
          border: '1px solid #fcd34d',
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <p style={{ margin: '0 0 0.5rem 0' }}>📊 Аналитика доступна только для подписчиков</p>
          <p style={{ margin: '0 0 1rem 0', color: '#666' }}>Обновитесь до Премиум или используйте пробный период (14 дней бесплатно)</p>
          <button className="btn btn-primary" onClick={() => navigate('/app/subscription')}>
            Выбрать подписку
          </button>
        </div>
      )}
      
      {subscriptionType !== 'free' && (
        <>
          <div className="stats-cards">
            <div className="stat-card expense">
              <h3>Общие расходы</h3>
              <div className="amount">{formatCurrency(totalExpenses)}</div>
            </div>
            <div className="stat-card income">
              <h3>Общие доходы</h3>
              <div className="amount">{formatCurrency(totalIncome)}</div>
            </div>
            <div className="stat-card balance">
              <h3>Баланс</h3>
              <div className="amount">{formatCurrency(totalIncome - totalExpenses)}</div>
            </div>
          </div>
          <div className="table-container">
            <h3>Расходы по категориям</h3>
            {Object.keys(expenseByCategory).length === 0 ? (
              <p className="analytics-empty">Нет данных о расходах. Добавьте транзакции.</p>
            ) : (
              <div className="chart-wrapper">
                <canvas ref={canvasRef} height={250}></canvas>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Analytics;
