export default function FinePrintSection({ finePrint }) {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <img 
              src={finePrint.image || '/images/placeholder.jpg'} 
              alt="Fine Print" 
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>
          <div>
            <div 
              dangerouslySetInnerHTML={{ __html: finePrint.description }}
              className="text-gray-700 space-y-4"
            />
          </div>
        </div>
      </div>
    </section>
  );
}