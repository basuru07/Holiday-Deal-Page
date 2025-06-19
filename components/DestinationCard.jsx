// components/DestinationCard.jsx
import React from 'react';

export default function DestinationCard({ destination, setSelectedModal }) {
  const { name, country, description, image, url } = destination;
  const shortDescription = description ? description.replace(/<[^>]+>/g, '').slice(0, 150) + '...' : '';

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer">
      <div className="h-64">
        <img src={image || 'https://via.placeholder.com/400x300?text=No+Image'} alt={name} className="w-full h-full object-cover" />
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold text-gray-800">{name}</h3>
          <span className="text-sm text-gray-500">{country}</span>
        </div>
        <p className="text-gray-600 mb-4">{shortDescription}</p>
        <a href={url} className="text-blue-600 hover:text-blue-800 font-medium">Visit page</a>
        <button
          onClick={() => setSelectedModal({ type: 'destination', data: destination })}
          className="block mt-4 text-blue-600 hover:text-blue-800 font-medium"
        >
          Read more
        </button>
      </div>
    </div>
  );
}
