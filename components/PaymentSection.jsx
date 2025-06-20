import CountdownTimer from "./CountdownTimer";

export default function PaymentSection({ payment, hero }) {
  // Handle cases where payment might be a string or object
  const paymentDescription =
    typeof payment === "string" ? payment : payment?.description;
  const paymentImage = typeof payment === "string" ? null : payment?.image;

  // Verify the expiration date is valid
  const hasValidExpirationDate =
    hero?.expirationDate && !isNaN(new Date(hero.expirationDate));

  return (
    <section
      id="payment"
      className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8">Limited Time Offer!</h2>

          {/* Countdown Timer Section */}
          {hasValidExpirationDate && (
            <div className="bg-white/10 p-8 rounded-lg mb-8">
              <h3 className="text-2xl font-bold mb-4">Deal Expires In:</h3>
              <CountdownTimer targetDate={hero.expirationDate} />
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-8 items-center">
            <div>
              <img
                src={paymentImage || "/images/placeholder.jpg"}
                alt="Payment options"
                className="w-full h-64 object-cover rounded-lg"
              />
            </div>
            <div className="text-left">
              {/* Payment Description */}
              {paymentDescription && (
                <div
                  dangerouslySetInnerHTML={{ __html: paymentDescription }}
                  className="mb-6 prose prose-invert max-w-none"
                />
              )}

              {/* Pricing Information */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <div className="text-3xl font-bold">
                    ${hero?.price || "0"}
                  </div>
                  {hero?.originalPrice && (
                    <div className="text-lg line-through opacity-70">
                      ${hero.originalPrice}
                    </div>
                  )}
                </div>
                {hero?.originalPrice && hero?.price && (
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-300">
                      Save ${hero.originalPrice - hero.price}
                    </div>
                    <div className="text-sm">Per person</div>
                  </div>
                )}
              </div>

              <button className="w-full bg-green-500 hover:bg-green-600 text-white py-4 px-8 rounded-lg text-xl font-bold transform hover:scale-105 transition-all duration-300">
                Book Now - Secure Your Spot!
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
