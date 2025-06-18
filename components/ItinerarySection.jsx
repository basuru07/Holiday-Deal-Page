export default function ItinerarySection({ itinerary }) {
  return (
    <section id="itinerary" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">Day by Day Itinerary</h2>
        <div className="max-w-4xl mx-auto">
          {itinerary.map((day, index) => (
            <div key={index} className="flex items-start space-x-6 mb-12">
              <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold">
                {day.day}
              </div>
              <div className="flex-1 bg-gray-50 p-6 rounded-lg">
                <div 
                  dangerouslySetInnerHTML={{ __html: day.description }}
                  className="text-gray-700"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}