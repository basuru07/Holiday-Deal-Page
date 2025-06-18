"use client";
import { useEffect, useState } from 'react';
import { use } from 'react';
import { fetchDeal } from '@/lib/api';
import { HeroSection } from '@/components/HeroSection';
import OverviewSection from '@/components/OverviewSection';
import HighlightsSection from '@/components/HighlightsSection';
import ItinerarySection from '@/components/ItinerarySection';
import { HotelsSection } from '@/components/HotelsSection';
import { DestinationsSection } from '@/components/DestinationsSection';
import ExcursionsSection from '@/components/ExcursionsSection';
import FinePrintSection from '@/components/FinePrintSection';
import { PaymentSection } from '@/components/PaymentSection';

export default function HolidayDealPage({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const [deal, setDeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Debug the params
  console.log("Raw params:", params);
  console.log("Params.slug:", params?.slug);

  useEffect(() => {
    async function getDeal() {
      try {
        // Decode and validate the slug
        let slug = decodeURIComponent(params?.slug || '');
        
        // Check for invalid slug patterns
        if (!slug || 
            slug === 'undefined' || 
            slug === '[object Object]' || 
            slug.includes('[object Object]') ||
            slug === 'null') {
          console.error('Invalid slug detected:', slug);
          throw new Error(`Invalid or missing slug parameter`);
        }
        
        console.log("Fetching data for slug:", slug);
        const data = await fetchDeal(slug);
        
        if (!data) {
          throw new Error('No data received from API');
        }
        
        setDeal(data);
        setLoading(false);
      } catch (err) {
        console.error("Error in getDeal:", err);
        setError(`Failed to load deal details: ${err.message}`);
        setLoading(false);
      }
    }

    if (params?.slug) {
      getDeal();
    } else {
      setError('No deal slug provided');
      setLoading(false);
    }
  }, [params?.slug]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading deal details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center max-w-md mx-auto p-6">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Deal Not Found</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => window.history.back()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // No deal data
  if (!deal) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <p className="text-gray-600">No deal data available</p>
        </div>
      </div>
    );
  }

  // Debug: Log the entire deal object to see its structure
  console.log("Full deal object:", deal);
  console.log("Deal keys:", Object.keys(deal));

  // Safe property access with fallbacks
  const safeGetProperty = (obj, path, fallback = null) => {
    if (!obj) return fallback;
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : fallback;
    }, obj);
  };

  // Check if value exists and is not empty
  const hasValue = (value) => {
    if (value === null || value === undefined) return false;
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'string') return value.trim().length > 0;
    if (typeof value === 'object') return Object.keys(value).length > 0;
    return Boolean(value);
  };

  // Extract data safely with multiple possible property names
  const dealData = {
    overview: safeGetProperty(deal, 'overview') || 
              safeGetProperty(deal, 'description') || 
              safeGetProperty(deal, 'summary'),
    
    videoUrl: safeGetProperty(deal, 'videoUrl') || 
              safeGetProperty(deal, 'video_url') || 
              safeGetProperty(deal, 'video') ||
              safeGetProperty(deal, 'media.video'),
    
    highlights: safeGetProperty(deal, 'highlights') || 
                safeGetProperty(deal, 'features') || 
                safeGetProperty(deal, 'benefits') ||
                [],
    
    itinerary: safeGetProperty(deal, 'itinerary') || 
               safeGetProperty(deal, 'schedule') || 
               safeGetProperty(deal, 'timeline') ||
               safeGetProperty(deal, 'days') ||
               [],
    
    hotels: safeGetProperty(deal, 'hotels') || 
            safeGetProperty(deal, 'accommodations') || 
            safeGetProperty(deal, 'lodging') ||
            [],
    
    destinations: safeGetProperty(deal, 'destinations') || 
                  safeGetProperty(deal, 'locations') || 
                  safeGetProperty(deal, 'places') ||
                  [],
    
    excursions: safeGetProperty(deal, 'excursions') || 
                safeGetProperty(deal, 'activities') || 
                safeGetProperty(deal, 'tours') ||
                safeGetProperty(deal, 'experiences') ||
                [],
    
    finePrint: safeGetProperty(deal, 'finePrint') || 
               safeGetProperty(deal, 'fine_print') || 
               safeGetProperty(deal, 'terms') ||
               safeGetProperty(deal, 'terms_and_conditions'),
    
    payment: safeGetProperty(deal, 'payment') || 
             safeGetProperty(deal, 'pricing') ||
             safeGetProperty(deal, 'price') ||
             safeGetProperty(deal, 'cost'),
    
    expirationDate: safeGetProperty(deal, 'expirationDate') || 
                    safeGetProperty(deal, 'expiration_date') || 
                    safeGetProperty(deal, 'expires_at') ||
                    safeGetProperty(deal, 'valid_until')
  };

  // Log extracted data for debugging
  console.log("Extracted deal data:", dealData);
  
  // Log which sections will be displayed
  console.log("Sections to display:", {
    hero: true,
    overview: hasValue(dealData.overview),
    highlights: hasValue(dealData.highlights),
    itinerary: hasValue(dealData.itinerary),
    hotels: hasValue(dealData.hotels),
    destinations: hasValue(dealData.destinations),
    excursions: hasValue(dealData.excursions),
    finePrint: hasValue(dealData.finePrint),
    payment: hasValue(dealData.payment)
  });

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Hero Section - Always show */}
      <HeroSection deal={deal} />
      
      {/* Overview Section */}
      {hasValue(dealData.overview) && (
        <OverviewSection 
          overview={dealData.overview} 
          videoUrl={dealData.videoUrl} 
        />
      )}
      
      {/* Highlights Section */}
      {hasValue(dealData.highlights) && (
        <HighlightsSection highlights={dealData.highlights} />
      )}
      
      {/* Itinerary Section */}
      {hasValue(dealData.itinerary) && (
        <ItinerarySection itinerary={dealData.itinerary} />
      )}
      
      {/* Hotels Section */}
      {hasValue(dealData.hotels) && (
        <HotelsSection hotels={dealData.hotels} />
      )}
      
      {/* Destinations Section */}
      {hasValue(dealData.destinations) && (
        <DestinationsSection destinations={dealData.destinations} />
      )}
      
      {/* Excursions Section */}
      {hasValue(dealData.excursions) && (
        <ExcursionsSection excursions={dealData.excursions} />
      )}
      
      {/* Fine Print Section */}
      {hasValue(dealData.finePrint) && (
        <FinePrintSection finePrint={dealData.finePrint} />
      )}
      
      {/* Payment Section */}
      {hasValue(dealData.payment) && (
        <PaymentSection 
          payment={dealData.payment} 
          expirationDate={dealData.expirationDate} 
        />
      )}
      
      {/* Debug info - Remove in production */}
      {process.env.NODE_ENV === 'development' && (
        <div className="bg-yellow-100 border border-yellow-400 p-4 m-4 rounded">
          <h3 className="font-bold">Debug Info:</h3>
          <pre className="text-xs overflow-auto">
            {JSON.stringify({ dealData, sections: {
              overview: hasValue(dealData.overview),
              highlights: hasValue(dealData.highlights),
              itinerary: hasValue(dealData.itinerary),
              hotels: hasValue(dealData.hotels),
              destinations: hasValue(dealData.destinations),
              excursions: hasValue(dealData.excursions),
              finePrint: hasValue(dealData.finePrint),
              payment: hasValue(dealData.payment)
            }}, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}