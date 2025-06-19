// lib/api.js

export async function fetchDealBySlug(slug) {
  const endpoint = `https://api.techneapp-staging.site/api/deals/public/all/whv/${slug}`;
  try {
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Raw API Response:', JSON.stringify(data, null, 2));

    const imageBaseUrl = 'https://api.techneapp-staging.site/';

    const parseHtmlList = (htmlString) => {
      if (!htmlString || typeof htmlString !== 'string') return [];
      const matches = htmlString.match(/<li>(.*?)<\/li>/g);
      if (!matches) return [];
      return matches.map(match => match.replace(/<li>(.*?)<\/li>/, '$1').trim());
    };

    const deriveDestinations = (title, slug) => {
      if (title && title.includes('Bangkok') && title.includes('Phuket')) {
        return ['Bangkok', 'Phuket'];
      }
      return slug
        .split('-')
        .filter(word => ['kyoto', 'bangkok', 'phuket'].includes(word.toLowerCase()))
        .map(word => word.charAt(0).toUpperCase() + word.slice(1));
    };

    const transformHighlights = (highlights) => {
      const highlightsArray = Array.isArray(highlights) ? highlights : highlights ? [highlights] : [];
      return highlightsArray.map((highlight, index) => ({
        id: highlight.id || `highlight-${index}`,
        image: highlight.image || highlight.imageUrl ||
               (highlight.imageUrl && highlight.imageUrl.startsWith('http')
                ? highlight.imageUrl
                : (highlight.imageUrl || highlight.image ? `${imageBaseUrl}${highlight.imageUrl || highlight.image}` : null)
               ) || null,
        title: highlight.title || highlight.caption || highlight.name || '',
        description: highlight.description || highlight.content || '',
        ...highlight
      }));
    };

    const transformItinerary = (itinerary) => {
      if (!Array.isArray(itinerary)) return [];
      return itinerary.map((item, index) => ({
        id: item.id || `itinerary-${index}`,
        day: item.day || item.dayNumber || (index + 1),
        description: item.content || item.description || item.details || 'No description available',
        title: item.title || item.name || `Day ${item.day || (index + 1)}`,
        location: item.location || item.destination || '',
        image: item.image || item.imageUrl || null,
        imageAlt: item.imageAlt || null,
        ...item
      }));
    };

    const transformExcursions = (excursions) => {
      if (!Array.isArray(excursions)) return [];
      return excursions.map(excursion => ({
        image: excursion.image || excursion.imageUrl ||
               (excursion.imageUrl && excursion.imageUrl.startsWith('http')
                ? excursion.imageUrl
                : (excursion.imageUrl ? `${imageBaseUrl}${excursion.imageUrl}` : null)
               ) || null,
        description: excursion.description || excursion.content || 'No description available',
        ...excursion
      }));
    };

    const transformHeroImages = (heroImages) => {
      if (!Array.isArray(heroImages) || heroImages.length === 0) {
        console.warn('No heroImages provided.');
        return [];
      }
      const images = heroImages
        .map((img, index) => {
          if (img?.path && typeof img.path === 'string') {
            const url = `${imageBaseUrl}${img.path}`;
            console.log(`Transformed heroImage[${index}]:`, url);
            return url;
          }
          console.warn(`Invalid heroImage object at index ${index}:`, img);
          return null;
        })
        .filter(Boolean);
      return images;
    };

    const firstDeparture = Array.isArray(data.departures) && data.departures.length > 0 ? data.departures[0] : {};

    const transformedData = {
      hero: {
        title: data.title || data.dealName || data.name || 'Untitled Deal',
        price: Number(data.price) || Number(data.salePrice) || 0,
        originalPrice: Number(data.farePrice) || Number(data.originalPrice) || Number(data.listPrice) || 0,
        discount: Number(data.discount) ||
                  (data.farePrice && data.price ?
                    Math.round(((Number(data.farePrice) - Number(data.price)) / Number(data.farePrice)) * 100) : 0),
        nights: Number(firstDeparture.nights) || Number(data.nights) || Number(data.duration) || 0,
        destinations: Array.isArray(data.destinations) ?
                      data.destinations.map(dest => typeof dest === 'string' ? dest : dest.name || dest.city || '') :
                      deriveDestinations(data.title || '', slug),
        expirationDate: data.expirationDate || data.validUntil || data.endDate || new Date().toISOString(),
        heroImages: transformHeroImages(data.heroImages),
      },
      overview: {
        content: data.overview?.content || '',
        videoId: data.overview?.videoId || data.heroVideoId || '',
        secondaryVideoYoutubelink: data.secondaryVideoYoutubelink || ''
      },
      highlights: transformHighlights(data.highlights || data.highlight),
      itinerary: transformItinerary(data.itineraries || data.itinerary),
      hotels: Array.isArray(data.hotels) ? data.hotels.map(hotel => ({
        ...hotel,
        name: hotel.name || 'Unnamed Hotel',
        description: hotel.description || 'No description available.',
        fullDescription: hotel.fullDescription || hotel.description || 'No description available.',
        starRating: Number(hotel.rating) || Number(hotel.starRating) || 0,
        amenities: parseHtmlList(hotel.amenities),
        roomAmenities: parseHtmlList(hotel.roomAmenities),
        images: Array.isArray(hotel.images) ?
          hotel.images.map(img =>
            typeof img === 'string' ? img :
            (img.imageUrl && img.imageUrl.startsWith('http')) ? img.imageUrl :
            (img.imageUrl ? `${imageBaseUrl}${img.imageUrl}` : null)
          ).filter(Boolean) : [],
      })) : [],
      destinations: Array.isArray(data.destinations) ? data.destinations : [],
      excursions: transformExcursions(data.excursions),
      finePrint: data.finePrint || { image: null, description: '' },
      payment: data.payment || { image: null, description: '' },
    };

    console.log('Transformed highlights:', JSON.stringify(transformedData.highlights, null, 2));
    console.log('Transformed itinerary:', JSON.stringify(transformedData.itinerary, null, 2));
    console.log('Transformed excursions:', JSON.stringify(transformedData.excursions, null, 2));
    console.log('Transformed hotels:', JSON.stringify(transformedData.hotels, null, 2));
    console.log('Transformed heroImages:', JSON.stringify(transformedData.hero.heroImages, null, 2));
    console.log('Transformed API Data:', JSON.stringify(transformedData.hero, null, 2));

    return transformedData;
  } catch (error) {
    console.error('Error fetching deal:', error.message);
    throw error;
  }
}