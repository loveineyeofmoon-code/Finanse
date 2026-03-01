import React from 'react';
import { Link } from 'react-router-dom';

interface HeroProps {
  onOpenLogin?: () => void;
  onOpenRegister?: () => void;
}

const Hero: React.FC<HeroProps> = ({ onOpenLogin, onOpenRegister }) => (
  <section className="hero">
    <div className="container">
      <h1 className="hero-title">Деньги под контролем</h1>
      <p className="hero-subtitle">
        Умный финансовый трекер, который поможет вам управлять бюджетом,
        достигать целей и понимать свои финансы лучше
      </p>

      <div className="header-actions">
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
            Начать 14 дней бесплатно
          </button>
        ) : (
          <Link to="/register" className="btn btn-primary">
            Начать 14 дней бесплатно
          </Link>
        )}
      </div>

      <div className="trust-indicators">
        <div className="trust-item">
          <i className="fas fa-shield-alt"></i>
          <span>Безопасно и конфиденциально</span>
        </div>
        <div className="trust-item">
          <i className="fas fa-bolt"></i>
          <span>Мгновенная синхронизация</span>
        </div>
        <div className="trust-item">
          <i className="fas fa-mobile-alt"></i>
          <span>Доступ с любого устройства</span>
        </div>
      </div>

      <div className="hero-stats">
        <div className="hero-stat">
          <div className="hero-stat-number">98%</div>
          <div className="hero-stat-label">Довольных пользователей</div>
        </div>
        <div className="hero-stat">
          <div className="hero-stat-number">₽2.5М+</div>
          <div className="hero-stat-label">Управляемых финансов</div>
        </div>
        <div className="hero-stat">
          <div className="hero-stat-number">24/7</div>
          <div className="hero-stat-label">Поддержка</div>
        </div>
      </div>
    </div>
  </section>
);

export default Hero;
