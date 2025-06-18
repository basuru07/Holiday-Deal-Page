import React from 'react';
import Image from 'next/image';

const FinePrintSection = ({ data }) => {
  if (!data?.fineprint_image && !data?.fineprint_description) return null;

  return (
    <section className="py-12 px-4 md:px-16 bg-gray-50">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Fine Print</h2>
      <div className="grid md:grid-cols-2 gap-6 items-center">
        {data.fineprint_image && (
          <Image
            src={data.fineprint_image}
            alt="Fine Print"
            width={600}
            height={400}
            className="rounded-xl shadow"
          />
        )}
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: data.fineprint_description }}
        />
      </div>
    </section>
  );
};

export default FinePrintSection;
