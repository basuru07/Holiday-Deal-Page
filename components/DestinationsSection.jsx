import DestinationCard from './DestinationCard';

export default function DestinationsSection({ destinations, setSelectedModal }) {
  return (
    <section id="destinations" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">Destinations You'll Visit</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {destinations.map((destination, index) => (
            <DestinationCard key={index} destination={destination} setSelectedModal={setSelectedModal} />
          ))}
        </div>
      </div>
    </section>
  );
}