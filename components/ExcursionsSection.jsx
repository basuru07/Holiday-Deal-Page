export default function ExcursionsSection({ excursions }) {
  return (
    <section id="excursions" className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">Included Excursions</h2>
        <div className="grid md:grid-cols-2 gap-12">
          {excursions.map((excursion, index) => (
            <div key={index} className="bg-white rounded-lg overflow-hidden shadow-lg">
              <div className="h-64">
                <img 
                  src={excursion.image || '/images/placeholder.jpg'} 
                  alt="Excursion" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6">
                <div 
                  dangerouslySetInnerHTML={{ __html: excursion.description }}
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