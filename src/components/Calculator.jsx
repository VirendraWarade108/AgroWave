import { useState } from "react";
import { calculateFertilizer } from "../utils";

const crops = ["Wheat", "Rice", "Cotton", "Sugarcane", "Vegetables"];
const soils = ["Sandy", "Clay", "Loamy"];

export default function Calculator() {
  const [acres, setAcres] = useState("");
  const [crop, setCrop] = useState("");
  const [soil, setSoil] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCalculate = () => {
    setError("");
    if (!acres || !crop || !soil) {
      setError("Please fill in all fields to get your recommendation.");
      return;
    }
    setLoading(true);
    setResult(null);
    setTimeout(() => {
      const r = calculateFertilizer(acres, crop, soil);
      setResult(r);
      setLoading(false);
    }, 900);
  };

  return (
    <section id="calculator" className="py-20 bg-white px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <span className="inline-block text-[#40916C] font-semibold text-sm uppercase tracking-widest mb-3">Smart Tool</span>
          <h2 className="text-4xl font-black text-gray-900 mb-4">
            Fertilizer <span className="text-[#2D6A4F]">Calculator</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Enter your land details to get precise fertilizer recommendations. Save money, boost yield.
          </p>
        </div>

        <div className="max-w-3xl mx-auto">
          <div className="bg-gradient-to-br from-[#F0FFF4] to-white border border-[#74C69D]/30 rounded-3xl p-8 sm:p-10 shadow-lg">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
              {/* Acres Input */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  🌍 Land Size (Acres)
                </label>
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  placeholder="e.g. 5"
                  value={acres}
                  onChange={(e) => setAcres(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#40916C] focus:outline-none text-gray-800 bg-white transition-colors"
                />
              </div>

              {/* Crop Dropdown */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  🌾 Crop Type
                </label>
                <select
                  value={crop}
                  onChange={(e) => setCrop(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#40916C] focus:outline-none text-gray-800 bg-white transition-colors"
                >
                  <option value="">Select crop...</option>
                  {crops.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              {/* Soil Dropdown */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  🪱 Soil Type
                </label>
                <select
                  value={soil}
                  onChange={(e) => setSoil(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#40916C] focus:outline-none text-gray-800 bg-white transition-colors"
                >
                  <option value="">Select soil...</option>
                  {soils.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
            </div>

            {error && (
              <p className="text-red-500 text-sm mb-4 bg-red-50 px-4 py-2 rounded-xl">⚠️ {error}</p>
            )}

            <button
              onClick={handleCalculate}
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-[#2D6A4F] to-[#40916C] text-white font-bold text-lg rounded-2xl hover:from-[#40916C] hover:to-[#74C69D] transition-all duration-300 shadow-md hover:shadow-xl disabled:opacity-70 flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Calculating...
                </>
              ) : (
                "🧮 Calculate Fertilizer"
              )}
            </button>
          </div>

          {/* Result Card */}
          {result && (
            <div className="mt-8 bg-gradient-to-br from-[#2D6A4F] to-[#40916C] rounded-3xl p-8 text-white shadow-2xl animate-fadeIn">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-3xl">✅</span>
                <div>
                  <h3 className="text-xl font-black">Fertilizer Recommendation</h3>
                  <p className="text-[#74C69D] text-sm">{result.acres} acres · {result.crop} · {result.soil} soil</p>
                </div>
              </div>

              <div className="bg-white/15 rounded-2xl p-6 mb-6">
                <p className="text-[#74C69D] text-sm font-semibold mb-1">Recommended Product</p>
                <p className="text-2xl font-black">{result.fertilizerType}</p>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-8">
                {[
                  { label: "Total Quantity", value: `${result.totalKg} KG` },
                  { label: "Urea Needed", value: `${result.ureaKg} KG` },
                  { label: "DAP Needed", value: `${result.dapKg} KG` },
                ].map((item) => (
                  <div key={item.label} className="bg-white/15 rounded-xl p-4 text-center">
                    <div className="text-2xl font-black">{item.value}</div>
                    <div className="text-[#B7E4C7] text-xs mt-1">{item.label}</div>
                  </div>
                ))}
              </div>

              <a
                href="#products"
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector("#products")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="block w-full py-4 bg-[#74C69D] text-[#1B4332] font-black text-lg rounded-2xl text-center hover:bg-white transition-colors duration-200"
              >
                🛒 Buy Now – Shop Fertilizers
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}