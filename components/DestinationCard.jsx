export default function DestinationCard({ destination, setSelectedModal }) {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
      <div className="h-64">
        <img 
          src={destination.image || '/images/placeholder.jpg'} 
          alt={destination.name} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xl font-bold text-gray-800">{destination.name}</h3>
          <span className="text-sm text-gray-500">{destination.country}</span>
        </div>
        <p className="text-gray-600 mb-4">{destination.description}</p>
        <button
          onClick={() => setSelectedModal({ type: 'destination', data: destination })}
          className="text-blue-600 hover:text-blue-800 font-medium"
        >
          Learn more
        </button>
      </div>
    </div>
  );
}