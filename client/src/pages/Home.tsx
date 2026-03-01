import React, { useState } from 'react';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Features from '../components/Features';
import Footer from '../components/Footer';
import Modal from '../components/Modal';
import LoginForm from '../components/auth/LoginForm';
import RegisterForm from '../components/auth/RegisterForm';
import ContactForm from '../components/ContactForm';

type ActiveModal = 'login' | 'register' | 'contact' | null;

const Home: React.FC = () => {
  const [activeModal, setActiveModal] = useState<ActiveModal>(null);

  const closeModal = () => setActiveModal(null);

  return (
    <div id="welcomePage">
      <Header
        onOpenLogin={() => setActiveModal('login')}
        onOpenRegister={() => setActiveModal('register')}
        onOpenContact={() => setActiveModal('contact')}
      />
      <Hero
        onOpenLogin={() => setActiveModal('login')}
        onOpenRegister={() => setActiveModal('register')}
      />
      <Features />
      <Footer />

      {activeModal === 'login' && (
        <Modal onClose={closeModal}>
          <LoginForm />
        </Modal>
      )}

      {activeModal === 'register' && (
        <Modal onClose={closeModal}>
          <RegisterForm />
        </Modal>
      )}

      {activeModal === 'contact' && (
        <Modal onClose={closeModal}>
          <ContactForm />
        </Modal>
      )}
    </div>
  );
};

export default Home;

