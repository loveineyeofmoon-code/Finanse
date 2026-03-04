import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useHeaderScroll } from '../hooks/useHeaderScroll';

interface HeaderProps {
  onOpenLogin?: () => void;
  onOpenRegister?: () => void;
  onOpenContact?: () => void;
  hideOnScroll?: boolean;
  onToggleHeader?: () => void;
  isHeaderVisible?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  onOpenLogin, 
  onOpenRegister, 
  onOpenContact, 
  hideOnScroll = true,
  isHeaderVisible: externalVisible
}) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  
  // На лендинге (hideOnScroll=false) или для авторизованных - не используем хук скролла
  const scrollData = !hideOnScroll ? { isHeaderVisible: true } : useHeaderScroll();
  const scrollVisible = scrollData.isHeaderVisible;
  
  // Используем внешнее значение или значение из хука
  const isHeaderVisible = externalVisible !== undefined ? externalVisible : scrollVisible;
  
  // Если hideOnScroll=false - header всегда видим и не скрывается
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
