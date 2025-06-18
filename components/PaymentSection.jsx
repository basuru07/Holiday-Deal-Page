"use client";
import { useEffect, useState } from 'react';
import Image from 'next/image';

export function PaymentSection({ payment, expirationDate }) {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    if (!expirationDate) return;

    const timer = setInterval(() => {
      const now = new Date();
      const expiration = new Date(expirationDate);
      const diff = expiration - now;

      if (diff <= 0) {
        setTimeLeft('Deal Expired');
        clearInterval(timer);
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      setTimeLeft(`${days}d ${hours}h ${minutes}m`);
    }, 1000);

    return () => clearInterval(timer);
  }, [expirationDate]);

  return (
    <section className="py-10 bg-gray-100">
      <h2 className="text-3xl font-bold text-center mb-8">Payment Details</h2>
      <div className="max-w-4xl mx-auto">
        <img
          src={payment.image || '/images/placeholder.jpg'}
          alt="Payment Image"
          className="w-full h-48 object-cover rounded-md mb-4"
        />
        <div dangerouslySetInnerHTML={{ __html: payment.description || 'No payment details available' }} />
        <p className="text-xl font-semibold mt-4">Deal Ends In: {timeLeft || 'N/A'}</p>
      </div>
    </section>
  );
}