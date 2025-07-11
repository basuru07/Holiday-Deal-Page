export async function fetchDealBySlug(slug) {
  const endpoint = `https://api.techneapp-staging.site/api/deals/public/all/whv/${slug}`;
  try {
    const response = await fetch(endpoint, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log("Raw API Response:", JSON.stringify(data, null, 2));

    const imageBaseUrl = "https://api.techneapp-staging.site/";

    const parseHtmlList = (htmlString) => {
      if (!htmlString || typeof htmlString !== "string") return [];
      const matches = htmlString.match(/<li>(.*?)<\/li>/g);
      if (!matches) return [];
      return matches.map((match) =>
        match.replace(/<li>(.*?)<\/li>/, "$1").trim()
      );
    };

    const deriveDestinations = (title, slug) => {
      if (title && title.includes("Bangkok") && title.includes("Phuket")) {
        return ["Bangkok", "Phuket"];
      }
      return slug
        .split("-")
        .filter((word) =>
          ["kyoto", "bangkok", "phuket"].includes(word.toLowerCase())
        )
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1));
    };

    // Transform destinations based on actual API structure
    const transformDestinations = (
      dealDestinations,
      destinations,
      title,
      slug
    ) => {
      let destinationsToProcess = [];

      // Check if we have dealDestinations array (with nested destination objects)
      if (Array.isArray(dealDestinations) && dealDestinations.length > 0) {
        destinationsToProcess = dealDestinations;
      }
      // Otherwise check if we have direct destinations array
      else if (Array.isArray(destinations) && destinations.length > 0) {
        destinationsToProcess = destinations;
      }

      if (destinationsToProcess.length > 0) {
        return destinationsToProcess.map((item, index) => {
          // Handle dealDestinations structure (has nested destination object)
          const destination = item.destination || item;

          return {
            id: destination.id || `dest-${index}`,
            name: destination.name || destination.city || "Unknown Destination",
            country: destination.country || "Unknown Country",
            continent: destination.continent || "Unknown Continent",
            description:
              destination.description ||
              `Discover the wonders of ${
                destination.name || destination.city
              }.`,
            image: destination.image?.path
              ? `${imageBaseUrl}${destination.image.path}`
              : destination.image ||
                `${imageBaseUrl}images/destinations/default.jpg`,
            imageAlt:
              destination.image?.alt || `${destination.name} destination`,
            url: `/destinations/${(
              destination.continent || "asia"
            ).toLowerCase()}/${(
              destination.country || "unknown"
            ).toLowerCase()}/${(destination.name || "destination")
              .toLowerCase()
              .replace(/\s+/g, "-")}`,
            priceFrom: destination.priceFrom || 0,
            latitude: destination.latitude || null,
            longitude: destination.longitude || null,
            countryCode: destination.countryCode || "",
            iso: destination.iso || "",
            nights: item.noOfNights || 0,
            title: destination.title || `Holidays To ${destination.name}`,
          };
        });
      } else {
        // Fallback: derive from title/slug if no destination data
        const derivedDestinations = deriveDestinations(title, slug);
        return derivedDestinations.map((dest, index) => ({
          id: `derived-dest-${index}`,
          name: dest,
          country: getCountryFromDestination(dest),
          continent: "Asia",
          description: `Experience the magic of ${dest} with its unique attractions and cultural heritage.`,
          image: `${imageBaseUrl}images/destinations/${dest.toLowerCase()}.jpg`,
          imageAlt: `${dest} destination`,
          url: `/destinations/${getRegionFromDestination(
            dest
          )}/${getCountryFromDestination(
            dest
          ).toLowerCase()}/${dest.toLowerCase()}`,
          priceFrom: 0,
          latitude: null,
          longitude: null,
          countryCode: "",
          iso: dest.toUpperCase(),
          nights: 0,
          title: `Holidays To ${dest}`,
        }));
      }
    };

    // Helper function to get country from destination name
    const getCountryFromDestination = (destinationName) => {
      const countryMap = {
        bangkok: "Thailand",
        phuket: "Thailand",
        kyoto: "Japan",
        tokyo: "Japan",
        bali: "Indonesia",
        singapore: "Singapore",
        "kuala lumpur": "Malaysia",
        "ho chi minh": "Vietnam",
        hanoi: "Vietnam",
      };
      return countryMap[destinationName?.toLowerCase()] || "Unknown";
    };

    // Helper function to get region from destination name
    const getRegionFromDestination = (destinationName) => {
      const regionMap = {
        bangkok: "asia",
        phuket: "asia",
        kyoto: "asia",
        tokyo: "asia",
        bali: "asia",
        singapore: "asia",
        "kuala lumpur": "asia",
        "ho chi minh": "asia",
        hanoi: "asia",
      };
      return regionMap[destinationName?.toLowerCase()] || "asia";
    };

    const transformHighlights = (highlights) => {
      const highlightsArray = Array.isArray(highlights)
        ? highlights
        : highlights
        ? [highlights]
        : [];
      return highlightsArray.map((highlight, index) => ({
        id: highlight.id || `highlight-${index}`,
        image:
          highlight.image ||
          highlight.imageUrl ||
          (highlight.imageUrl && highlight.imageUrl.startsWith("http")
            ? highlight.imageUrl
            : highlight.imageUrl || highlight.image
            ? `${imageBaseUrl}${highlight.imageUrl || highlight.image}`
            : null) ||
          null,
        title: highlight.title || highlight.caption || highlight.name || "",
        description: highlight.description || highlight.content || "",
        ...highlight,
      }));
    };

    const transformItinerary = (itinerary) => {
      if (!Array.isArray(itinerary)) return [];
      return itinerary.map((item, index) => ({
        id: item.id || `itinerary-${index}`,
        day: item.day || item.dayNumber || index + 1,
        description:
          item.content ||
          item.description ||
          item.details ||
          "No description available",
        title: item.title || item.name || `Day ${item.day || index + 1}`,
        location: item.location || item.destination || "",
        image: item.image || item.imageUrl || null,
        imageAlt: item.imageAlt || null,
        ...item,
      }));
    };

    // Updated transformExcursions function to handle HTML string format
    const transformExcursions = (excursions) => {
      // If excursions is a string (HTML format), parse it
      if (typeof excursions === "string") {
        const matches = excursions.match(/<li>(.*?)<\/li>/g);
        if (!matches) return [];

        return matches.map((match, index) => {
          const description = match.replace(/<li>(.*?)<\/li>/, "$1").trim();
          // Decode HTML entities
          const decodedDescription = description
            .replace(/&amp;/g, "&")
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'");

          return {
            id: `excursion-${index}`,
            image: null, // No images provided in this format
            description: `<p>${decodedDescription}</p>`, // Wrap in paragraph tags for consistent HTML
            title:
              decodedDescription.split(" - ")[0] || `Excursion ${index + 1}`, // Extract title from description
            price: decodedDescription.match(/£(\d+)pp/)
              ? decodedDescription.match(/£(\d+)pp/)[0]
              : null,
          };
        });
      }

      // If excursions is already an array (existing format), use the original logic
      if (!Array.isArray(excursions)) return [];
      return excursions.map((excursion) => ({
        image:
          excursion.image ||
          excursion.imageUrl ||
          (excursion.imageUrl && excursion.imageUrl.startsWith("http")
            ? excursion.imageUrl
            : excursion.imageUrl
            ? `${imageBaseUrl}${excursion.imageUrl}`
            : null) ||
          null,
        description:
          excursion.description ||
          excursion.content ||
          "No description available",
        ...excursion,
      }));
    };

    // Alternative: If you want to extract more structured data, you could also do:
    const transformExcursionsDetailed = (excursions) => {
      if (typeof excursions === "string") {
        const matches = excursions.match(/<li>(.*?)<\/li>/g);
        if (!matches) return [];

        return matches.map((match, index) => {
          const fullText = match
            .replace(/<li>(.*?)<\/li>/, "$1")
            .trim()
            .replace(/&amp;/g, "&")
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'");

          // Try to split title and price
          const parts = fullText.split(" - ");
          const title = parts[0] || `Excursion ${index + 1}`;
          const priceMatch = fullText.match(/£(\d+)pp/);
          const price = priceMatch ? priceMatch[0] : null;

          // Remove price from description if it exists
          const description = price
            ? fullText.replace(` - ${price}`, "")
            : fullText;

          return {
            id: `excursion-${index}`,
            title: title,
            description: `<p>${description}</p>`,
            price: price,
            image: `/images/excursions/placeholder-${index + 1}.jpg`, // You could add default images
            fullText: fullText,
          };
        });
      }

      // Handle array format (if API sometimes returns arrays)
      if (!Array.isArray(excursions)) return [];
      return excursions.map((excursion) => ({
        image:
          excursion.image ||
          excursion.imageUrl ||
          (excursion.imageUrl && excursion.imageUrl.startsWith("http")
            ? excursion.imageUrl
            : excursion.imageUrl
            ? `${imageBaseUrl}${excursion.imageUrl}`
            : null) ||
          null,
        description:
          excursion.description ||
          excursion.content ||
          "No description available",
        ...excursion,
      }));
    };

    const transformHeroImages = (heroImages) => {
      if (!Array.isArray(heroImages) || heroImages.length === 0) {
        console.warn("No heroImages provided.");
        return [];
      }
      const images = heroImages
        .map((img, index) => {
          if (img?.path && typeof img.path === "string") {
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

    const firstDeparture =
      Array.isArray(data.departures) && data.departures.length > 0
        ? data.departures[0]
        : {};

    // Add this function to your API file, before the transformedData object

    const transformFinePrint = (finePrint) => {
      // If finePrint is null or undefined, return default structure
      if (!finePrint) {
        return {
          image: null,
          description: "",
        };
      }

      // If finePrint is a string (HTML content), treat it as description only
      if (typeof finePrint === "string") {
        return {
          image: null,
          description: finePrint,
        };
      }

      // If finePrint is an object, extract image and description
      if (typeof finePrint === "object") {
        let imageUrl = null;

        // Handle different image formats
        if (finePrint.image) {
          if (typeof finePrint.image === "string") {
            // If it's already a full URL
            if (finePrint.image.startsWith("http")) {
              imageUrl = finePrint.image;
            } else {
              // If it's a relative path
              imageUrl = `${imageBaseUrl}${finePrint.image}`;
            }
          } else if (finePrint.image.path) {
            // If it's an object with path property
            imageUrl = `${imageBaseUrl}${finePrint.image.path}`;
          }
        }

        // Handle different description formats
        let description = "";
        if (finePrint.description) {
          description = finePrint.description;
        } else if (finePrint.content) {
          description = finePrint.content;
        } else if (finePrint.text) {
          description = finePrint.text;
        }

        return {
          image: imageUrl,
          description: description,
          // Include any other properties that might be useful
          title: finePrint.title || null,
          ...finePrint,
        };
      }

      // Fallback
      return {
        image: null,
        description: "",
      };
    };

    // Then update your transformedData object to use this function:
    const transformedData = {
      hero: {
        title: data.title || data.dealName || data.name || "Untitled Deal",
        price: Number(data.price) || Number(data.salePrice) || 0,
        originalPrice:
          Number(data.farePrice) ||
          Number(data.originalPrice) ||
          Number(data.listPrice) ||
          0,
        discount:
          Number(data.discount) ||
          (data.farePrice && data.price
            ? Math.round(
                ((Number(data.farePrice) - Number(data.price)) /
                  Number(data.farePrice)) *
                  100
              )
            : 0),
        nights:
          Number(firstDeparture.nights) ||
          Number(data.nights) ||
          Number(data.duration) ||
          0,
        destinations: Array.isArray(data.destinations)
          ? data.destinations.map((dest) =>
              typeof dest === "string" ? dest : dest.name || dest.city || ""
            )
          : deriveDestinations(data.title || "", slug),
        expirationDate:
          data.expirationDate ||
          data.validUntil ||
          data.endDate ||
          new Date().toISOString(),
        heroImages: transformHeroImages(data.heroImages),
      },
      overview: {
        content: data.overview?.content || "",
        videoId: data.overview?.videoId || data.heroVideoId || "",
        secondaryVideoYoutubelink: data.secondaryVideoYoutubelink || "",
      },
      highlights: transformHighlights(data.highlights || data.highlight),
      itinerary: transformItinerary(data.itineraries || data.itinerary),
      hotels: Array.isArray(data.hotels)
        ? data.hotels.map((hotel) => ({
            ...hotel,
            name: hotel.name || "Unnamed Hotel",
            description: hotel.description || "No description available.",
            fullDescription:
              hotel.fullDescription ||
              hotel.description ||
              "No description available.",
            starRating: Number(hotel.rating) || Number(hotel.starRating) || 0,
            amenities: parseHtmlList(hotel.amenities),
            roomAmenities: parseHtmlList(hotel.roomAmenities),
            images: Array.isArray(hotel.images)
              ? hotel.images
                  .map((img) =>
                    typeof img === "string"
                      ? img
                      : img.imageUrl && img.imageUrl.startsWith("http")
                      ? img.imageUrl
                      : img.imageUrl
                      ? `${imageBaseUrl}${img.imageUrl}`
                      : null
                  )
                  .filter(Boolean)
              : [],
          }))
        : [],
      destinations: transformDestinations(
        data.dealDestinations,
        data.destinations,
        data.title,
        slug
      ),
      excursions: transformExcursions(data.excursions),

      // Updated finePrint transformation
      finePrint: transformFinePrint(data.finePrint),

      payment: data.payment || { image: null, description: "" },
    };

    // Add logging to see what finePrint data looks like
    console.log("Raw finePrint data:", JSON.stringify(data.finePrint, null, 2));
    console.log(
      "Transformed finePrint:",
      JSON.stringify(transformedData.finePrint, null, 2)
    );

    console.log(
      "Transformed destinations:",
      JSON.stringify(transformedData.destinations, null, 2)
    );
    console.log(
      "Transformed highlights:",
      JSON.stringify(transformedData.highlights, null, 2)
    );
    console.log(
      "Transformed itinerary:",
      JSON.stringify(transformedData.itinerary, null, 2)
    );
    console.log(
      "Transformed excursions:",
      JSON.stringify(transformedData.excursions, null, 2)
    );
    console.log(
      "Transformed hotels:",
      JSON.stringify(transformedData.hotels, null, 2)
    );
    console.log(
      "Transformed heroImages:",
      JSON.stringify(transformedData.hero.heroImages, null, 2)
    );
    console.log(
      "Transformed API Data:",
      JSON.stringify(transformedData.hero, null, 2)
    );

    return transformedData;
  } catch (error) {
    console.error("Error fetching deal:", error.message);
    throw error;
  }
}
