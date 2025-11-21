import React, { useState, useEffect } from 'react';

const NumberIncrement = ({ number }) => {
  const [currentNr, setCurrentNr] = useState(0);

  useEffect(() => {
    let interval;

    if (currentNr < number) {
      interval = setInterval(() => {
        setCurrentNr((prevNr) => prevNr + 1);
      }, 50); 
    } else {

      clearInterval(interval);
    }

    return () => clearInterval(interval);
  }, [number, currentNr]);

  return <span>{currentNr}</span>;
};

export default NumberIncrement;