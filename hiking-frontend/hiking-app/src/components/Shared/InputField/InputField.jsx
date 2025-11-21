import React from 'react';
import './inputField.scss';

const InputField = ({type, label, value, onChange, classname}) => {
  return (
    <input 
        className={classname}
        type={type}
        placeholder={label}
        value={value}
        onChange={onChange}
    />
  )
}

export default InputField