"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

export function HeroSection({ deal }) {
  // Debug: Log the deal object to see what data we're receiving
  console.log("=== FULL DEAL OBJECT ===", deal);
  console.log("=== DEAL KEYS ===", deal ? Object.keys(deal) : 'No deal object');
  
  // Try multiple possible field names for images
  const possibleImageFields = [
    deal?.heroImages,
    deal?.images, 
    deal?.photos,
    deal?.gallery,
    deal?.pictures,
    deal?.heroImage ? [deal.heroImage] : null
  ];
  
  let validImages = [];
  for (const imageField of possibleImageFields) {
    if (Array.isArray(imageField)) {
      validImages = imageField.filter(img => typeof img === "string" && img.trim() !== "");
      if (validImages.length > 0) break;
    }
  }
  
  console.log("=== IMAGES DEBUG ===", {
    heroImages: deal?.heroImages,
    images: deal?.images,
    photos: deal?.photos,
    validImages
  });

  // Use fallback if no valid images
  const images = validImages.length > 0 ? validImages : ["/images/placeholder.jpg"];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Auto-slide every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [images.length]);

  const handlePrev = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const formatPrice = (price) =>
    typeof price === "number" ? price.toFixed(2) : price || "N/A";

  // Calculate discount percentage if not provided
  const calculateDiscount = () => {
    if (deal?.discount != null) {
      return deal.discount;
    }
    if (deal?.price && deal?.farePrice && deal.farePrice > deal.price) {
      const discountAmount = deal.farePrice - deal.price;
      const discountPercentage = Math.round((discountAmount / deal.farePrice) * 100);
      return discountPercentage;
    }
    return null;
  };

  const discountPercentage = calculateDiscount();

  return (
    <section className="relative h-[60vh] overflow-hidden">
      <div className="absolute inset-0">
        {images.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImageIndex ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            <Image
              src={image}
              alt={`Hero Image ${index + 1}`}
              layout="fill"
              objectFit="cover"
              priority={index === currentImageIndex}
            />
          </div>
        ))}

        {/* Navigation buttons - only show if multiple images */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrev}
              aria-label="Previous image"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 z-10"
            >
              &lt;
            </button>
            <button
              onClick={handleNext}
              aria-label="Next image"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full hover:bg-opacity-75 z-10"
            >
              &gt;
            </button>

            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2 z-10">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  aria-label={`Go to image ${index + 1}`}
                  className={`w-3 h-3 rounded-full ${
                    index === currentImageIndex ? "bg-white" : "bg-gray-400"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center text-white text-center px-4 space-y-2">
        <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold">
          {deal?.title || "Amazing Holiday Deal"}
        </h1>
        
        <div className="text-xl md:text-2xl lg:text-3xl">
          From ${formatPrice(deal?.price)}
        </div>
        
        {deal?.farePrice && deal.farePrice !== deal?.price && (
          <div className="text-lg md:text-xl text-gray-300 line-through">
            Was ${formatPrice(deal.farePrice)}
          </div>
        )}
        
        {discountPercentage && (
          <div className="text-lg md:text-xl text-green-300 font-semibold">
            Save up to {discountPercentage}%
          </div>
        )}
        
        {(() => {
          // Try multiple possible field names for nights
          const possibleNightsFields = [
            deal?.nights,
            deal?.numberOfNights,
            deal?.duration,
            deal?.days,
            deal?.night,
            deal?.stay,
            deal?.length
          ];
          
          let nights = null;
          for (const field of possibleNightsFields) {
            if (field !== undefined && field !== null) {
              nights = field;
              break;
            }
          }
          
          console.log("=== NIGHTS DEBUG ===", {
            nights: deal?.nights,
            numberOfNights: deal?.numberOfNights,
            duration: deal?.duration,
            days: deal?.days,
            finalNights: nights
          });
          
          if (nights) {
            return (
              <div className="text-lg md:text-xl bg-blue-600 px-3 py-1 rounded">
                {nights} {nights === 1 ? "Night" : "Nights"}
              </div>
            );
          }
          
          // Show debug info if no nights found
          return (
            <div className="text-sm text-yellow-300 bg-red-600 px-2 py-1 rounded">
              No nights data found - Check console
            </div>
          );
        })()}
        
        <div className="text-lg md:text-xl max-w-2xl">
          {(() => {
            // Try multiple possible field names for destinations
            const possibleDestinationFields = [
              deal?.destinations,
              deal?.destinationList,
              deal?.locations,
              deal?.places,
              deal?.cities,
              deal?.countries,
              deal?.destination ? [deal.destination] : null,
              deal?.location ? [deal.location] : null
            ];
            
            let destinations = [];
            for (const field of possibleDestinationFields) {
              if (Array.isArray(field) && field.length > 0) {
                destinations = field;
                break;
              }
            }
            
            console.log("=== DESTINATIONS DEBUG ===", {
              destinations: deal?.destinations,
              destinationList: deal?.destinationList,
              locations: deal?.locations,
              places: deal?.places,
              destination: deal?.destination,
              location: deal?.location,
              finalDestinations: destinations
            });
            
            if (destinations.length > 0) {
              const destinationNames = destinations.map((d) => {
                // Handle different destination data structures
                if (typeof d === 'string') return d;
                if (d?.name) return d.name;
                if (d?.destination) return d.destination;
                if (d?.location) return d.location;
                if (d?.city) return d.city;
                if (d?.place) return d.place;
                return d;
              }).filter(Boolean);
              
              if (destinationNames.length > 0) {
                return (
                  <span className="bg-green-700 px-3 py-1 rounded">
                    {destinationNames.join(", ")}
                  </span>
                );
              }
            }
            
            // Try single destination fields
            const singleDestination = deal?.destination || deal?.location || deal?.city || deal?.country;
            if (singleDestination) {
              return (
                <span className="bg-green-700 px-3 py-1 rounded">
                  {singleDestination}
                </span>
              );
            }
            
            // Show debug info if no destinations found
            return (
              <span className="text-sm text-yellow-300 bg-red-600 px-2 py-1 rounded">
                No destinations data found - Check console
              </span>
            );
          })()}
        </div>
      </div>
    </section>
  );
}