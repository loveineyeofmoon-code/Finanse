import React from 'react';

const Footer: React.FC = () => (
  <footer className="footer">
    <div className="container">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Money in Sight</h3>
          <p>Умный финансовый трекер для современного человека</p>
          <div className="inn">
            Аксенов Данил Владимирович<br />
            ИНН: 236905955901
          </div>
        </div>

        <div className="footer-section">
          <h3>Контакты</h3>
          <a href="mailto:aksenovvvv1804@gmail.com">aksenovvvv1804@gmail.com</a>
          <a href="/contact">Написать нам</a>
          <a href="tel:+79182466044">(918) 246 60 44</a>
          <p>Техническая поддержка: 24/7</p>
        </div>

        <div className="footer-section">
          <h3>Документы</h3>
          <a href="#" onClick={() => {}}>Пользовательское соглашение</a>
          <a href="#" onClick={() => {}}>Политика конфиденциальности</a>
          <a href="#" onClick={() => {}}>Публичная оферта</a>
          <a href="#" onClick={() => {}}>Политика возвратов</a>
        </div>

        <div className="footer-section">
          <h3>Способы оплаты</h3>
          <p>ЮMoney • Банковские карты • СБП</p>
          <div className="payment-security">
            <i className="fas fa-lock"></i>
            <p>Безопасные платежи через ЮKassa</p>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 Money in Sight. Все права защищены.</p>
        <p>Аксенов Данил Владимирович, ИНН 236905955901</p>
      </div>
    </div>
  </footer>
);

export default Footer;
