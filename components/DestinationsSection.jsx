"use client";
import { useState } from 'react';
import { DestinationCard } from './DestinationCard';

export function DestinationsSection({ destinations }) {
  if (!destinations?.length) return null;

  return (
    <section className="py-10 bg-gray-100">
      <h2 className="text-3xl font-bold text-center mb-8">Destinations</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {destinations.map((destination, index) => (
          <DestinationCard key={index} destination={destination} />
        ))}
      </div>
    </section>
  );
}