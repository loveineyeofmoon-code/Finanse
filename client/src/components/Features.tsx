import React from 'react';

const Features: React.FC = () => (
  <section className="features">
    <div className="container">
      <h2 className="section-title">Все, что нужно для управления финансами</h2>
      <p className="section-subtitle">
        Современные инструменты для полного контроля над вашими деньгами
      </p>

      <div className="features-grid">
        <div className="feature-card">
          <div className="feature-icon">
            <i className="fas fa-chart-pie"></i>
          </div>
          <h3 className="feature-title">Умная аналитика</h3>
          <p className="feature-description">
            Наглядные графики и отчеты покажут, куда уходят ваши деньги и как
            оптимизировать расходы
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <i className="fas fa-bullseye"></i>
          </div>
          <h3 className="feature-title">Финансовые цели</h3>
          <p className="feature-description">
            Ставьте цели и отслеживайте прогресс. Накопите на мечту с помощью умного
            планирования
          </p>
        </div>

        <div className="feature-card">
          <div className="feature-icon">
            <i className="fas fa-robot"></i>
          </div>
          <h3 className="feature-title">Автоматизация</h3>
          <p className="feature-description">
            Автоматическая категоризация расходов и умные напоминания помогут не
            упустить важное
          </p>
        </div>
      </div>

      <div className="demo-preview">
        <h3>Посмотрите, как это работает</h3>
        <div className="demo-image">
          Интерфейс Money in Sight - Управляйте финансами легко
        </div>
        <p>
          Красивый и понятный интерфейс, который делает управление финансами
          простым и приятным
        </p>
      </div>
    </div>
  </section>
);

export default Features;
