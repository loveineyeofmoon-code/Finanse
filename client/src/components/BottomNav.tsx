import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

interface BottomNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ isOpen, onClose }) => {
  const [showMore, setShowMore] = useState(false);

  // Слева: Транзакции, По центру: Дашборд, Справа: Аналитика
  const mainLinks = [
    { to: '/app/transactions', label: 'Транзакции', icon: 'fas fa-exchange-alt', position: 'left' },
    { to: '/app', label: 'Главная', icon: 'fas fa-home', position: 'center', exact: true },
    { to: '/app/analytics', label: 'Аналитика', icon: 'fas fa-chart-pie', position: 'right' },
  ];

  // Остальные разделы в "Ещё"
  const moreLinks = [
    { to: '/app/tasks', label: 'Задачи', icon: 'fas fa-tasks' },
    { to: '/app/goals', label: 'Цели', icon: 'fas fa-bullseye' },
    { to: '/app/debts', label: 'Долги', icon: 'fas fa-hand-holding-usd' },
    { to: '/app/subscription', label: 'Подписка', icon: 'fas fa-crown' },
    { to: '/app/profile', label: 'Профиль', icon: 'fas fa-user' },
  ];

  const handleLinkClick = () => {
    onClose();
    setShowMore(false);
  };

  const handleMoreClick = () => {
    setShowMore(!showMore);
  };

  return (
    <>
      {showMore && (
        <div 
          className="bottom-nav-overlay"
          onClick={() => setShowMore(false)}
        />
      )}

      <nav className={`bottom-nav ${isOpen ? 'active' : ''}`}>
        {/* Основные ссылки */}
        <NavLink
          to="/app/transactions"
          className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
          onClick={handleLinkClick}
        >
          <i className="fas fa-exchange-alt"></i>
          <span>Транзакции</span>
        </NavLink>

        <NavLink
          to="/app"
          className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
          end
          onClick={handleLinkClick}
        >
          <i className="fas fa-home"></i>
          <span>Главная</span>
        </NavLink>

        <NavLink
          to="/app/analytics"
          className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
          onClick={handleLinkClick}
        >
          <i className="fas fa-chart-pie"></i>
          <span>Аналитика</span>
        </NavLink>

        {/* Кнопка "Ещё" */}
        <button
          className={`bottom-nav-item bottom-nav-more-btn ${showMore ? 'active' : ''}`}
          onClick={handleMoreClick}
          type="button"
        >
          <i className="fas fa-bars"></i>
          <span>Ещё</span>
        </button>
        
        {/* Выпадающее меню "Ещё" */}
        <div className={`bottom-nav-more ${showMore ? 'open' : ''}`}>
          {moreLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `bottom-nav-more-item ${isActive ? 'active' : ''}`}
              onClick={handleLinkClick}
            >
              <i className={link.icon}></i>
              <span>{link.label}</span>
            </NavLink>
          ))}
        </div>
      </nav>
    </>
  );
};

export default BottomNav;
