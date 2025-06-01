const hourlyCalculate = (data, prices) => {

    const duration = data.duration; // Default to 1 hour if not provided
    const pricePerHour = prices.pricePerHour; 
    const minFare = prices.minFare;

    console.log("Calculating hourly fare with duration:", duration, "pricePerHour:", pricePerHour, "minFare:", minFare);

    const firstPrice = duration * pricePerHour + minFare; 
    console.log("Calculated firstPrice:", firstPrice);

    if (firstPrice < minFare) {
        return minFare; // Ensure the price is at least the minimum fare
    }

    if( firstPrice === 0 || firstPrice === null || isNaN(firstPrice)) {
        return 0; // Cap the price at 1000
    }
    return parseFloat(firstPrice.toFixed(2)); // Round to 2 decimal places
}

module.exports = hourlyCalculate;
