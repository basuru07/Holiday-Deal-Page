"use client";
import { HotelCard } from "./HotelCard";

export function HotelsSection({ hotels }) {
  console.log("HotelsSection - Raw hotels data:", hotels);

  let hotelsArray = [];

  if (!hotels) return null;

  if (Array.isArray(hotels)) hotelsArray = hotels;
  else if (hotels.hotels && Array.isArray(hotels.hotels)) hotelsArray = hotels.hotels;
  else if (hotels.data && Array.isArray(hotels.data)) hotelsArray = hotels.data;
  else if (hotels.items && Array.isArray(hotels.items)) hotelsArray = hotels.items;
  else if (typeof hotels === 'object' && hotels.name) hotelsArray = [hotels];
  else if (typeof hotels === 'object') {
    const values = Object.values(hotels);
    const potentialHotels = values.filter(item =>
      item && typeof item === 'object' && (item.name || item.hotelName || item.title)
    );
    if (potentialHotels.length) hotelsArray = potentialHotels;
  }

  if (!hotelsArray.length) {
    return (
      <section className="py-10 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-600">
          <h2 className="text-3xl font-bold mb-8">Hotels</h2>
          <p>No hotel information available for this deal.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="py-10 bg-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-3xl font-bold text-center mb-8">Hotels</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hotelsArray.map((hotel, index) => (
            hotel && typeof hotel === 'object' && (
              <HotelCard
                key={hotel.id || hotel.name || `hotel-${index}`}
                hotel={hotel}
              />
            )
          ))}
        </div>
      </div>
    </section>
  );
}
