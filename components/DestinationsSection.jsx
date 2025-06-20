import React from "react";
import DestinationCard from "./DestinationCard";

export default function DestinationsSection({
  destinations,
  setSelectedModal,
}) {
  console.log("DestinationsSection received destinations:", destinations);

  return (
    <section id="destinations" className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">
          Destinations You'll Visit
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {destinations && destinations.length > 0 ? (
            destinations.map((destination, index) => (
              <DestinationCard
                key={destination.id || `dest-${index}`}
                destination={destination}
                setSelectedModal={setSelectedModal}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-500 text-lg">
                No destinations available at the moment.
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Please check back later or contact support.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
