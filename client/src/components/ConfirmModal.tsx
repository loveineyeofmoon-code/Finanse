import React from 'react';
import Modal from './Modal';

interface Props {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
}

const ConfirmModal: React.FC<Props> = ({
  message,
  onConfirm,
  onCancel,
  confirmText = 'Да',
  cancelText = 'Отмена'
}) => {
  return (
    <Modal onClose={onCancel}>
      <p>{message}</p>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
        <button className="btn btn-outline" onClick={onCancel}>
          {cancelText}
        </button>
        <button className="btn btn-primary" onClick={onConfirm}>
          {confirmText}
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
