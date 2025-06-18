"use client";
import { useState } from 'react';
import { Modal } from './Modal';

export function DestinationCard({ destination }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 m-4">
      <img
        src={destination.image || '/images/placeholder.jpg'}
        alt={destination.name || 'Destination Image'}
        className="w-full h-48 object-cover rounded-md mb-4"
      />
      <h3 className="text-xl font-semibold">{destination.name || 'Destination Name'}</h3>
      <p className="text-gray-600">{destination.country || 'Country'}</p>
      <p className="text-gray-600">{destination.description?.slice(0, 100)}...</p>
      <button
        onClick={() => setIsModalOpen(true)}
        className="text-blue-500 hover:underline"
      >
        Read more
      </button>
      <a
        href={destination.formattedUrl || '#'}
        className="text-blue-500 hover:underline block mt-2"
      >
        Explore Destination
      </a>
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <div dangerouslySetInnerHTML={{ __html: destination.description || 'No description available' }} />
        </Modal>
      )}
    </div>
  );
}