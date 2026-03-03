import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useHeaderScroll } from '../hooks/useHeaderScroll';

interface HeaderProps {
  onOpenLogin?: () => void;
  onOpenRegister?: () => void;
  onOpenContact?: () => void;
  hideOnScroll?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onOpenLogin, onOpenRegister, onOpenContact, hideOnScroll = true }) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const isHeaderVisible = useHeaderScroll();
  
  const shouldHideOnScroll = hideOnScroll && !user && location.pathname === '/';
  const headerClass = shouldHideOnScroll && !isHeaderVisible ? 'hidden' : '';
  
  return (
    <header className={headerClass}>
      <div className="container">
        <div className="header-content">
          <Link to={user ? '/app' : '/'} className="logo">
            <div className="logo-icon">MS</div>
            <span>Money in Sight</span>
          </Link>

          {user ? (
            <div className="user-menu">
              <div className="user-avatar">
                {user.displayName ? user.displayName.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="user-info">
                <div className="user-name">{user.displayName || 'Пользователь'}</div>
                <div className="user-email">{user.email}</div>
              </div>
              <button className="btn btn-outline user-logout" onClick={() => logout()}>
                Выйти
              </button>
            </div>
          ) : (
            <div className="header-actions" id="headerActions">
              {onOpenContact ? (
                <button type="button" className="btn btn-outline" onClick={onOpenContact}>
                  Контакты
                </button>
              ) : (
                <Link to="/contact" className="btn btn-outline">
                  Контакты
                </Link>
              )}
              {onOpenLogin ? (
                <button type="button" className="btn btn-outline" onClick={onOpenLogin}>
                  Войти
                </button>
              ) : (
                <Link to="/login" className="btn btn-outline">
                  Войти
                </Link>
              )}
              {onOpenRegister ? (
                <button type="button" className="btn btn-primary" onClick={onOpenRegister}>
                  Начать бесплатно
                </button>
              ) : (
                <Link to="/register" className="btn btn-primary">
                  Начать бесплатно
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
