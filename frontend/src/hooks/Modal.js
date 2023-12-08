import React from 'react';
import './ModalCss.css';
import styled from 'styled-components';
const PublishBtn = styled.button`
    width: 6rem;
    height: 2rem;
    background: #D2BAAC;
    border-radius: 150px;
    margin-top: 1.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    font-weight: bold;
    color: #FFFFFF; 
    transition: background-color 0.3s ease, color 0.3s ease, font-weight 0.3s ease; // 添加過渡效果

    &:hover {
        background: #BAA492; 
        color: black; 
        cursor: pointer;
    }
`;
const Modal = ({ isOpen, onClose, children ,userName}) => {
    const modalClasses = `modal-backdrop ${isOpen ? 'open' : ''}`;

    return (
        <div className={modalClasses}>
            <div className="modal-content">
                <p className="modal-title">Publishing to: <span className='test'>{userName}</span></p>
                <p className='description'>Add or change topics (up to 5) so readers know what your story is about</p>
                {children}
                <PublishBtn onClick={onClose}>Publish</PublishBtn>
            </div>
        </div>
    );
};

export default Modal;
