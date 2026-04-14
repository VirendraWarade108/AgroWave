import { useState } from "react";

const SHOPIFY_URLS = {
  fungicide: "https://48cdqc-i6.myshopify.com/collections/all?filter.p.product_type=Fungicide&sort_by=title-ascending",
  insecticide: "https://48cdqc-i6.myshopify.com/collections/all?filter.p.product_type=Insecticide&sort_by=title-ascending",
  herbicide: "https://48cdqc-i6.myshopify.com/collections/all?filter.p.product_type=Herbicide&sort_by=title-ascending",
  all: "https://48cdqc-i6.myshopify.com/collections/all?sort_by=title-ascending",
};

const PRODUCT_MAP = {
  "Acrobat Fungicide": { url: SHOPIFY_URLS.fungicide, price: "₹999" },
  "Bavistin Fungicide": { url: SHOPIFY_URLS.fungicide, price: "₹650" },
  "Blu Copper Fungicide": { url: SHOPIFY_URLS.fungicide, price: "₹850" },
  "Abacin Insecticide": { url: SHOPIFY_URLS.insecticide, price: "₹700" },
  "Proclaim Insecticide": { url: SHOPIFY_URLS.insecticide, price: "₹1,400" },
  "Barazide Herbicide": { url: SHOPIFY_URLS.herbicide, price: "₹900" },
};

const crops = ["Wheat", "Rice", "Cotton", "Sugarcane", "Corn", "Vegetables", "Tomatoes", "Soybean", "Groundnut"];
const soils = ["Sandy", "Clay", "Loamy", "Black (Cotton Soil)", "Red Laterite"];
const irrigationOptions = ["Rainfed only", "Drip irrigation", "Flood irrigation", "Sprinkler", "Canal water"];
const fertilizerOptions = ["None", "Basic urea only", "NPK balanced", "Organic compost", "Mixed chemical + organic"];
const seasons = ["Kharif (Jun–Oct)", "Rabi (Nov–Mar)", "Zaid (Mar–Jun)"];

const SYSTEM_PROMPT = `You are an expert agricultural yield prediction specialist for AgroWave, India's trusted agriculture store. 
Based on the farmer's inputs, predict crop yield and recommend AgroWave products to improve it.
Return ONLY a valid JSON object (no markdown, no backticks, no preamble).

JSON schema:
{
  "current_yield_qtl_per_acre": 12.5,
  "optimized_yield_qtl_per_acre": 18.0,
  "yield_gap_percent": 44,
  "yield_grade": "Below Average / Average / Good / Excellent",
  "limiting_factors": [
    { "factor": "Factor name", "impact": "High / Medium / Low", "description": "One sentence explanation" }
  ],
  "optimization_actions": [
    { "action": "Specific action", "expected_gain_qtl": 2.5 }
  ],
  "recommended_products": [
    {
      "name": "Product name (choose from: Acrobat Fungicide, Bavistin Fungicide, Blu Copper Fungicide, Abacin Insecticide, Proclaim Insecticide, Barazide Herbicide)",
      "category": "Fungicide / Insecticide / Herbicide",
      "reason": "One sentence why this increases yield",
      "yield_impact": "+X quintals/acre estimate"
    }
  ],
  "revenue_estimate_current": 45000,
  "revenue_estimate_optimized": 67500,
  "summary": "2-sentence overall assessment and key recommendation"
}

Revenue estimates: assume ₹2000/quintal average market price for most crops, ₹3000 for vegetables/tomato.
Always recommend 2-3 specific products from the AgroWave list. 
Match products to limiting factors:
- Disease risk / fungal → Acrobat Fungicide, Bavistin Fungicide, Blu Copper Fungicide
- Pest risk → Abacin Insecticide, Proclaim Insecticide
- Weed competition → Barazide Herbicide
- General crop protection (all crops) → at minimum one fungicide`;

export default function YieldPredictor() {
  const [form, setForm] = useState({
    crop: "",
    soil: "",
    acres: "",
    irrigation: "",
    fertilizer: "",
    season: "",
    pestHistory: "",
    state: "",
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update = (key, val) => setForm((f) => ({ ...f, [key]: val }));

  const predict = async () => {
    const { crop, soil, acres, irrigation, fertilizer, season } = form;
    if (!crop || !soil || !acres || !irrigation || !fertilizer || !season) {
      setError("Please fill in all required fields.");
      return;
    }
    if (isNaN(parseFloat(acres)) || parseFloat(acres) <= 0) {
      setError("Please enter a valid land size.");
      return;
    }
    setError("");
    setLoading(true);
    setResult(null);

    const prompt = `Predict yield for this Indian farm:
- Crop: ${crop}
- Land: ${acres} acres
- Soil type: ${soil}
- Irrigation: ${irrigation}
- Fertilizer used: ${fertilizer}
- Season: ${season}
- State/Region: ${form.state || "Not specified"}
- Past pest/disease problems: ${form.pestHistory || "None reported"}

Return JSON analysis with yield prediction, limiting factors, and AgroWave product recommendations.`;

    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages: [{ role: "user", content: prompt }],
        }),
      });

      const data = await response.json();
      const text = data.content?.find((b) => b.type === "text")?.text || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setResult(parsed);
    } catch {
      setError("Prediction failed. Please check your inputs and try again.");
    } finally {
      setLoading(false);
    }
  };

  const impactColor = {
    High: "bg-red-100 text-red-700 border-red-200",
    Medium: "bg-amber-100 text-amber-700 border-amber-200",
    Low: "bg-blue-100 text-blue-700 border-blue-200",
  };

  const gradeColor = {
    "Below Average": "text-red-600",
    Average: "text-amber-600",
    Good: "text-[#4CAF50]",
    Excellent: "text-emerald-600",
  };

  const categoryIcon = { Fungicide: "🍃", Insecticide: "🛡️", Herbicide: "🌾" };

  return (
    <section id="yield-predictor" className="py-20 bg-white px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block text-[#4CAF50] font-semibold text-sm uppercase tracking-widest mb-3">
            AI Prediction
          </span>
          <h2 className="text-4xl font-black text-gray-900 mb-4">
            Yield <span className="text-[#1a3c2e]">Predictor</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Enter your farm details. Our AI predicts your current yield, identifies what's limiting it, and shows exactly which products can boost your harvest.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Input Form */}
          <div className="bg-gradient-to-br from-[#f0fff4] to-white border border-[#4CAF50]/30 rounded-3xl p-8 shadow-lg mb-8">
            <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
              🌾 Farm Details
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-6">
              {/* Crop */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Crop Type *</label>
                <select value={form.crop} onChange={(e) => update("crop", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#4CAF50] focus:outline-none text-gray-800 bg-white">
                  <option value="">Select crop...</option>
                  {crops.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              {/* Acres */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Land Size (Acres) *</label>
                <input type="number" min="0.1" step="0.5" placeholder="e.g. 5"
                  value={form.acres} onChange={(e) => update("acres", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#4CAF50] focus:outline-none text-gray-800 bg-white" />
              </div>
              {/* Soil */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Soil Type *</label>
                <select value={form.soil} onChange={(e) => update("soil", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#4CAF50] focus:outline-none text-gray-800 bg-white">
                  <option value="">Select soil...</option>
                  {soils.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              {/* Irrigation */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Irrigation Method *</label>
                <select value={form.irrigation} onChange={(e) => update("irrigation", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#4CAF50] focus:outline-none text-gray-800 bg-white">
                  <option value="">Select irrigation...</option>
                  {irrigationOptions.map((i) => <option key={i}>{i}</option>)}
                </select>
              </div>
              {/* Fertilizer */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Fertilizer Used *</label>
                <select value={form.fertilizer} onChange={(e) => update("fertilizer", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#4CAF50] focus:outline-none text-gray-800 bg-white">
                  <option value="">Select fertilizer...</option>
                  {fertilizerOptions.map((f) => <option key={f}>{f}</option>)}
                </select>
              </div>
              {/* Season */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Season *</label>
                <select value={form.season} onChange={(e) => update("season", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#4CAF50] focus:outline-none text-gray-800 bg-white">
                  <option value="">Select season...</option>
                  {seasons.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
              {/* State */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">State / Region <span className="text-gray-400 font-normal">(optional)</span></label>
                <input type="text" placeholder="e.g. Maharashtra, Punjab"
                  value={form.state} onChange={(e) => update("state", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#4CAF50] focus:outline-none text-gray-800 bg-white" />
              </div>
              {/* Pest history */}
              <div className="sm:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Past Pest / Disease Problems <span className="text-gray-400 font-normal">(optional)</span></label>
                <input type="text" placeholder="e.g. Aphids last season, yellow rust, powdery mildew"
                  value={form.pestHistory} onChange={(e) => update("pestHistory", e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#4CAF50] focus:outline-none text-gray-800 bg-white" />
              </div>
            </div>

            {error && <p className="text-red-500 text-sm mb-4 bg-red-50 px-4 py-2 rounded-xl">⚠️ {error}</p>}

            <button onClick={predict} disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-[#1a3c2e] to-[#4CAF50] text-white font-bold text-lg rounded-2xl hover:from-[#4CAF50] hover:to-[#1a3c2e] transition-all duration-300 shadow-md hover:shadow-xl disabled:opacity-70 flex items-center justify-center gap-3">
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Predicting with AI...
                </>
              ) : (
                <>📈 Predict My Yield & Get Recommendations</>
              )}
            </button>
          </div>

          {/* Results */}
          {result && (
            <div className="animate-fadeIn">
              {/* Summary Banner */}
              <div className="bg-gradient-to-r from-[#0d2318] to-[#1a3c2e] rounded-3xl p-8 text-white mb-6">
                <p className="text-[#74C69D] text-sm font-semibold mb-4">{result.summary}</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="bg-white/15 rounded-2xl p-4 text-center">
                    <p className="text-2xl font-black">{result.current_yield_qtl_per_acre} <span className="text-sm font-medium">qtl/acre</span></p>
                    <p className="text-[#a5d6a7] text-xs mt-1">Current Yield</p>
                  </div>
                  <div className="bg-white/15 rounded-2xl p-4 text-center">
                    <p className="text-2xl font-black text-[#4CAF50]">{result.optimized_yield_qtl_per_acre} <span className="text-sm font-medium">qtl/acre</span></p>
                    <p className="text-[#a5d6a7] text-xs mt-1">Potential Yield</p>
                  </div>
                  <div className="bg-white/15 rounded-2xl p-4 text-center">
                    <p className={`text-2xl font-black ${gradeColor[result.yield_grade] || "text-white"}`}>{result.yield_grade}</p>
                    <p className="text-[#a5d6a7] text-xs mt-1">Yield Grade</p>
                  </div>
                  <div className="bg-white/15 rounded-2xl p-4 text-center">
                    <p className="text-2xl font-black text-amber-400">+{result.yield_gap_percent}%</p>
                    <p className="text-[#a5d6a7] text-xs mt-1">Yield Gap</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                {/* Revenue Estimate */}
                <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
                  <h3 className="font-black text-gray-900 mb-4">💰 Revenue Estimate ({form.acres} acres)</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-50 rounded-2xl p-4 text-center">
                      <p className="text-xs text-gray-400 mb-1">Current Earnings</p>
                      <p className="text-xl font-black text-gray-700">
                        ₹{Number(result.revenue_estimate_current).toLocaleString("en-IN")}
                      </p>
                    </div>
                    <div className="bg-[#4CAF50]/10 rounded-2xl p-4 text-center border border-[#4CAF50]/30">
                      <p className="text-xs text-[#4CAF50] mb-1">With Optimization</p>
                      <p className="text-xl font-black text-[#1a3c2e]">
                        ₹{Number(result.revenue_estimate_optimized).toLocaleString("en-IN")}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 bg-amber-50 rounded-xl px-4 py-3">
                    <p className="text-amber-800 text-sm font-bold">
                      Extra ₹{(Number(result.revenue_estimate_optimized) - Number(result.revenue_estimate_current)).toLocaleString("en-IN")} potential income
                    </p>
                  </div>
                </div>

                {/* Limiting Factors */}
                <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
                  <h3 className="font-black text-gray-900 mb-4">⚠️ What's Limiting Your Yield</h3>
                  <div className="flex flex-col gap-3">
                    {result.limiting_factors?.map((f, i) => (
                      <div key={i} className={`flex items-start gap-3 border rounded-xl p-3 ${impactColor[f.impact]}`}>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full border shrink-0 ${impactColor[f.impact]}`}>{f.impact}</span>
                        <div>
                          <p className="text-sm font-bold">{f.factor}</p>
                          <p className="text-xs opacity-80 mt-0.5">{f.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recommended Products */}
              <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm mb-6">
                <h3 className="font-black text-gray-900 mb-2">🛒 AgroWave Products to Boost Your Yield</h3>
                <p className="text-gray-400 text-sm mb-5">These specific products will address your yield-limiting factors</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {result.recommended_products?.map((prod, i) => {
                    const match = PRODUCT_MAP[prod.name] || { url: SHOPIFY_URLS.all, price: "View" };
                    return (
                      <div key={i} className="border border-gray-100 rounded-2xl p-4 hover:border-[#4CAF50]/40 hover:shadow-md transition-all">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xl">{categoryIcon[prod.category] || "🌱"}</span>
                          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">{prod.category}</span>
                        </div>
                        <p className="font-bold text-gray-900 text-sm mb-1">{prod.name}</p>
                        <p className="text-gray-500 text-xs mb-2 leading-relaxed">{prod.reason}</p>
                        <p className="text-[#4CAF50] font-bold text-xs mb-3">{prod.yield_impact} yield gain</p>
                        <a href={match.url} target="_blank" rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1 w-full py-2.5 bg-[#1a3c2e] text-white text-xs font-bold rounded-xl hover:bg-[#4CAF50] transition-colors">
                          🛒 Buy Now — {match.price}
                        </a>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Optimization Actions */}
              <div className="bg-gradient-to-br from-[#f0fff4] to-white border border-[#4CAF50]/20 rounded-3xl p-6">
                <h3 className="font-black text-gray-900 mb-4">✅ Action Plan to Reach Optimal Yield</h3>
                <div className="flex flex-col gap-3">
                  {result.optimization_actions?.map((a, i) => (
                    <div key={i} className="flex items-center gap-4 bg-white rounded-xl p-4 border border-gray-100">
                      <div className="w-8 h-8 bg-[#4CAF50]/20 rounded-xl flex items-center justify-center text-sm font-black text-[#1a3c2e] shrink-0">
                        {i + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-gray-800">{a.action}</p>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="text-[#4CAF50] font-black text-sm">+{a.expected_gain_qtl}</p>
                        <p className="text-gray-400 text-xs">qtl/acre</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
