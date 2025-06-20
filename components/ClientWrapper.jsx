"use client";

import { useState, useEffect } from "react";
import HeroSection from "./HeroSection";
import OverviewSection from "./OverviewSection";
import HighlightsSection from "./HighlightsSection";
import ItinerarySection from "./ItinerarySection";
import HotelsSection from "./HotelsSection";
import DestinationsSection from "./DestinationsSection";
import ExcursionsSection from "./ExcursionsSection";
import FinePrintSection from "./FinePrintSection";
import PaymentSection from "./PaymentSection";
import Modal from "./Modal";

export default function ClientWrapper({ deal, setSelectedModal, sections }) {
  const [activeSection, setActiveSection] = useState("hero");
  const [selectedModal, setSelectedModalState] = useState(null);

  useEffect(() => {
    setSelectedModalState(setSelectedModal);
  }, [setSelectedModal]);

  const scrollToSection = (sectionId) => {
    setActiveSection(sectionId);
    document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <HeroSection deal={deal.hero} scrollToSection={scrollToSection} />
      <OverviewSection overview={deal.overview} />
      <HighlightsSection highlights={deal.highlights} />
      <ItinerarySection itinerary={deal.itinerary} />
      <HotelsSection
        hotels={deal.hotels}
        setSelectedModal={setSelectedModalState}
      />
      <DestinationsSection
        destinations={deal.destinations}
        setSelectedModal={setSelectedModalState}
      />
      <ExcursionsSection excursions={deal.excursions} />
      <FinePrintSection finePrint={deal.finePrint} />
      <PaymentSection payment={deal.payment} hero={deal.hero} />
      <Modal
        isOpen={selectedModal !== null}
        onClose={() => setSelectedModalState(null)}
        data={selectedModal?.data}
        type={selectedModal?.type}
      />
    </>
  );
}
