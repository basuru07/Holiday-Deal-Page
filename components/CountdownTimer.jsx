"use client";

import React, { useEffect, useState } from 'react';

const CountdownTimer = ({ expiryDate }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const countDown = () => {
      const end = new Date(expiryDate).getTime();
      const now = new Date().getTime();
      const distance = end - now;

      if (distance < 0) {
        setTimeLeft('Deal expired');
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hrs = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const mins = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const secs = Math.floor((distance % (1000 * 60)) / 1000);

      setTimeLeft(`${days}d ${hrs}h ${mins}m ${secs}s`);
    };

    // run immediately so the timer shows without delay
    countDown();

    const interval = setInterval(countDown, 1000);

    return () => clearInterval(interval);
  }, [expiryDate]);

  return <p className="font-bold text-red-500">Expires in: {timeLeft}</p>;
};

export default CountdownTimer;
