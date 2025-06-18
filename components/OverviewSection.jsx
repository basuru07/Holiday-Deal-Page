import { Play } from 'lucide-react';

export default function OverviewSection({ overview }) {
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
            <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-lg overflow-hidden">
              <img 
                src={overview.videoId ? `https://img.youtube.com/vi/${overview.videoId}/maxresdefault.jpg` : '/images/placeholder.jpg'}
                alt="Video thumbnail"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="bg-red-600 hover:bg-red-700 text-white p-4 rounded-full transform hover:scale-110 transition-all">
                  <Play size={32} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}