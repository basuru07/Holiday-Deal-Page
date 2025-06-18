import { Play } from 'lucide-react';
import { useState } from 'react';

export default function OverviewSection({ overview }) {
  const [showVideo, setShowVideo] = useState(false);

  // Extract video ID from the YouTube link if available
  const videoId = overview.secondaryVideoYoutubelink 
    ? overview.secondaryVideoYoutubelink.split('youtu.be/')[1]?.split('?')[0] || 
      overview.secondaryVideoYoutubelink.split('v=')[1]?.split('&')[0]
    : null;

  const handlePlayVideo = () => {
    setShowVideo(true);
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl font-bold mb-6 text-gray-800">About This Experience</h2>
            <div 
              className="text-lg text-gray-600 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: overview.content }}
            />
          </div>
          <div className="relative">
            <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
              {videoId && showVideo ? (
                <iframe
                  src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="w-full h-full"
                ></iframe>
              ) : (
                <>
                  <img 
                    src={videoId ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg` : '/images/placeholder.jpg'}
                    alt="Video thumbnail"
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.src = '/images/placeholder.jpg'; }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button 
                      onClick={handlePlayVideo}
                      className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-full transform hover:scale-110 transition-all duration-200 shadow-lg"
                      disabled={!videoId}
                    >
                      <Play size={32} />
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}