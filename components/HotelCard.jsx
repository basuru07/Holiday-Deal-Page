"use client";
import { useState, useEffect } from "react";
import { Modal } from "./Modal";

// Helper to extract <li> texts from an HTML string
function extractTextFromHtmlList(html) {
  if (!html) return [];
  const matches = html.match(/<li[^>]*>(.*?)<\/li>/gi);
  return matches ? matches.map(item => item.replace(/<\/?li[^>]*>/gi, '').trim()) : [];
}

// Helper to strip HTML tags from description safely in client side only
function stripHtml(html) {
  if (!html) return "";
  if (typeof window === "undefined") return ""; // Ensure this runs only client side
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
}

export function HotelCard({ hotel }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isImageLoading, setIsImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [autoSlide, setAutoSlide] = useState(true);

  // Base URL for images - adjust if needed
  const IMAGE_BASE_URL = "https://api.techneapp-staging.site/api/";

  // Safe nested property accessor
  const safeGet = (obj, path, fallback = null) => {
    if (!obj) return fallback;
    return path.split('.').reduce((cur, key) => (cur && cur[key] !== undefined ? cur[key] : fallback), obj);
  };

  // Extract hotel data with fallbacks
  const hotelData = {
    name: safeGet(hotel, 'name') || safeGet(hotel, 'hotelName') || safeGet(hotel, 'title') || "Hotel Name",
    description: safeGet(hotel, 'description') || safeGet(hotel, 'desc') || safeGet(hotel, 'summary') || "No description available",
    starRating: safeGet(hotel, 'starRating') || safeGet(hotel, 'stars') || safeGet(hotel, 'rating') || 0,
    amenities: extractTextFromHtmlList(safeGet(hotel, 'amenities') || ""),
    roomAmenities: extractTextFromHtmlList(safeGet(hotel, 'roomAmenities') || ""),
    images: safeGet(hotel, 'images') || safeGet(hotel, 'photos') || [],
  };

  // Normalize images array: ensure full URLs and filter null/undefined
  // Add demo images for testing if no images available
  const images = hotelData.images.length > 0
    ? hotelData.images.map(img => {
        if (!img) return null;
        if (typeof img === "string") {
          return img.startsWith("http") ? img : IMAGE_BASE_URL + img;
        }
        if (typeof img === "object") {
          if (img.url) return img.url.startsWith("http") ? img.url : IMAGE_BASE_URL + img.url;
          if (img.src) return img.src.startsWith("http") ? img.src : IMAGE_BASE_URL + img.src;
        }
        return null;
      }).filter(Boolean)
    : [
        // Demo images for testing - replace with your actual fallback
        `${IMAGE_BASE_URL}images/placeholder.jpg`,
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400',
        'https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400'
      ];

  const fullDescription = stripHtml(hotelData.description);
  const descriptionSnippet = fullDescription.length > 120 ? fullDescription.slice(0, 120) + "..." : fullDescription;

  // Star rating between 0 and 5
  const starRating = Math.min(Math.max(parseInt(hotelData.starRating) || 0, 0), 5);
  const stars = "★".repeat(starRating) + "☆".repeat(5 - starRating);

  // Auto-slide functionality
  useEffect(() => {
    if (!autoSlide || images.length <= 1) return;
    
    const interval = setInterval(() => {
      setCurrentImageIndex(prev => (prev === images.length - 1 ? 0 : prev + 1));
    }, 4000); // Change image every 4 seconds

    return () => clearInterval(interval);
  }, [autoSlide, images.length]);

  // Handlers for image slider
  const prevImage = () => {
    setAutoSlide(false); // Stop auto-slide when user manually navigates
    setCurrentImageIndex(i => (i === 0 ? images.length - 1 : i - 1));
    setIsImageLoading(true);
    setImageError(false);
  };

  const nextImage = () => {
    setAutoSlide(false); // Stop auto-slide when user manually navigates
    setCurrentImageIndex(i => (i === images.length - 1 ? 0 : i + 1));
    setIsImageLoading(true);
    setImageError(false);
  };

  const goToSlide = (index) => {
    setAutoSlide(false);
    setCurrentImageIndex(index);
    setIsImageLoading(true);
    setImageError(false);
  };

  const handleImageLoad = () => {
    setIsImageLoading(false);
    setImageError(false);
  };

  const handleImageError = (e) => {
    setIsImageLoading(false);
    setImageError(true);
    e.currentTarget.src = `${IMAGE_BASE_URL}images/placeholder.jpg`;
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!isModalOpen) return;
      
      if (e.key === 'ArrowLeft') {
        prevImage();
      } else if (e.key === 'ArrowRight') {
        nextImage();
      } else if (e.key === 'Escape') {
        setIsModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [isModalOpen]);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 m-4 max-w-sm mx-auto hover:shadow-xl transition-shadow duration-300">
      {/* Image slider */}
      <div 
        className="relative w-full h-48 mb-4 rounded-md overflow-hidden bg-gray-200 group"
        onMouseEnter={() => setAutoSlide(false)}
        onMouseLeave={() => setAutoSlide(true)}
      >
        {/* Loading indicator */}
        {isImageLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}
        
        {/* Main image */}
        <img
          src={images[currentImageIndex]}
          alt={`${hotelData.name} Image ${currentImageIndex + 1}`}
          className={`w-full h-full object-cover transition-opacity duration-300 ${
            isImageLoading ? 'opacity-0' : 'opacity-100'
          }`}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />

        {/* Error state */}
        {imageError && !isImageLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-300 text-gray-600">
            <div className="text-center">
              <div className="text-2xl mb-2">🏨</div>
              <div className="text-sm">Image not available</div>
            </div>
          </div>
        )}

        {/* Navigation arrows - always visible if multiple images */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-60 hover:bg-opacity-80 text-white p-2 rounded-full transition-all duration-200 shadow-lg z-10"
              aria-label="Previous Image"
              type="button"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-60 hover:bg-opacity-80 text-white p-2 rounded-full transition-all duration-200 shadow-lg z-10"
              aria-label="Next Image"
              type="button"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Force show controls for testing - remove this section once working */}
        {images.length === 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-blue-500 bg-opacity-60 hover:bg-opacity-80 text-white p-2 rounded-full transition-all duration-200 shadow-lg z-10"
              aria-label="Previous Image (Demo)"
              type="button"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              onClick={nextImage}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-500 bg-opacity-60 hover:bg-opacity-80 text-white p-2 rounded-full transition-all duration-200 shadow-lg z-10"
              aria-label="Next Image (Demo)"
              type="button"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </>
        )}

        {/* Image counter - always show if more than 1 image */}
        {images.length > 1 && (
          <div className="absolute top-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded shadow-lg z-10">
            {currentImageIndex + 1} / {images.length}
          </div>
        )}

        {/* Demo counter for single image - remove once working */}
        {images.length === 1 && (
          <div className="absolute top-2 right-2 bg-blue-500 bg-opacity-70 text-white text-xs px-2 py-1 rounded shadow-lg z-10">
            Demo: 1 / 1
          </div>
        )}

        {/* Dot indicators - always visible if multiple images */}
        {images.length > 1 && images.length <= 8 && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => goToSlide(idx)}
                className={`w-3 h-3 rounded-full transition-all duration-200 shadow-sm ${
                  idx === currentImageIndex 
                    ? "bg-white scale-110 shadow-md" 
                    : "bg-white bg-opacity-60 hover:bg-opacity-90"
                }`}
                aria-label={`Go to image ${idx + 1}`}
                type="button"
              />
            ))}
          </div>
        )}

        {/* Demo dots for single image - remove once working */}
        {images.length === 1 && (
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
            <button
              className="w-3 h-3 rounded-full bg-blue-500 shadow-md"
              aria-label="Demo dot"
              type="button"
            />
          </div>
        )}

        {/* Progress bar for auto-slide */}
        {autoSlide && images.length > 1 && (
          <div className="absolute bottom-0 left-0 w-full h-1 bg-black bg-opacity-20">
            <div 
              className="h-full bg-white transition-all duration-100 ease-linear"
              style={{
                width: '100%',
                animation: 'progress 4s linear infinite'
              }}
            />
          </div>
        )}
      </div>

      {/* Hotel info */}
      <h3 className="text-xl font-semibold mb-2 text-gray-800">{hotelData.name}</h3>
      <p className="text-gray-600 mb-2 leading-relaxed">{descriptionSnippet}</p>
      {fullDescription.length > 120 && (
        <button
          onClick={() => setIsModalOpen(true)}
          className="text-blue-600 hover:text-blue-800 hover:underline mb-4 text-sm font-medium transition-colors duration-200"
          type="button"
        >
          Read more
        </button>
      )}
      <div className="flex items-center justify-between">
        <p className="text-yellow-500 text-lg" title={`${starRating} out of 5 stars`}>
          {stars}
        </p>
        {images.length > 1 && (
          <p className="text-gray-500 text-sm">
            {images.length} photos
          </p>
        )}
      </div>

      {/* Modal with enhanced image viewer */}
      {isModalOpen && (
        <Modal onClose={() => setIsModalOpen(false)}>
          <div className="p-6 max-w-4xl max-h-96 overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">{hotelData.name}</h2>
            <p className="text-yellow-500 text-lg mb-4">{stars}</p>
            
            {/* Modal image slider */}
            {images.length > 1 && (
              <div className="relative w-full h-64 mb-6 rounded-lg overflow-hidden">
                <img
                  src={images[currentImageIndex]}
                  alt={`${hotelData.name} Image ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                  onError={handleImageError}
                />
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all"
                  aria-label="Previous Image"
                  type="button"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-black bg-opacity-50 hover:bg-opacity-70 text-white p-2 rounded-full transition-all"
                  aria-label="Next Image"
                  type="button"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <div className="absolute top-2 right-2 bg-black bg-opacity-50 text-white text-sm px-3 py-1 rounded">
                  {currentImageIndex + 1} / {images.length}
                </div>
              </div>
            )}
            
            <div className="prose prose-sm max-w-none mb-4">
              <p className="text-gray-700 leading-relaxed">{fullDescription}</p>
            </div>
            <div className="space-y-3 text-sm text-gray-800">
              <div>
                <strong className="text-gray-900">Amenities:</strong>{" "}
                <span className="text-gray-700">
                  {hotelData.amenities.length > 0 ? hotelData.amenities.join(", ") : "N/A"}
                </span>
              </div>
              <div>
                <strong className="text-gray-900">Room Amenities:</strong>{" "}
                <span className="text-gray-700">
                  {hotelData.roomAmenities.length > 0 ? hotelData.roomAmenities.join(", ") : "N/A"}
                </span>
              </div>
            </div>
          </div>
        </Modal>
      )}

      <style jsx>{`
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
}