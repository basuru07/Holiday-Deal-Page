export default function HighlightsSection({ highlights }) {
  // Debug: Log the highlights data to see what we're receiving
  console.log('Highlights data received:', highlights);
  console.log('Highlights type:', typeof highlights);
  console.log('Is array:', Array.isArray(highlights));
  console.log('Length:', highlights?.length);

  // Handle case where highlights might be empty or undefined
  if (!highlights || !Array.isArray(highlights) || highlights.length === 0) {
    return (
      <section id="highlights" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">Trip Highlights</h2>
          <div className="text-center text-gray-600">
            <p>No highlights available for this trip at the moment.</p>
            <p className="text-sm mt-2">Check back later for exciting trip highlights!</p>
          </div>
        </div>
      </section>
    );
  }

  // Function to handle image URL construction
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return '/images/placeholder.jpg';
    
    // If it's already a full URL, return as is
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
      return imageUrl;
    }
    
    // If it starts with a slash, it's likely a relative path from the base URL
    if (imageUrl.startsWith('/')) {
      return `https://api.techneapp-staging.site${imageUrl}`;
    }
    
    // Otherwise, append to base URL
    return `https://api.techneapp-staging.site/${imageUrl}`;
  };

  return (
    <section id="highlights" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">Trip Highlights</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {highlights.map((highlight, index) => (
            <div 
              key={highlight.id || index} 
              className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              {/* Highlight Image */}
              <div className="h-64 relative overflow-hidden">
                <img
                  src={getImageUrl(highlight.image || highlight.imageUrl)}
                  alt={highlight.title || `Highlight ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                  onError={(e) => { 
                    console.log(`Image failed to load: ${e.target.src}`);
                    e.target.src = '/images/placeholder.jpg'; 
                  }}
                  loading="lazy"
                />
              </div>
              
              {/* Highlight Content */}
              <div className="p-6">
                {/* Highlight Title */}
                {highlight.title && (
                  <h3 className="text-xl font-semibold mb-3 text-gray-800">
                    {highlight.title}
                  </h3>
                )}
                
                {/* Highlight Description with HTML support */}
                <div
                  dangerouslySetInnerHTML={{
                    __html: highlight.description || highlight.content || 'No description available.'
                  }}
                  className="text-gray-600 prose prose-sm max-w-none"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}