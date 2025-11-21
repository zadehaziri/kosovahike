import React, { useEffect } from 'react';
import Button from '../Button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faX } from '@fortawesome/free-solid-svg-icons';
import './modal.scss';

const Modal = ({ onClose, children}) => {
  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden';
    
    // Cleanup: restore body scroll when modal closes
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  return (
    <div className='modal'>
        <span className="wrapper-modal" onClick={onClose} />
        <div className='content-modal'>
            <div className='btn__container close'>
                <Button
                    type="button"
                    className="basic-btn green"
                    onClick={onClose}
                >
                    <FontAwesomeIcon icon={faX}/>
                </Button>
            </div>
            <div className='other-data'>
                {children}
            </div>
        </div>
    </div>
  )
}

export default Modal