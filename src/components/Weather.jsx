import { useState } from "react";
import { getWeatherFarmingTip, getWeatherDescription } from "../utils";

const ICONS = {
  search: "https://cdn-icons-png.flaticon.com/128/751/751463.png",
  temp:   "https://cdn-icons-png.flaticon.com/128/4236/4236501.png",
  water:  "https://cdn-icons-png.flaticon.com/128/6552/6552242.png",
  wind:   "https://cdn-icons-png.flaticon.com/128/3058/3058338.png",
  crop:   "https://cdn-icons-png.flaticon.com/128/10367/10367636.png",
};

const urgencyStyles = {
  good:    "bg-emerald-50 border-emerald-200 text-emerald-800",
  warning: "bg-amber-50 border-amber-200 text-amber-800",
  danger:  "bg-red-50 border-red-200 text-red-800",
  caution: "bg-orange-50 border-orange-200 text-orange-800",
  neutral: "bg-blue-50 border-blue-200 text-blue-800",
};

export default function Weather() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchWeather = async () => {
    if (!city.trim()) { setError("Please enter a city name."); return; }
    setError(""); setLoading(true); setWeather(null);
    try {
      const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`);
      const geoData = await geoRes.json();
      if (!geoData.results?.length) { setError("City not found. Try another city name."); setLoading(false); return; }
      const { latitude, longitude, name, country } = geoData.results[0];
      const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=relativehumidity_2m&timezone=auto`);
      const weatherData = await weatherRes.json();
      const cw = weatherData.current_weather;
      const humidity = weatherData.hourly?.relativehumidity_2m?.[0] ?? "N/A";
      const desc = getWeatherDescription(cw.weathercode);
      const tip = getWeatherFarmingTip(cw.temperature, humidity, cw.windspeed, cw.weathercode);
      setWeather({ city: name, country, temp: Math.round(cw.temperature), humidity, windspeed: Math.round(cw.windspeed), description: desc.label, icon: desc.icon, tip });
    } catch { setError("Failed to fetch weather. Check your connection and try again."); }
    finally { setLoading(false); }
  };

  return (
    <section id="weather" className="py-20 bg-white px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <span className="inline-block text-[#4CAF50] font-semibold text-sm uppercase tracking-widest mb-3">Live Data</span>
          <h2 className="text-4xl font-black text-gray-900 mb-4">Weather <span className="text-[#1a3c2e]">Widget</span></h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">Real-time weather data powered by Open-Meteo. Get smart farming tips based on today's conditions.</p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="flex gap-3 mb-8">
            <input type="text" placeholder="Enter city name (e.g. Mumbai, Delhi, Pune...)"
              value={city} onChange={(e) => setCity(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && fetchWeather()}
              className="flex-1 px-5 py-4 rounded-2xl border-2 border-gray-200 focus:border-[#4CAF50] focus:outline-none text-gray-800 bg-white text-base" />
            <button onClick={fetchWeather} disabled={loading}
              className="px-6 py-4 bg-gradient-to-r from-[#1a3c2e] to-[#4CAF50] text-white font-bold rounded-2xl hover:from-[#4CAF50] hover:to-[#1a3c2e] transition-all duration-300 disabled:opacity-70 flex items-center gap-2 shadow-md">
              {loading ? (
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <img src={ICONS.search} alt="search" width="20" height="20" className="invert" />
              )}
              <span className="hidden sm:inline">Get Weather</span>
            </button>
          </div>

          {error && <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-700 text-sm mb-6">⚠️ {error}</div>}

          {weather && (
            <div className="bg-gradient-to-br from-[#0d2318] to-[#1a3c2e] rounded-3xl p-8 text-white shadow-2xl">
              <div className="flex items-start justify-between mb-8">
                <div>
                  <h3 className="text-3xl font-black">{weather.city}</h3>
                  <p className="text-[#74C69D]">{weather.country}</p>
                </div>
                <div className="text-center">
                  <div className="text-6xl">{weather.icon}</div>
                  <p className="text-[#74C69D] text-sm mt-1">{weather.description}</p>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                  { label: "Temperature", value: `${weather.temp}°C`,        icon: ICONS.temp },
                  { label: "Humidity",    value: `${weather.humidity}%`,      icon: ICONS.water },
                  { label: "Wind Speed",  value: `${weather.windspeed} km/h`, icon: ICONS.wind },
                ].map((item) => (
                  <div key={item.label} className="bg-white/15 rounded-2xl p-4 text-center">
                    <img src={item.icon} alt={item.label} width="28" height="28" className="invert mx-auto mb-2" />
                    <div className="text-xl font-black">{item.value}</div>
                    <div className="text-[#a5d6a7] text-xs mt-1">{item.label}</div>
                  </div>
                ))}
              </div>
              <div className={`rounded-2xl p-5 border ${urgencyStyles[weather.tip.urgency] || urgencyStyles.neutral}`}>
                <div className="flex items-center gap-2 mb-1">
                  <img src={ICONS.crop} alt="tip" width="16" height="16" className="opacity-70" />
                  <span className="font-bold text-sm">Farming Tip</span>
                </div>
                <p className="font-medium text-sm leading-relaxed">{weather.tip.tip}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}