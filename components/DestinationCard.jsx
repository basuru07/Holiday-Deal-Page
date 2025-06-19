// components/DestinationCard.jsx - Updated component
import React from 'react';

export default function DestinationCard({ destination, setSelectedModal }) {
  console.log('DestinationCard received destination:', destination);
  
  const { id, name, country, description, image, url } = destination;
  
  // Strip HTML tags and truncate description
  const stripHtml = (html) => {
    if (!html) return '';
    return html.replace(/<[^>]+>/g, '');
  };
  
  const shortDescription = description 
    ? stripHtml(description).slice(0, 150) + (stripHtml(description).length > 150 ? '...' : '')
    : 'Discover the beauty and culture of this amazing destination.';

  // Fallback image if the main image fails to load
  const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/400x300?text=Beautiful+Destination';
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="h-64 overflow-hidden">
        <img 
          src={image || 'https://via.placeholder.com/400x300?text=Beautiful+Destination'} 
          alt={`${name} - ${country}`}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          onError={handleImageError}
        />
      </div>
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-1">{name}</h3>
            <span className="text-sm text-blue-600 font-medium">{country}</span>
          </div>
        </div>
        
        <p className="text-gray-600 mb-4 leading-relaxed">{shortDescription}</p>
        
        <div className="flex flex-col space-y-2">
          {url && (
            <a 
              href={url} 
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 text-sm"
              target="_blank"
              rel="noopener noreferrer"
            >
              📍 View Destination Page →
            </a>
          )}
          
          <button
            onClick={() => setSelectedModal({ type: 'destination', data: destination })}
            className="text-green-600 hover:text-green-800 font-medium transition-colors duration-200 text-sm text-left"
          >
            📖 Read More Details
          </button>
        </div>
      </div>
    </div>
  );
}