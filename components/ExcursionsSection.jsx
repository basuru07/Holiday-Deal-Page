import React from 'react';
import Image from 'next/image';

const ExcursionsSection = ({ data }) => {
  if (!data?.excursion_image && !data?.excursion_description) return null;

  return (
    <section className="py-12 px-4 md:px-16 bg-white">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Excursions</h2>
      <div className="grid md:grid-cols-2 gap-6 items-center">
        {data.excursion_image && (
          <Image
            src={data.excursion_image}
            alt="Excursion"
            width={600}
            height={400}
            className="rounded-xl shadow"
          />
        )}
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: data.excursion_description }}
        />
      </div>
    </section>
  );
};

export default ExcursionsSection;
