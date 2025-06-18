export async function fetchDeal(slug) {
  try {
    // Validate slug before making request
    if (!slug || typeof slug !== 'string' || slug.trim() === '') {
      throw new Error('Invalid slug provided');
    }

    // Clean the slug
    const cleanSlug = slug.trim();
    console.log(`Fetching deal for slug: "${cleanSlug}"`);
    
    const url = `https://api.techneapp-staging.site/api/deals/public/all/whv/${encodeURIComponent(cleanSlug)}`;
    console.log(`Request URL: ${url}`);
    
    const response = await fetch(url, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      },
      // Add timeout
      signal: AbortSignal.timeout(30000) // 30 seconds timeout
    });

    console.log(`Response status: ${response.status}`);
    console.log(`Response ok: ${response.ok}`);

    if (!response.ok) {
      let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
      
      try {
        const errorText = await response.text();
        if (errorText) {
          errorMessage += ` - ${errorText}`;
        }
      } catch (textError) {
        console.warn('Could not read error response text:', textError);
      }
      
      console.error(`API Error: ${errorMessage}`);
      
      // Provide specific error messages for common HTTP status codes
      switch (response.status) {
        case 404:
          throw new Error(`Deal not found: "${cleanSlug}"`);
        case 403:
          throw new Error('Access denied to this deal');
        case 500:
          throw new Error('Server error - please try again later');
        case 503:
          throw new Error('Service temporarily unavailable');
        default:
          throw new Error(`Failed to fetch deal: ${errorMessage}`);
      }
    }

    let data;
    try {
      data = await response.json();
    } catch (jsonError) {
      console.error('Failed to parse JSON response:', jsonError);
      throw new Error('Invalid response format from server');
    }

    console.log('Raw API response:', data);
    
    // Validate that we received data
    if (!data) {
      throw new Error('No data received from API');
    }
    
    // Log the structure of the response for debugging
    if (typeof data === 'object') {
      console.log('API response keys:', Object.keys(data));
      
      // Log nested structure
      Object.keys(data).forEach(key => {
        const value = data[key];
        if (value !== null && typeof value === 'object') {
          if (Array.isArray(value)) {
            console.log(`${key}: Array with ${value.length} items`);
            if (value.length > 0) {
              console.log(`${key}[0] structure:`, typeof value[0] === 'object' ? Object.keys(value[0]) : typeof value[0]);
            }
          } else {
            console.log(`${key} structure:`, Object.keys(value));
          }
        } else {
          console.log(`${key}:`, typeof value, value !== null ? `(${String(value).substring(0, 50)}${String(value).length > 50 ? '...' : ''})` : '(null)');
        }
      });
    }
    
    return data;
  } catch (error) {
    // Handle different types of errors
    if (error.name === 'AbortError') {
      console.error('Request timeout');
      throw new Error('Request timed out - please check your connection');
    } else if (error.name === 'TypeError' && error.message.includes('fetch')) {
      console.error('Network error:', error);
      throw new Error('Network error - please check your internet connection');
    } else {
      console.error('Fetch deal error:', error);
      throw error;
    }
  }
}