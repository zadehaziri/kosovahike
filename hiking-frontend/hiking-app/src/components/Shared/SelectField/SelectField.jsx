import React, { useState, useEffect, useRef } from 'react';
import './selectField.scss';

const SelectField = ({ id, classname, value, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(options[0]);
  const selectRef = useRef(null);

  useEffect(() => {
    const selected = options.find(option => option.value === value);
    setSelectedOption(selected || options[0]);
  }, [value, options]);

  useEffect(() => {
    const closeMenu = (e) => {
      if (selectRef.current && !selectRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', closeMenu);

    return () => {
      document.removeEventListener('mousedown', closeMenu);
    };
  }, []);

  const handleOptionClick = (option) => {
    setIsOpen(false);
    onChange(option.value);
    setSelectedOption(option);
  };

  return (
    <div className='select-option-content' ref={selectRef}>
      <div
        id={id}
        className={classname}
        onClick={() => setIsOpen(!isOpen)}
      >
        {selectedOption.label}
      </div>
      {isOpen && (
        <ul className="select-options">
          {options.slice(1, options.length).map((option) => (
            <li
              key={option.value}
              className={`select-option ${option.value === value ? 'selected' : ''}`}
              onClick={() => handleOptionClick(option)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
      <span className="option-focus"></span>
    </div>
  );
};

export default SelectField;
