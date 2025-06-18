export default function HighlightsSection({ highlights }) {
  return (
    <section id="highlights" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">Trip Highlights</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {highlights.map((highlight, index) => (
            <div key={index} className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
              <div className="h-64">
                <img 
                  src={highlight.image || '/images/placeholder.jpg'} 
                  alt="Highlight" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <div 
                  dangerouslySetInnerHTML={{ __html: highlight.description }}
                  className="text-gray-600"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}