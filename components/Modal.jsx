'use client';

import { Star, Wifi, Waves, Utensils, Coffee, Dumbbell, Car, X } from 'lucide-react';
import { useState, useEffect } from 'react';

const ImageSlider = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (images?.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [images?.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <div className="relative w-full h-full group">
      <img 
        src={images?.[currentIndex] || '/images/placeholder.jpg'} 
        alt="Slider" 
        className="w-full h-full object-cover"
      />
      {images?.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
          </button>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-white' : 'bg-white/50'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

const StarRating = ({ rating }) => {
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          size={16}
          className={i < (rating || 0) ? 'text-yellow-400 fill-current' : 'text-gray-300'}
        />
      ))}
      <span className="ml-1 text-sm text-gray-600">{rating || 0}/5</span>
    </div>
  );
};

const AmenityIcon = ({ amenity }) => {
  const icons = {
    'Free WiFi': <Wifi size={16} />,
    'Swimming Pool': <Waves size={16} />,
    'Restaurant': <Utensils size={16} />,
    'Spa': <Coffee size={16} />,
    'Gym': <Dumbbell size={16} />,
    'Parking': <Car size={16} />,
  };

  return (
    <div className="flex items-center space-x-2 text-sm">
      {icons[amenity] || <div className="w-4 h-4 bg-gray-300 rounded-full" />}
      <span>{amenity}</span>
    </div>
  );
};

// Helper function to strip HTML tags and get clean text
const stripHtmlTags = (html) => {
  if (!html || typeof html !== 'string') return '';
  return html.replace(/<[^>]*>/g, '').trim();
};

export default function Modal({ isOpen, onClose, data, type }) {
  if (!isOpen) return null;

  // Clean the description text by removing HTML tags
  const cleanDescription = stripHtmlTags(data?.description || data?.fullDescription);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-4xl max-h-[90vh] overflow-y-auto relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 z-10"
        >
          <X size={24} />
        </button>
        {type === 'hotel' && (
          <div className="p-8">
            <h2 className="text-3xl font-bold mb-4">{data?.name || 'Unnamed Hotel'}</h2>
            <div className="mb-6">
              <ImageSlider images={data?.images || ['/images/placeholder.jpg']} />
            </div>
            <div className="flex items-center justify-between mb-6">
              <StarRating rating={data?.starRating} />
            </div>
            <p className="text-gray-700 mb-6">{cleanDescription || 'No description available.'}</p>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-3">Hotel Amenities:</h4>
                {Array.isArray(data?.amenities) && data.amenities.length > 0 ? (
                  <div className="space-y-2">
                    {data.amenities.map((amenity, i) => (
                      <AmenityIcon key={i} amenity={amenity} />
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No amenities listed.</p>
                )}
              </div>
              <div>
                <h4 className="font-semibold mb-3">Room Amenities:</h4>
                {Array.isArray(data?.roomAmenities) && data.roomAmenities.length > 0 ? (
                  <div className="space-y-2">
                    {data.roomAmenities.map((amenity, i) => (
                      <div key={i} className="flex items-center space-x-2 text-sm">
                        <div className="w-2 h-2 bg-blue-600 rounded-full" />
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No room amenities listed.</p>
                )}
              </div>
            </div>
          </div>
        )}
        {type === 'destination' && (
          <div className="p-8">
            <h2 className="text-3xl font-bold mb-4">{data?.name || 'Unnamed Destination'}</h2>
            <div className="mb-6">
              <img 
                src={data?.image || '/images/placeholder.jpg'} 
                alt={data?.name || 'Destination'}
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
            <div className="flex items-center space-x-2 mb-4">
              <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2a10 10 0 00-7 2.9V8h14V5.9A10 10 0 0012 2zm0 16a6 6 0 01-6-6H2v-2a2 2 0 012-2h2a2 2 0 012 2v2H6a6 6 0 016 6z" /></svg>
              <span className="text-gray-600">{data?.country || 'Unknown'}</span>
            </div>
            <p className="text-gray-700 mb-6">{stripHtmlTags(data?.description) || 'No description available.'}</p>
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600">
                <strong>URL:</strong> {data?.url || '#'}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}