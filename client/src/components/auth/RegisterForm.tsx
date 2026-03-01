import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { createUserDocument, setVerificationCode } from '../../services/firestore';
import emailjs from '../../emailjs';

const RegisterForm: React.FC = () => {
  const { register } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const formatError = (err: any) => {
    if (err && err.code) {
      switch (err.code) {
        case 'auth/invalid-email':
          return 'Неверный формат email';
        case 'auth/email-already-in-use':
          return 'Этот email уже зарегистрирован';
        case 'auth/weak-password':
          return 'Пароль должен содержать минимум 6 символов';
        default:
          return err.message || 'Ошибка при регистрации';
      }
    }
    return err.message || String(err);
  };

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const user = await register(email, password);
      await createUserDocument(user.uid, email);

      // generate 6-digit code and save it to Firestore
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      await setVerificationCode(user.uid, code);

      // send code via EmailJS
      try {
        const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_5djp0wg';
        const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_VERIFICATION || 'template_kkzkdo5';
        const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
        
        console.log('EmailJS config:', { serviceId, templateId, publicKey: publicKey ? 'set' : 'not set' });
        console.log('Sending email to:', email, 'with code:', code);
        
        await emailjs.send(
          serviceId,
          templateId,
          {
            user_name: email.split('@')[0] || 'Пользователь',
            verification_code: code,
            to_email: email,
            to_name: email.split('@')[0] || 'Пользователь',
            email: email,
            expiry_time: new Date(Date.now() + 15 * 60 * 1000).toLocaleTimeString('ru-RU', {
              hour: '2-digit',
              minute: '2-digit',
              timeZone: 'Europe/Moscow'
            })
          }
        );
      } catch (sendErr) {
        // log but continue to verification page so user can request resend
        console.error('EmailJS send error', sendErr);
      }

      // navigate to verification page
      navigate(`/verify?uid=${user.uid}&email=${encodeURIComponent(email)}`);
    } catch (err: any) {
      setError(formatError(err));
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto' }}>
      <h2>Регистрация</h2>
      {error && <p style={{ color: 'var(--danger)' }}>{error}</p>}
      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-control"
          required
        />
      </div>
      <div className="form-group">
        <label>Пароль</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="form-control"
          required
          minLength={6}
        />
      </div>
      <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
        Зарегистрироваться
      </button>
    </form>
  );
};

export default RegisterForm;
