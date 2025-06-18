import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect } from 'react';

const ImageSlider = ({ images, autoplay = false }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (autoplay && images.length > 1) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [autoplay, images.length]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  return (
    <div className="relative w-full h-full group">
      <img 
        src={images[currentIndex] || '/images/placeholder.jpg'} 
        alt="Slider" 
        className="w-full h-full object-cover"
      />
      {images.length > 1 && (
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

export default function HeroSection({ deal, scrollToSection }) {
  return (
    <section id="hero" className="relative h-screen mt-16">
      <div className="absolute inset-0">
        <ImageSlider images={deal.images} autoplay={true} />
      </div>
      <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
        <div className="text-center text-white max-w-4xl px-4">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            {deal.title}
          </h1>
          <div className="flex items-center justify-center space-x-8 mb-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-400">${deal.price}</div>
              <div className="text-lg line-through text-gray-300">${deal.originalPrice}</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-400">Save {deal.discount}%</div>
              <div className="text-lg">{deal.nights} Nights</div>
            </div>
          </div>
          <div className="flex items-center justify-center space-x-4 mb-8">
            <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2a10 10 0 00-7 2.9V8h14V5.9A10 10 0 0012 2zm0 16a6 6 0 01-6-6H2v-2a2 2 0 012-2h2a2 2 0 012 2v2H6a6 6 0 016 6z" /></svg>
            <span className="text-xl">{deal.destinations.join(' • ')}</span>
          </div>
          <button 
            onClick={() => scrollToSection('payment')}
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-12 py-4 rounded-full text-xl font-semibold transform hover:scale-105 transition-all duration-300 shadow-lg"
          >
            Book Now - Limited Time!
          </button>
        </div>
      </div>
    </section>
  );
}