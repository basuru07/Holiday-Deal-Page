// components/DestinationsSection.jsx
import React from 'react';
import DestinationCard from './DestinationCard';

export default function DestinationsSection({ destinations, setSelectedModal }) {
  return (
    <section id="destinations" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">Destinations You'll Visit</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {destinations && destinations.length > 0 ? (
            destinations.map((destination) => (
              <DestinationCard
                key={destination.id}
                destination={destination}
                setSelectedModal={setSelectedModal}
              />
            ))
          ) : (
            <p className="text-center text-gray-500 col-span-3">No destinations available.</p>
          )}
        </div>
      </div>
    </section>
  );
}
