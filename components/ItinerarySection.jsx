import React from 'react';

const ItinerarySection = ({ data }) => {
  if (!data?.itinerary?.length) return null;

  return (
    <section className="py-12 px-4 md:px-16 bg-gray-50">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Itinerary</h2>
      <div className="space-y-6">
        {data.itinerary.map((item, idx) => (
          <div key={idx} className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold text-xl mb-2">Day {item.day}</h3>
            <div
              className="prose max-w-none"
              dangerouslySetInnerHTML={{ __html: item.description }}
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default ItinerarySection;
