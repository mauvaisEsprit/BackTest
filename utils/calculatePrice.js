
const calculatePrice = (distanceInKm, Prices) => {
  if (!Prices?.pricePerKm || !Prices?.minFare) return 0;

  let basePrice = Prices.pricePerKm;
  let minPriceForEnter = Prices.minFare;
  let pricePerKm;

  if (distanceInKm <= 100) {
    pricePerKm = basePrice * 1.3;
  } else if (distanceInKm <= 300) {
    pricePerKm = basePrice * 1.15;
  } else {
    pricePerKm = basePrice;
  }

  let price = distanceInKm * pricePerKm + minPriceForEnter;
  if (price < minPriceForEnter) {
    price = minPriceForEnter;
  }
  

  return parseFloat(price.toFixed(2));
};

module.exports = calculatePrice;