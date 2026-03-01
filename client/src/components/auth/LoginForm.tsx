import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const formatError = (err: any) => {
    if (err && err.code) {
      switch (err.code) {
        case 'auth/invalid-email':
          return 'Неверный формат email';
        case 'auth/user-not-found':
          return 'Пользователь не найден';
        case 'auth/wrong-password':
          return 'Неверный пароль';
        default:
          return err.message || 'Ошибка при входе';
      }
    }
    return err.message || String(err);
  };

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/app');
    } catch (err: any) {
      setError(formatError(err));
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: '0 auto' }}>
      <h2>Вход</h2>
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
        />
      </div>
      <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
        Войти
      </button>
    </form>
  );
};

export default LoginForm;
