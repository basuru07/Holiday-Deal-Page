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
    // Transform API data to ensure correct structure
    return {
      hero: {
        title: data.dealName || data.title || 'Untitled Deal',
        price: data.price || 0,
        originalPrice: data.originalPrice || 0,
        discount: data.discount || 0,
        nights: data.nights || 0,
        destinations: Array.isArray(data.destinations) ? data.destinations : [],
        images: Array.isArray(data.images) ? data.images : ['/images/placeholder.jpg'],
        expirationDate: data.expirationDate || new Date().toISOString(),
      },
      overview: data.overview || { content: '', videoId: '' },
      highlights: Array.isArray(data.highlights) ? data.highlights : [],
      itinerary: Array.isArray(data.itinerary) ? data.itinerary : [],
      hotels: Array.isArray(data.hotels) ? data.hotels.map(hotel => ({
        ...hotel,
        name: hotel.name || 'Unnamed Hotel',
        description: hotel.description || 'No description available.',
        fullDescription: hotel.fullDescription || hotel.description || 'No description available.',
        starRating: hotel.starRating || 0,
        amenities: Array.isArray(hotel.amenities) ? hotel.amenities : [],
        roomAmenities: Array.isArray(hotel.roomAmenities) ? hotel.roomAmenities : [],
        images: Array.isArray(hotel.images) ? hotel.images : ['/images/placeholder.jpg'],
      })) : [],
      destinations: Array.isArray(data.destinations) ? data.destinations : [],
      excursions: Array.isArray(data.excursions) ? data.excursions : [],
      finePrint: data.finePrint || { image: '/images/placeholder.jpg', description: '' },
      payment: data.payment || { image: '/images/placeholder.jpg', description: '' },
    };
  } catch (error) {
    console.error('Error fetching deal:', error);
    throw error;
  }
}