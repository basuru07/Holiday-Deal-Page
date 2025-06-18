'use client';

import { Star, Wifi, Waves, Utensils, Coffee, Dumbbell, Car, MapPin, Shield, Zap } from 'lucide-react';
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
        alt="Hotel" 
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
  const getIconForAmenity = (amenityName) => {
    const lowerAmenity = amenityName.toLowerCase();
    if (lowerAmenity.includes('wifi') || lowerAmenity.includes('internet')) return <Wifi size={16} />;
    if (lowerAmenity.includes('pool') || lowerAmenity.includes('swimming')) return <Waves size={16} />;
    if (lowerAmenity.includes('restaurant') || lowerAmenity.includes('dining')) return <Utensils size={16} />;
    if (lowerAmenity.includes('spa') || lowerAmenity.includes('massage')) return <Coffee size={16} />;
    if (lowerAmenity.includes('gym') || lowerAmenity.includes('fitness')) return <Dumbbell size={16} />;
    if (lowerAmenity.includes('parking') || lowerAmenity.includes('car')) return <Car size={16} />;
    if (lowerAmenity.includes('security') || lowerAmenity.includes('safe')) return <Shield size={16} />;
    if (lowerAmenity.includes('conditioning') || lowerAmenity.includes('air')) return <Zap size={16} />;
    return <MapPin size={16} />;
  };

  return (
    <div className="flex items-center space-x-2 text-sm text-gray-600">
      {getIconForAmenity(amenity)}
      <span>{amenity}</span>
    </div>
  );
};

// Helper function to strip HTML tags and get clean text
const stripHtmlTags = (html) => {
  if (!html || typeof html !== 'string') return '';
  return html.replace(/<[^>]*>/g, '').trim();
};

// Helper function to render HTML content safely
const createMarkup = (htmlContent) => {
  return { __html: htmlContent };
};

export default function HotelCard({ hotel, setSelectedModal }) {
  // Get clean description text
  const cleanDescription = stripHtmlTags(hotel?.description);
  
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg">
      <div className="h-64">
        <ImageSlider images={hotel?.images || ['/images/placeholder.jpg']} />
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-bold text-gray-800">{hotel?.name || 'Unnamed Hotel'}</h3>
          <StarRating rating={hotel?.starRating} />
        </div>
        
        {/* Description with truncation */}
        <div className="mb-4">
          <p className="text-gray-600 line-clamp-3">
            {cleanDescription || 'No description available.'}
          </p>
          {cleanDescription && cleanDescription.length > 150 && (
            <button
              onClick={() => setSelectedModal({ 
                type: 'hotel', 
                data: {
                  ...hotel,
                  // Pass both original HTML and clean text versions
                  description: hotel?.description,
                  cleanDescription: cleanDescription
                }
              })}
              className="text-blue-600 hover:text-blue-800 font-medium mt-2"
            >
              Read more
            </button>
          )}
        </div>

        {/* Hotel Amenities */}
        <div className="mb-4 pb-4 border-b">
          <h4 className="font-semibold mb-2 text-gray-800">Hotel Amenities:</h4>
          {Array.isArray(hotel?.amenities) && hotel.amenities.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {hotel.amenities.slice(0, 6).map((amenity, i) => (
                <AmenityIcon key={i} amenity={amenity} />
              ))}
              {hotel.amenities.length > 6 && (
                <div className="text-sm text-blue-600 cursor-pointer hover:text-blue-800"
                     onClick={() => setSelectedModal({ type: 'hotel', data: hotel })}>
                  +{hotel.amenities.length - 6} more amenities
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No amenities listed.</p>
          )}
        </div>

        {/* Room Amenities */}
        <div>
          <h4 className="font-semibold mb-2 text-gray-800">Room Amenities:</h4>
          {Array.isArray(hotel?.roomAmenities) && hotel.roomAmenities.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {hotel.roomAmenities.slice(0, 6).map((amenity, i) => (
                <AmenityIcon key={`room-${i}`} amenity={amenity} />
              ))}
              {hotel.roomAmenities.length > 6 && (
                <div className="text-sm text-blue-600 cursor-pointer hover:text-blue-800"
                     onClick={() => setSelectedModal({ type: 'hotel', data: hotel })}>
                  +{hotel.roomAmenities.length - 6} more room amenities
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No room amenities listed.</p>
          )}
        </div>
      </div>
    </div>
  );
}