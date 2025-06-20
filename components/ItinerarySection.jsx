export default function ItinerarySection({ itinerary }) {
  console.log("Itinerary data received:", itinerary);

  // Handle empty or invalid data
  if (!Array.isArray(itinerary) || itinerary.length === 0) {
    return (
      <section id="itinerary" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">
            Day by Day Itinerary
          </h2>
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-gray-500 text-lg">
              No itinerary information available.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="itinerary" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">
          Day by Day Itinerary
        </h2>

        {/* Row-wise scrollable itinerary */}
        <div className="flex gap-6 overflow-x-auto pb-4 px-1">
          {itinerary.map((day, index) => (
            <div
              key={index}
              className="min-w-[300px] max-w-xs flex-shrink-0 bg-gray-50 p-6 rounded-xl shadow-md border border-gray-200"
            >
              {/* Day Number Circle */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  {day.day || index + 1}
                </div>
                {day.title && (
                  <h3 className="text-lg font-semibold text-gray-800">
                    {day.title}
                  </h3>
                )}
              </div>

              {/* Location */}
              {day.location && (
                <div className="flex items-center mb-2">
                  <svg
                    className="w-4 h-4 text-blue-600 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="text-sm font-medium text-blue-600">
                    {day.location}
                  </span>
                </div>
              )}

              {/* Description */}
              <div
                className="text-gray-700 text-sm prose prose-sm max-w-none"
                dangerouslySetInnerHTML={{
                  __html: day.description || "No description available",
                }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
