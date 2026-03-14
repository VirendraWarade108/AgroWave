import { useState } from "react";
import { cropCalendarData } from "../data";

const seasons = ["All", "Spring", "Summer", "Winter"];

const SEASON_ICONS = {
  All:    "https://cdn-icons-png.flaticon.com/128/12721/12721239.png",
  Spring: "https://cdn-icons-png.flaticon.com/128/7096/7096474.png",
  Summer: "https://cdn-icons-png.flaticon.com/128/4236/4236501.png",
  Winter: "https://cdn-icons-png.flaticon.com/128/626/626641.png",
};

const CROP_ICONS = {
  Wheat:    "https://cdn-icons-png.flaticon.com/128/6327/6327254.png",
  Rice:     "https://cdn-icons-png.flaticon.com/128/898/898133.png",
  Cotton:   "https://cdn-icons-png.flaticon.com/128/4737/4737427.png",
  Sugarcane:"https://cdn-icons-png.flaticon.com/128/5670/5670633.png",
  Corn:     "https://cdn-icons-png.flaticon.com/128/3944/3944286.png",
  Tomatoes: "https://cdn-icons-png.flaticon.com/128/7291/7291802.png",
};

const waterColor = {
  Low: "text-blue-400", Moderate: "text-blue-500",
  High: "text-blue-600", "Very High": "text-blue-700",
};

export default function CropCalendar() {
  const [filter, setFilter] = useState("All");
  const filtered = filter === "All" ? cropCalendarData : cropCalendarData.filter((c) => c.season === filter);

  return (
    <section id="calendar" className="py-20 bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <span className="inline-block text-[#4CAF50] font-semibold text-sm uppercase tracking-widest mb-3">Planting Guide</span>
          <h2 className="text-4xl font-black text-gray-900 mb-4">Seasonal Crop <span className="text-[#1a3c2e]">Calendar</span></h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">Know the perfect time to plant each crop. Stay ahead of every season.</p>
        </div>

        {/* Season Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {seasons.map((s) => (
            <button key={s} onClick={() => setFilter(s)}
              className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-200 ${
                filter === s ? "bg-[#1a3c2e] text-white shadow-md scale-105" : "bg-white text-gray-600 border border-gray-200 hover:border-[#4CAF50] hover:text-[#1a3c2e]"
              }`}>
              <img src={SEASON_ICONS[s]} alt={s} width="16" height="16"
                className={filter === s ? "invert" : ""} />
              {s}
            </button>
          ))}
        </div>

        {/* Crop Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((crop) => (
            <div key={crop.id}
              className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 hover:-translate-y-1">
              {/* Card Header */}
              <div className={`bg-gradient-to-r ${crop.color} p-6 flex items-center gap-4`}>
                <div className="w-16 h-16 bg-white/30 rounded-2xl flex items-center justify-center shrink-0">
                  <img src={CROP_ICONS[crop.name]} alt={crop.name} width="40" height="40" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-white">{crop.name}</h3>
                  <span className="inline-block mt-1 px-3 py-0.5 bg-white/25 text-white text-xs font-semibold rounded-full">{crop.season}</span>
                </div>
              </div>
              {/* Card Body */}
              <div className="p-6">
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {[
                    { label: "Plant Month",   value: crop.plantingMonth,  icon: "https://cdn-icons-png.flaticon.com/128/346/346246.png" },
                    { label: "Harvest Month", value: crop.harvestMonth,   icon: "https://cdn-icons-png.flaticon.com/128/10367/10367636.png" },
                    { label: "Water Needs",   value: crop.waterNeeds,     icon: "https://cdn-icons-png.flaticon.com/128/6552/6552242.png", color: waterColor[crop.waterNeeds] },
                    { label: "Best Soil",     value: crop.bestSoil,       icon: "https://cdn-icons-png.flaticon.com/128/18132/18132706.png" },
                  ].map((item) => (
                    <div key={item.label} className="bg-gray-50 rounded-xl p-3">
                      <div className="flex items-center gap-1.5 mb-1">
                        <img src={item.icon} alt={item.label} width="12" height="12" className="opacity-50" />
                        <p className="text-xs text-gray-400">{item.label}</p>
                      </div>
                      <p className={`font-bold text-sm ${item.color || "text-gray-800"}`}>{item.value}</p>
                    </div>
                  ))}
                </div>
                <a href="https://48cdqc-i6.myshopify.com/collections/all?sort_by=title-ascending"
                  target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 text-sm font-bold text-[#1a3c2e] bg-[#4CAF50]/20 hover:bg-[#1a3c2e] hover:text-white rounded-xl transition-all duration-200">
                  <img src="https://cdn-icons-png.flaticon.com/128/17787/17787183.png" alt="shop" width="14" height="14" className="opacity-70 group-hover:invert" />
                  Shop Related Products
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}