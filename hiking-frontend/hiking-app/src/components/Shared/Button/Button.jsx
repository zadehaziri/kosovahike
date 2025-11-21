import React from 'react';
import './button.scss';

const Button = ({ className, onClick, type, children }) => {
  return (
    <button
      className={className}
      onClick={onClick}
      type={type}
    >
     <span>
      {children}
     </span>
    </button>
  );
};

export default Button;