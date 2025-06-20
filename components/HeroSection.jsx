"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

const imageBaseUrl = "https://api.techneapp-staging.site/";

const ImageSlider = ({ images, autoplay = true }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const validImages =
    Array.isArray(images) && images.length > 0
      ? images.filter((img) => typeof img === "string" && img)
      : ["https://via.placeholder.com/1920x1080?text=No+Image"];

  useEffect(() => {
    if (autoplay && validImages.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % validImages.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [autoplay, validImages.length]);

  const goToPrevious = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + validImages.length) % validImages.length
    );
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % validImages.length);
  };

  return (
    <div className="relative w-full h-full group">
      <img
        src={validImages[currentIndex]}
        alt="Hero Slider"
        className="w-full h-full object-cover"
      />
      {validImages.length > 1 && (
        <>
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <ChevronRight size={20} />
          </button>
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
            {validImages.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex ? "bg-white" : "bg-white/50"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default function HeroSection({ deal, scrollToSection }) {
  // Extract  image URLs from deal.heroImages
  const heroImages =
    Array.isArray(deal?.heroImages) && deal.heroImages.length > 0
      ? deal.heroImages
          .filter((img) => img?.path)
          .map((img) => `${imageBaseUrl}${img.path}`)
      : ["https://via.placeholder.com/1920x1080?text=No+Image"];

  // Extract other deal data
  const safeDeal = {
    title: deal?.title || "No Title Available",
    price: Number(deal?.price) || 0,
    originalPrice: Number(deal?.originalPrice) || 0,
    discount: Number(deal?.discount) || 0,
    nights: Number(deal?.nights) || 0,
    destinations: Array.isArray(deal?.destinations)
      ? deal.destinations.filter((dest) => typeof dest === "string" && dest)
      : [],
  };

  return (
    <section id="hero" className="relative h-screen mt-16">
      <div className="absolute inset-0">
        <ImageSlider images={heroImages} />
      </div>
      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
        <div className="text-center text-white max-w-4xl px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            {safeDeal.title}
          </h1>
          <div className="flex items-center justify-center space-x-6 mb-6">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-400">
                ${safeDeal.price.toFixed(2)}
              </p>
              {safeDeal.originalPrice > safeDeal.price && (
                <p className="text-md line-through text-gray-300">
                  ${safeDeal.originalPrice.toFixed(2)}
                </p>
              )}
            </div>
            <div className="text-center">
              {safeDeal.discount > 0 ? (
                <p className="text-2xl font-semibold text-red-400">
                  Save {safeDeal.discount}%
                </p>
              ) : (
                <p className="text-sm text-gray-400">No discount available</p>
              )}
              {safeDeal.nights > 0 ? (
                <p className="text-md font-medium">
                  {safeDeal.nights} Night{safeDeal.nights > 1 ? "s" : ""}
                </p>
              ) : (
                <p className="text-sm text-gray-400">No nights specified</p>
              )}
            </div>
          </div>
          {safeDeal.destinations.length > 0 ? (
            <div className="flex items-center justify-center space-x-3 mb-6">
              <svg
                className="w-5 h-5 text-blue-400"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2a10 10 0 00-7 2.9V8h14V5.9A10 10 0 0012 2zm0 16a6 6 0 01-6-6H2v-2a2 2 0 012-2h2a2 2 0 012 2v2H6a6 6 0 016 6z" />
              </svg>
              <span className="text-lg font-medium">
                {safeDeal.destinations.join(" • ")}
              </span>
            </div>
          ) : (
            <p className="text-sm text-gray-400 mb-6">No destinations listed</p>
          )}
          <button
            onClick={() => scrollToSection("payment")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-full text-lg transition-transform duration-200 hover:scale-105 shadow-md"
          >
            Book Now - Limited Offer!
          </button>
        </div>
      </div>
    </section>
  );
}
