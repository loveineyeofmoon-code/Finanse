import React, { ReactNode, useEffect } from 'react';

interface ModalProps {
  children: ReactNode;
  onClose: () => void;
  className?: string;
}

const Modal: React.FC<ModalProps> = ({ children, onClose, className = '' }) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const stopProp = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <div className={`modal active ${className}`} onClick={onClose}>
      <div className="modal-content" onClick={stopProp}>
        {children}
      </div>
    </div>
  );
};

export default Modal;
