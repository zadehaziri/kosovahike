import { useState, useEffect } from "react";

export const useCountdown = (initialSeconds, onComplete) => {
  const [seconds, setSeconds] = useState(initialSeconds);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval = null;

    if (isActive) {
      interval = setInterval(() => {
        setSeconds((prevSeconds) => {
          const newSeconds = prevSeconds - 1;
          onComplete();
          return newSeconds;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, onComplete]);

  const start = () => setIsActive(true);
  const reset = () => {
    setIsActive(false);
    setSeconds(initialSeconds);
  };
  const pause = () => setIsActive(false);

  return { seconds, start, reset, pause };
};
