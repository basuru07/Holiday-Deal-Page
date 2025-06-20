"use client";

const BASE_URL = "https://api.techneapp-staging.site/";

export default function HighlightsSection({ highlights }) {
  const highlightsArray = Array.isArray(highlights)
    ? highlights
    : highlights
    ? [highlights]
    : [];

  if (highlightsArray.length === 0) {
    return (
      <section id="highlights" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">
            Trip Highlights
          </h2>
          <div className="text-center text-gray-600">
            <p>No highlights available for this trip at the moment.</p>
            <p className="text-sm mt-2">
              Check back later for exciting trip highlights!
            </p>
          </div>
        </div>
      </section>
    );
  }

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return "/images/placeholder.jpg";

    let url = "";
    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
      url = imageUrl;
    } else if (imageUrl.startsWith("/")) {
      url = BASE_URL + imageUrl.slice(1);
    } else {
      url = BASE_URL + imageUrl;
    }
    console.log("Resolved image URL:", url);
    return url;
  };

  const formatHighlightDescription = (text) => {
    if (!text) return "";

    const lines = text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    let htmlOutput = "";
    let currentList = [];

    const flushList = () => {
      if (currentList.length) {
        htmlOutput +=
          "<ul class='list-disc pl-6 space-y-1'>" +
          currentList.map((item) => `<li>${item}</li>`).join("") +
          "</ul>";
        currentList = [];
      }
    };

    lines.forEach((line) => {
      if (/includes|stay|extra vibes|restaurants|attractions/i.test(line)) {
        flushList();
        htmlOutput += `<p class='font-semibold text-lg mt-4 mb-2 text-blue-800'>${line}</p>`;
      } else if (line.startsWith("-") || /^[•*]/.test(line)) {
        currentList.push(line.replace(/^[-•*]\s*/, ""));
      } else {
        flushList();
        htmlOutput += `<p>${line}</p>`;
      }
    });

    flushList();
    return htmlOutput;
  };

  return (
    <section
      id="highlights"
      className="py-20 bg-gradient-to-b from-gray-50 to-white"
    >
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-16 text-blue-900">
          Trip Highlights
        </h2>
        <div className="max-w-4xl mx-auto">
          {highlightsArray.map((highlight, index) => (
            <div
              key={highlight.id || `highlight-${index}`}
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 mb-8"
            >
              <div className="relative">
                <img
                  src={getImageUrl(highlight.image || highlight.imageUrl)}
                  alt={highlight.imageAlt || `Highlight ${index + 1}`}
                  className="w-full h-80 object-cover transition-transform duration-300 hover:scale-105"
                  onError={(e) => {
                    console.log(`Image failed to load: ${e.target.src}`);
                    e.target.src = "/images/placeholder.jpg";
                  }}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <span className="text-white text-xl font-semibold">
                    {highlight.title ||
                      highlight.overlayText ||
                      `Highlight ${index + 1}`}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <div
                  className="text-gray-700 text-base space-y-4"
                  dangerouslySetInnerHTML={{
                    __html: formatHighlightDescription(
                      highlight.description ||
                        highlight.content ||
                        "No description available."
                    ),
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
