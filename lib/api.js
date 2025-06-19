// lib/api.js - Updated fetchDealBySlug function

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

    // New function to transform destinations properly
    const transformDestinations = (destinations, title, slug) => {
      if (Array.isArray(destinations) && destinations.length > 0) {
        return destinations.map((destination, index) => {
          // Handle both object and string destinations
          if (typeof destination === 'string') {
            return {
              id: `dest-${index}`,
              name: destination,
              country: getCountryFromDestination(destination),
              description: `Explore the beautiful ${destination} with its rich culture and attractions.`,
              image: `${imageBaseUrl}images/destinations/${destination.toLowerCase()}.jpg`,
              url: `/destinations/${getRegionFromDestination(destination)}/${getCountryFromDestination(destination).toLowerCase()}/${destination.toLowerCase()}`,
            };
          } else {
            return {
              id: destination.id || `dest-${index}`,
              name: destination.name || destination.city || destination.destination || 'Unknown Destination',
              country: destination.country || getCountryFromDestination(destination.name || destination.city),
              description: destination.description || destination.content || `Discover the wonders of ${destination.name || destination.city}.`,
              image: destination.image || destination.imageUrl || 
                     (destination.imageUrl && destination.imageUrl.startsWith('http') 
                      ? destination.imageUrl 
                      : `${imageBaseUrl}${destination.imageUrl || destination.image}`) ||
                     `${imageBaseUrl}images/destinations/${(destination.name || destination.city || '').toLowerCase()}.jpg`,
              url: destination.url || `/destinations/${getRegionFromDestination(destination.name || destination.city)}/${getCountryFromDestination(destination.name || destination.city).toLowerCase()}/${(destination.name || destination.city || '').toLowerCase()}`,
            };
          }
        });
      } else {
        // If no destinations array, derive from title/slug
        const derivedDestinations = deriveDestinations(title, slug);
        return derivedDestinations.map((dest, index) => ({
          id: `derived-dest-${index}`,
          name: dest,
          country: getCountryFromDestination(dest),
          description: `Experience the magic of ${dest} with its unique attractions and cultural heritage.`,
          image: `${imageBaseUrl}images/destinations/${dest.toLowerCase()}.jpg`,
          url: `/destinations/${getRegionFromDestination(dest)}/${getCountryFromDestination(dest).toLowerCase()}/${dest.toLowerCase()}`,
        }));
      }
    };

    // Helper function to get country from destination name
    const getCountryFromDestination = (destinationName) => {
      const countryMap = {
        'bangkok': 'Thailand',
        'phuket': 'Thailand',
        'kyoto': 'Japan',
        'tokyo': 'Japan',
        'bali': 'Indonesia',
        'singapore': 'Singapore',
        'kuala lumpur': 'Malaysia',
        'ho chi minh': 'Vietnam',
        'hanoi': 'Vietnam',
      };
      return countryMap[destinationName?.toLowerCase()] || 'Unknown';
    };

    // Helper function to get region from destination name
    const getRegionFromDestination = (destinationName) => {
      const regionMap = {
        'bangkok': 'asia',
        'phuket': 'asia',
        'kyoto': 'asia',
        'tokyo': 'asia',
        'bali': 'asia',
        'singapore': 'asia',
        'kuala lumpur': 'asia',
        'ho chi minh': 'asia',
        'hanoi': 'asia',
      };
      return regionMap[destinationName?.toLowerCase()] || 'asia';
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
      // Updated destinations transformation
      destinations: transformDestinations(data.destinations, data.title, slug),
      excursions: transformExcursions(data.excursions),
      finePrint: data.finePrint || { image: null, description: '' },
      payment: data.payment || { image: null, description: '' },
    };

    console.log('Transformed destinations:', JSON.stringify(transformedData.destinations, null, 2));
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


