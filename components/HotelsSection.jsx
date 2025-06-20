import HotelCard from "./HotelCard";

export default function HotelsSection({ hotels, setSelectedModal }) {
  return (
    <section id="hotels" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">
          Your Accommodations
        </h2>
        <div className="grid md:grid-cols-2 gap-12">
          {hotels.map((hotel, index) => (
            <HotelCard
              key={index}
              hotel={hotel}
              setSelectedModal={setSelectedModal}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
