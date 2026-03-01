import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import LoginForm from '../components/auth/LoginForm';

const Login: React.FC = () => (
  <div className="auth-page">
    <Header />
    <div className="auth-content">
      <div className="auth-box">
        <LoginForm />
      </div>
    </div>
    <Footer />
  </div>
);

export default Login;
