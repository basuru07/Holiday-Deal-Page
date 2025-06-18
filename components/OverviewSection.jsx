import React from 'react';

const OverviewSection = ({ data }) => {
  if (!data?.overview && !data?.youtube_link) return null;

  // Function to convert YouTube watch URLs to embed URLs
  const getEmbedUrl = (url) => {
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname.includes('youtube.com')) {
        const videoId = urlObj.searchParams.get('v');
        if (videoId) return `https://www.youtube.com/embed/${videoId}`;
      }
      return url; // fallback to given URL if no videoId
    } catch {
      return url; // invalid URL fallback
    }
  };

  return (
    <section className="py-12 px-4 md:px-16 bg-gray-50">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Overview</h2>
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: data.overview }}
      />
      {data.youtube_link && (
        <div className="mt-8 aspect-video">
          <iframe
            src={getEmbedUrl(data.youtube_link)}
            title="YouTube Video"
            allowFullScreen
            className="w-full h-full rounded-lg shadow-md"
            aria-label="Embedded YouTube video"
          />
        </div>
      )}
    </section>
  );
};

export default OverviewSection;
