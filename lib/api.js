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

    // Base URL for images
    const imageBaseUrl = 'https://api.techneapp-staging.site/';

    // Extract destinations from title or slug
    const deriveDestinations = (title, slug) => {
      if (title.includes('Bangkok') && title.includes('Phuket')) {
        return ['Bangkok', 'Phuket'];
      }
      return slug
        .split('-')
        .filter(word => ['kyoto', 'bangkok', 'phuket'].includes(word.toLowerCase()))
        .map(word => word.charAt(0).toUpperCase() + word.slice(1));
    };

    // Transform highlights data
    const transformHighlights = (highlights) => {
      // Handle single object or array
      const highlightsArray = Array.isArray(highlights) ? highlights : highlights ? [highlights] : [];
      return highlightsArray.map((highlight, index) => ({
        id: highlight.id || `highlight-${index}`, // Ensure unique ID
        image: highlight.image || highlight.imageUrl || 
               (highlight.imageUrl && highlight.imageUrl.startsWith('http') 
                ? highlight.imageUrl 
                : `${imageBaseUrl}${highlight.imageUrl || highlight.image || ''}`) || '/images/placeholder.jpg',
        title: highlight.title || highlight.caption || highlight.name || '',
        description: highlight.description || highlight.content || '',
        ...highlight
      }));
    };

    // Transform itinerary data
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

    // Transform excursions data
    const transformExcursions = (excursions) => {
      if (!Array.isArray(excursions)) return [];
      return excursions.map(excursion => ({
        image: excursion.image || excursion.imageUrl || 
               (excursion.imageUrl && excursion.imageUrl.startsWith('http') 
                ? excursion.imageUrl 
                : `${imageBaseUrl}${excursion.imageUrl}`) || '/images/placeholder.jpg',
        description: excursion.description || excursion.content || 'No description available',
        ...excursion
      }));
    };

    // Get nights from first departure, if available
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
      },
      overview: {
        content: data.overview?.content || '',
        videoId: data.overview?.videoId || data.heroVideoId || '',
        secondaryVideoYoutubelink: data.secondaryVideoYoutubelink || ''
      },
      highlights: transformHighlights(data.highlights || data.highlight), // Handle both field names
      itinerary: transformItinerary(data.itineraries || data.itinerary),
      hotels: Array.isArray(data.hotels) ? data.hotels.map(hotel => ({
        ...hotel,
        name: hotel.name || 'Unnamed Hotel',
        description: hotel.description || 'No description available.',
        fullDescription: hotel.fullDescription || hotel.description || 'No description available.',
        starRating: Number(hotel.starRating) || 0,
        amenities: Array.isArray(hotel.amenities) ? hotel.amenities : [],
        roomAmenities: Array.isArray(hotel.roomAmenities) ? hotel.roomAmenities : [],
        images: Array.isArray(hotel.images) ? hotel.images : ['/images/placeholder.jpg'],
      })) : [],
      destinations: Array.isArray(data.destinations) ? data.destinations : [],
      excursions: transformExcursions(data.excursions),
      finePrint: data.finePrint || { image: '/images/placeholder.jpg', description: '' },
      payment: data.payment || { image: '/images/placeholder.jpg', description: '' },
    };

    console.log('Transformed highlights:', JSON.stringify(transformedData.highlights, null, 2));
    console.log('Transformed itinerary:', JSON.stringify(transformedData.itinerary, null, 2));
    console.log('Transformed excursions:', JSON.stringify(transformedData.excursions, null, 2));
    console.log('Transformed API Data:', JSON.stringify(transformedData.hero, null, 2));
    return transformedData;
  } catch (error) {
    console.error('Error fetching deal:', error.message);
    throw error;
  }
}