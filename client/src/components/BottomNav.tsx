import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

interface BottomNavProps {
  isOpen: boolean;
  onClose: () => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const [showMore, setShowMore] = useState(false);

  const mainLinks = [
    { to: '/app/transactions', label: 'Транзакции', icon: 'fas fa-exchange-alt' },
    { to: '/app/analytics', label: 'Аналитика', icon: 'fas fa-chart-pie' },
    { label: 'Ещё', icon: 'fas fa-bars', isMore: true },
  ];

  const moreLinks = [
    { to: '/app', label: 'Дашборд', icon: 'fas fa-chart-line', exact: true },
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
      {/* Semi-transparent overlay when more menu is open */}
      {showMore && (
        <div 
          className="bottom-nav-overlay"
          onClick={() => setShowMore(false)}
        />
      )}

      {/* Bottom Navigation Bar */}
      <nav className={`bottom-nav ${isOpen ? 'active' : ''}`}>
        {mainLinks.map((link, index) => (
          link.isMore ? (
            <button
              key="more"
              className={`bottom-nav-item ${showMore ? 'active' : ''}`}
              onClick={handleMoreClick}
              type="button"
            >
              <i className={link.icon}></i>
              <span>{link.label}</span>
            </button>
          ) : (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `bottom-nav-item ${isActive ? 'active' : ''}`}
              end={link.to === '/app'}
              onClick={handleLinkClick}
            >
              <i className={link.icon}></i>
              <span>{link.label}</span>
            </NavLink>
          )
        ))}
        
        {/* More menu dropdown */}
        <div className={`bottom-nav-more ${showMore ? 'open' : ''}`}>
          {moreLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) => `bottom-nav-more-item ${isActive ? 'active' : ''}`}
              end={link.exact}
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
