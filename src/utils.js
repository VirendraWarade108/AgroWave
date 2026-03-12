const fertilizerData = {
  Wheat: {
    Sandy: { type: "NPK Fertilizer (20-10-10)", baseKgPerAcre: 40, urea: 20, dap: 15 },
    Clay: { type: "Urea + DAP Blend", baseKgPerAcre: 35, urea: 18, dap: 12 },
    Loamy: { type: "NPK Fertilizer (15-15-15)", baseKgPerAcre: 30, urea: 15, dap: 10 },
  },
  Rice: {
    Sandy: { type: "Nitrogen-Rich Fertilizer", baseKgPerAcre: 50, urea: 28, dap: 18 },
    Clay: { type: "Slow-Release NPK", baseKgPerAcre: 45, urea: 25, dap: 15 },
    Loamy: { type: "Balanced NPK (16-8-8)", baseKgPerAcre: 40, urea: 22, dap: 13 },
  },
  Cotton: {
    Sandy: { type: "Potassium-Rich Fertilizer", baseKgPerAcre: 55, urea: 30, dap: 20 },
    Clay: { type: "NPK + Boron Mix", baseKgPerAcre: 48, urea: 27, dap: 17 },
    Loamy: { type: "Balanced NPK (14-14-14)", baseKgPerAcre: 42, urea: 23, dap: 14 },
  },
  Sugarcane: {
    Sandy: { type: "Heavy NPK Blend", baseKgPerAcre: 75, urea: 40, dap: 28 },
    Clay: { type: "Nitrogen + Phosphorus Mix", baseKgPerAcre: 65, urea: 35, dap: 24 },
    Loamy: { type: "Premium NPK (18-18-18)", baseKgPerAcre: 60, urea: 32, dap: 22 },
  },
  Vegetables: {
    Sandy: { type: "Organic Compost + NPK", baseKgPerAcre: 35, urea: 18, dap: 12 },
    Clay: { type: "Micro-Nutrient Rich Mix", baseKgPerAcre: 30, urea: 16, dap: 10 },
    Loamy: { type: "Bio-Fertilizer Blend", baseKgPerAcre: 25, urea: 13, dap: 8 },
  },
};

export const calculateFertilizer = (acres, crop, soil) => {
  if (!acres || !crop || !soil) return null;
  const acreNum = parseFloat(acres);
  if (isNaN(acreNum) || acreNum <= 0) return null;

  const data = fertilizerData[crop]?.[soil];
  if (!data) return null;

  return {
    fertilizerType: data.type,
    totalKg: Math.round(data.baseKgPerAcre * acreNum),
    ureaKg: Math.round(data.urea * acreNum),
    dapKg: Math.round(data.dap * acreNum),
    acres: acreNum,
    crop,
    soil,
  };
};

export const getWeatherFarmingTip = (temp, humidity, windspeed, weatherCode) => {
  if (weatherCode >= 51 && weatherCode <= 82) {
    return {
      tip: "🌧️ Rain expected – avoid fertilizing today. Perfect time to plan seeding.",
      urgency: "warning",
    };
  }
  if (weatherCode >= 95) {
    return {
      tip: "⛈️ Storm alert – stay indoors. Secure farming equipment immediately.",
      urgency: "danger",
    };
  }
  if (temp > 38) {
    return {
      tip: "🌡️ Extreme heat detected – irrigate crops early morning to prevent wilting.",
      urgency: "warning",
    };
  }
  if (temp > 30 && humidity < 40) {
    return {
      tip: "☀️ Hot and dry conditions – consider irrigation today. Crops need water.",
      urgency: "warning",
    };
  }
  if (humidity > 80) {
    return {
      tip: "💦 High humidity – watch for fungal diseases. Apply preventive fungicide.",
      urgency: "caution",
    };
  }
  if (windspeed > 30) {
    return {
      tip: "💨 Strong winds – avoid spraying pesticides. Wait for calmer weather.",
      urgency: "caution",
    };
  }
  if (temp >= 20 && temp <= 28 && humidity >= 50 && humidity <= 70) {
    return {
      tip: "✅ Perfect farming conditions! Great day for planting, spraying, and field work.",
      urgency: "good",
    };
  }
  return {
    tip: "🌤️ Moderate conditions – standard farm activities are safe to proceed.",
    urgency: "neutral",
  };
};

export const getWeatherDescription = (code) => {
  if (code === 0) return { label: "Clear Sky", icon: "☀️" };
  if (code <= 3) return { label: "Partly Cloudy", icon: "⛅" };
  if (code <= 9) return { label: "Foggy", icon: "🌫️" };
  if (code <= 19) return { label: "Drizzle", icon: "🌦️" };
  if (code <= 29) return { label: "Light Rain", icon: "🌧️" };
  if (code <= 39) return { label: "Snow", icon: "❄️" };
  if (code <= 49) return { label: "Freezing Drizzle", icon: "🌨️" };
  if (code <= 59) return { label: "Drizzle", icon: "🌦️" };
  if (code <= 69) return { label: "Rain", icon: "🌧️" };
  if (code <= 79) return { label: "Snow", icon: "❄️" };
  if (code <= 82) return { label: "Heavy Rain", icon: "⛈️" };
  if (code <= 99) return { label: "Thunderstorm", icon: "⛈️" };
  return { label: "Unknown", icon: "🌡️" };
};