import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const links = [
    { to: '/app', label: 'Дашборд', icon: 'fas fa-chart-line' },
    { to: '/app/transactions', label: 'Транзакции', icon: 'fas fa-exchange-alt' },
    { to: '/app/tasks', label: 'Задачи', icon: 'fas fa-tasks' },
    { to: '/app/analytics', label: 'Аналитика', icon: 'fas fa-chart-pie' },
    { to: '/app/goals', label: 'Цели', icon: 'fas fa-bullseye' },
    { to: '/app/debts', label: 'Долги', icon: 'fas fa-hand-holding-usd' },
    { to: '/app/subscription', label: 'Подписка', icon: 'fas fa-crown' },
    { to: '/app/profile', label: 'Мой профиль', icon: 'fas fa-user' }
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-title">
          <i className="fas fa-chart-line"></i>
          <span>Money in Sight</span>
        </div>
      </div>
      <ul className="sidebar-menu">
        {links.map((link) => (
          <li key={link.to}>
            <NavLink
              to={link.to}
              className={({ isActive }) => (isActive ? 'active' : '')}
              end={link.to === '/app'}
            >
              <i className={link.icon}></i>
              <span>{link.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Sidebar;
