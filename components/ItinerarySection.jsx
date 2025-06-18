export default function ItinerarySection({ itinerary }) {
  // Debug logging
  console.log('Itinerary data received:', itinerary);

  // Handle empty or invalid itinerary data
  if (!Array.isArray(itinerary) || itinerary.length === 0) {
    return (
      <section id="itinerary" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">Day by Day Itinerary</h2>
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-gray-500 text-lg">No itinerary information available.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="itinerary" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">Day by Day Itinerary</h2>
        <div className="max-w-4xl mx-auto">
          {itinerary.map((day, index) => (
            <div key={index} className="flex items-start space-x-6 mb-12 last:mb-0">
              {/* Day Number Circle */}
              <div className="flex-shrink-0 w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                {day.day || (index + 1)}
              </div>
              
              {/* Day Content */}
              <div className="flex-1 bg-gray-50 p-6 rounded-lg shadow-sm">
                {/* Optional: Display day title if available */}
                {day.title && day.title !== `Day ${day.day || (index + 1)}` && (
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    {day.title}
                  </h3>
                )}
                
                {/* Optional: Display location if available */}
                {day.location && (
                  <div className="flex items-center mb-3">
                    <svg className="w-4 h-4 text-blue-600 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm font-medium text-blue-600">{day.location}</span>
                  </div>
                )}
                
                {/* Day Description */}
                <div 
                  dangerouslySetInnerHTML={{ __html: day.description || 'No description available' }}
                  className="text-gray-700 leading-relaxed prose prose-sm max-w-none"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}