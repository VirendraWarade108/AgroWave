import { useState } from "react";
import { cropCalendarData } from "../data";

const seasons = ["All", "Spring", "Summer", "Winter"];

const waterColor = {
  Low: "text-blue-400",
  Moderate: "text-blue-500",
  High: "text-blue-600",
  "Very High": "text-blue-700",
};

export default function CropCalendar() {
  const [filter, setFilter] = useState("All");

  const filtered =
    filter === "All" ? cropCalendarData : cropCalendarData.filter((c) => c.season === filter);

  return (
    <section id="calendar" className="py-20 bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <span className="inline-block text-[#40916C] font-semibold text-sm uppercase tracking-widest mb-3">Planting Guide</span>
          <h2 className="text-4xl font-black text-gray-900 mb-4">
            Seasonal Crop <span className="text-[#2D6A4F]">Calendar</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Know the perfect time to plant each crop. Stay ahead of every season.
          </p>
        </div>

        {/* Season Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {seasons.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 ${
                filter === s
                  ? "bg-[#2D6A4F] text-white shadow-md scale-105"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-[#74C69D] hover:text-[#2D6A4F]"
              }`}
            >
              {s === "All" ? "🌍 All" : s === "Spring" ? "🌸 Spring" : s === "Summer" ? "☀️ Summer" : "❄️ Winter"}
            </button>
          ))}
        </div>

        {/* Crop Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((crop) => (
            <div
              key={crop.id}
              className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 hover:-translate-y-1"
            >
              {/* Card Header */}
              <div className={`bg-gradient-to-r ${crop.color} p-6 flex items-center gap-4`}>
                <span className="text-5xl">{crop.emoji}</span>
                <div>
                  <h3 className="text-xl font-black text-white">{crop.name}</h3>
                  <span className="inline-block mt-1 px-3 py-0.5 bg-white/25 text-white text-xs font-semibold rounded-full">
                    {crop.season}
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-400 mb-1">🌱 Plant Month</p>
                    <p className="font-bold text-gray-800">{crop.plantingMonth}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-400 mb-1">🌾 Harvest Month</p>
                    <p className="font-bold text-gray-800">{crop.harvestMonth}</p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-400 mb-1">💧 Water Needs</p>
                    <p className={`font-bold ${waterColor[crop.waterNeeds] || "text-gray-800"}`}>
                      {crop.waterNeeds}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-xl p-3">
                    <p className="text-xs text-gray-400 mb-1">🪱 Best Soil</p>
                    <p className="font-bold text-gray-800">{crop.bestSoil}</p>
                  </div>
                </div>

                <a
                  href="https://48cdqc-i6.myshopify.com/collections/all"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full py-3 text-center text-sm font-bold text-[#2D6A4F] bg-[#74C69D]/20 hover:bg-[#2D6A4F] hover:text-white rounded-xl transition-all duration-200"
                >
                  🛒 Shop Related Products
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}