import React from 'react';
import Image from 'next/image';

const HighlightsSection = ({ data }) => {
  if (!data?.highlight_image && !data?.highlight_description) return null;

  return (
    <section className="py-12 px-4 md:px-16 bg-white">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Highlights</h2>
      <div className="grid md:grid-cols-2 gap-6 items-center">
        {data.highlight_image && (
          <Image
            src={data.highlight_image}
            alt="Highlight"
            width={600}
            height={400}
            className="rounded-xl shadow"
          />
        )}
        <div
          className="prose max-w-none"
          dangerouslySetInnerHTML={{ __html: data.highlight_description }}
        />
      </div>
    </section>
  );
};

export default HighlightsSection;
