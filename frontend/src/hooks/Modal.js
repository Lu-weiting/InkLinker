import React from 'react';
import './Modalc.css';

const Modal = ({ isOpen, onClose, children }) => {
  const modalClasses = `modal-backdrop ${isOpen ? 'open' : ''}`;

  return (
    <div className={modalClasses}>
      <div className="modal-content">
        {children}
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Modal;
