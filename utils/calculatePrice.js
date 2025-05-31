const calculatePrice = (distanceInKm, Prices, isRoundTrip) => {
  if (!Prices?.pricePerKm || !Prices?.minFare) return 0;

  let basePrice = Prices.pricePerKm;
  let minPriceForEnter = Prices.minFare;
  let coefForRoundTrip = Prices.coefForRoundTrip || 1;
  let pricePerKm;

  if (distanceInKm <= 100) {
    pricePerKm = basePrice * 1.3;
  } else if (distanceInKm <= 300) {
    pricePerKm = basePrice * 1.15;
  } else {
    pricePerKm = basePrice;
  }

  let adjustedPrice = distanceInKm * pricePerKm + minPriceForEnter;
  if (adjustedPrice < minPriceForEnter) {
    adjustedPrice = minPriceForEnter;
  }

  const numericPrice = Number(adjustedPrice);
  console.log("Расчетная цена:", numericPrice);
  const price = !isNaN(numericPrice)
    ? isRoundTrip ? numericPrice * coefForRoundTrip : numericPrice : null;
    console.log(coefForRoundTrip, "Коэффициент для обратной поездки:", isRoundTrip);
console.log("Цена после проверки на NaN:", price);
  if (price === null) return 0;

  return parseFloat(price.toFixed(2));
};

module.exports = calculatePrice;
