import React from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import ContactForm from '../components/ContactForm';

const Contact: React.FC = () => (
  <div className="auth-page">
    <Header />
    <div className="auth-content">
      <div className="auth-box">
        <ContactForm />
      </div>
    </div>
    <Footer />
  </div>
);

export default Contact;
