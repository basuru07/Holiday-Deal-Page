import React from "react";

export default function DestinationCard({ destination, setSelectedModal }) {
  console.log("DestinationCard received destination:", destination);

  const {
    id,
    name,
    country,
    continent,
    description,
    image,
    imageAlt,
    url,
    priceFrom,
    nights,
    title,
  } = destination;

  // Strip HTML tags and truncate description
  const stripHtml = (html) => {
    if (!html) return "";
    return html.replace(/<[^>]+>/g, "");
  };

  const shortDescription = description
    ? stripHtml(description).slice(0, 150) +
      (stripHtml(description).length > 150 ? "..." : "")
    : "Discover the beauty and culture of this amazing destination.";

  // Fallback image if the main image fails to load
  const handleImageError = (e) => {
    e.target.src =
      "https://via.placeholder.com/400x300?text=Beautiful+Destination";
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="h-64 overflow-hidden relative">
        <img
          src={
            image ||
            "https://via.placeholder.com/400x300?text=Beautiful+Destination"
          }
          alt={imageAlt || `${name} - ${country}`}
          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
          onError={handleImageError}
        />
        {nights > 0 && (
          <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-medium">
            {nights} Night{nights > 1 ? "s" : ""}
          </div>
        )}
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800 mb-1">{name}</h3>
            <div className="flex items-center text-sm text-gray-600">
              <span className="font-medium text-blue-600">{country}</span>
              {continent && (
                <>
                  <span className="mx-2">•</span>
                  <span>{continent}</span>
                </>
              )}
            </div>
          </div>
          {priceFrom > 0 && (
            <div className="text-right">
              <div className="text-sm text-gray-500">From</div>
              <div className="text-lg font-bold text-green-600">
                ${priceFrom}
              </div>
            </div>
          )}
        </div>

        <p className="text-gray-600 mb-4 leading-relaxed">{shortDescription}</p>

        <div className="flex flex-col space-y-2">
          {url && (
            <a
              href={url}
              className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 text-sm flex items-center"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="mr-1">📍</span> View Destination Page →
            </a>
          )}

          <button
            onClick={() =>
              setSelectedModal({ type: "destination", data: destination })
            }
            className="text-green-600 hover:text-green-800 font-medium transition-colors duration-200 text-sm text-left flex items-center"
          >
            <span className="mr-1">📖</span> Read More Details
          </button>
        </div>
      </div>
    </div>
  );
}
