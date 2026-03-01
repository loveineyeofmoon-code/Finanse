import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { verifyVerificationCode, setVerificationCode } from '../services/firestore';
import emailjs from '../emailjs';

const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const uid = searchParams.get('uid') || '';
  const email = searchParams.get('email') || '';
  const [code, setCode] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle'|'verifying'|'verified'|'error'>('idle');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setStatus('verifying');
    try {
      await verifyVerificationCode(uid, code);
      setStatus('verified');
      navigate('/app');
    } catch (err: any) {
      setError(err.message || String(err));
      setStatus('error');
    }
  };

  const handleResend = async () => {
    if (!uid || !email) return;
    const newCode = Math.floor(100000 + Math.random() * 900000).toString();
    try {
      await setVerificationCode(uid, newCode);
      
      const serviceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || 'service_5djp0wg';
      const templateId = import.meta.env.VITE_EMAILJS_TEMPLATE_VERIFICATION || 'template_kkzkdo5';
      const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;
      
      console.log('Resend EmailJS config:', { serviceId, templateId, publicKey: publicKey ? 'set' : 'not set' });
      console.log('Resending email to:', email, 'with code:', newCode);
      
      await emailjs.send(
        serviceId,
        templateId,
        {
          user_name: email.split('@')[0] || 'Пользователь',
          verification_code: newCode,
          to_email: email,
          expiry_time: new Date(Date.now() + 15 * 60 * 1000).toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit',
            timeZone: 'Europe/Moscow'
          })
        }
      );
    } catch (err: any) {
      console.error('Resend failed', err);
      // EmailJS returns an object with status/text on failure
      if (err && err.status) {
        setError(`Не удалось отправить код. EmailJS: ${err.status} ${err.text || ''}`);
      } else {
        setError('Не удалось отправить код. Попробуйте позже.');
      }
    }
  };

  return (
    <div className="auth-page">
      <Header />
      <div className="auth-content">
        <div className="auth-box">
          <h2>Подтвердите почту</h2>
          <p>Мы отправили код на <strong>{email}</strong>. Введите код ниже.</p>
          {error && <p style={{ color: 'var(--danger)' }}>{error}</p>}
          <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: '0 auto' }}>
            <div className="form-group">
              <label>Код подтверждения</label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="form-control"
                required
              />
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
              Подтвердить
            </button>
          </form>
          <div style={{ marginTop: 12, textAlign: 'center' }}>
            <button className="btn btn-outline" onClick={handleResend}>Отправить код повторно</button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default VerifyEmail;
