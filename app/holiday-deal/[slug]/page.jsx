"use client";

import { useState, useEffect } from "react";
import HeroSection from "@/components/HeroSection";
import OverviewSection from "@/components/OverviewSection";
import HighlightsSection from "@/components/HighlightsSection";
import ItinerarySection from "@/components/ItinerarySection";
import HotelsSection from "@/components/HotelsSection";
import DestinationsSection from "@/components/DestinationsSection";
import ExcursionsSection from "@/components/ExcursionsSection";
import FinePrintSection from "@/components/FinePrintSection";
import PaymentSection from "@/components/PaymentSection";
import Modal from "@/components/Modal";
import { fetchDealBySlug } from "@/lib/api";

export default function HolidayDealPage({ params }) {
  const [selectedModal, setSelectedModal] = useState(null);
  const [activeSection, setActiveSection] = useState("hero");
  const [dealData, setDealData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getSlug = async () => {
    if (params instanceof Promise) {
      const resolvedParams = await params;
      return resolvedParams.slug;
    }
    return params.slug;
  };

  useEffect(() => {
    async function loadDeal() {
      try {
        setLoading(true);
        setError(null);
        const slug = await getSlug();

        if (!slug) {
          throw new Error("No slug provided");
        }

        const data = await fetchDealBySlug(slug);
        console.log("Deal Data Loaded:", JSON.stringify(data.hero, null, 2));
        console.log("Hero Images:", data.hero.images);
        console.log(
          "Highlights with images:",
          data.highlights.map((h) => ({ title: h.title, image: h.image }))
        );
        console.log(
          "Hotels with images:",
          data.hotels.map((h) => ({
            name: h.name,
            mainImage: h.mainImage,
            images: h.images,
          }))
        );

        setDealData(data);
      } catch (err) {
        console.error("Failed to load deal:", err.message);
        setError(`Failed to load deal: ${err.message}`);
      } finally {
        setLoading(false);
      }
    }
    loadDeal();
  }, [params]);

  const sections = [
    { id: "hero", label: "Overview" },
    { id: "highlights", label: "Highlights" },
    { id: "itinerary", label: "Itinerary" },
    { id: "hotels", label: "Hotels" },
    { id: "destinations", label: "Destinations" },
    { id: "excursions", label: "Excursions" },
    { id: "payment", label: "Book Now" },
  ];

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading deal...</p>
        </div>
      </div>
    );
  }

  if (error || !dealData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="mb-4">
            <svg
              className="w-16 h-16 text-red-500 mx-auto"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Deal Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            {error ||
              "Sorry, we couldn't load this deal. Please check the URL and try again."}
          </p>
          <button
            onClick={() => (window.location.href = "/")}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="fixed top-0 left-0 right-0 bg-white shadow-lg z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="font-bold text-xl text-blue-600">TravelDeals</div>
            <div className="hidden md:flex space-x-6">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(section.id)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeSection === section.id
                      ? "text-blue-600 bg-blue-50"
                      : "text-gray-700 hover:text-blue-600"
                  }`}
                >
                  {section.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </nav>

      <HeroSection deal={dealData.hero} scrollToSection={scrollToSection} />
      <OverviewSection overview={dealData.overview} />
      <HighlightsSection highlights={dealData.highlights} />
      <ItinerarySection itinerary={dealData.itinerary} />
      <HotelsSection
        hotels={dealData.hotels}
        setSelectedModal={setSelectedModal}
      />
      <DestinationsSection
        destinations={dealData.destinations}
        setSelectedModal={setSelectedModal}
      />
      <ExcursionsSection excursions={dealData.excursions} />
      <FinePrintSection finePrint={dealData.finePrint} />
      <PaymentSection payment={dealData.payment} hero={dealData.hero} />

      <Modal
        isOpen={selectedModal !== null}
        onClose={() => setSelectedModal(null)}
        data={selectedModal?.data}
        type={selectedModal?.type}
      />

      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-6">
            <h3 className="text-2xl font-bold mb-2">TravelDeals</h3>
            <p className="text-gray-400">
              Creating unforgettable experiences worldwide
            </p>
          </div>
          <div className="flex items-center justify-center space-x-8 mb-6">
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2a10 10 0 100 20 10 10 0 000-20zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              </svg>
              <span className="text-sm">24/7 Support</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16 8a4 4 0 00-8 0 4 4 0 008 0zm-4 6a6 6 0 016-6h2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2zm-6 6a6 6 0 01-6-6H2v-2a2 2 0 012-2h2a2 2 0 012 2v2H6z" />
              </svg>
              <span className="text-sm">Expert Guides</span>
            </div>
            <div className="flex items-center space-x-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M19 3H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0 00-2-2zm-1 14H6v-2h12v2zm0-4H6v-2h12v2zm0-4H6V7h12v2z" />
              </svg>
              <span className="text-sm">Flexible Booking</span>
            </div>
          </div>
          <div className="text-sm text-gray-400">
            © 2025 TravelDeals. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
