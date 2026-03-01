import React, { useState } from 'react';
import emailjs from '../emailjs';

const ContactForm: React.FC = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('sending');
    try {
      const result = await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID || 'default_service',
        import.meta.env.VITE_EMAILJS_TEMPLATE_CONTACT || 'template_contact',
        {
          from_name: form.name,
          from_email: form.email,
          message: form.message
        }
      );
      console.log('EmailJS result', result);
      setStatus('sent');
      setForm({ name: '', email: '', message: '' });
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 500, margin: '0 auto' }}>
      <h2>Свяжитесь с нами</h2>
      <div className="form-group">
        <label>Имя</label>
        <input
          type="text"
          className="form-control"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
      </div>
      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          className="form-control"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
      </div>
      <div className="form-group">
        <label>Сообщение</label>
        <textarea
          className="form-control"
          rows={4}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          required
        />
      </div>
      <button
        className="btn btn-primary"
        type="submit"
        disabled={status === 'sending'}
        style={{ width: '100%' }}
      >
        {status === 'sending' ? 'Отправка...' : 'Отправить'}
      </button>
      {status === 'sent' && (
        <p style={{ color: 'var(--success)', marginTop: 10 }}>Сообщение отправлено!</p>
      )}
      {status === 'error' && (
        <p style={{ color: 'var(--danger)', marginTop: 10 }}>
          Ошибка отправки, попробуйте позже.
        </p>
      )}
    </form>
  );
};

export default ContactForm;

