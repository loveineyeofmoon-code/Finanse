import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import RegisterForm from '../components/auth/RegisterForm';

const Register: React.FC = () => (
  <div className="auth-page">
    <Header />
    <div className="auth-content">
      <div className="auth-box">
        <RegisterForm />
      </div>
    </div>
    <Footer />
  </div>
);

export default Register;
