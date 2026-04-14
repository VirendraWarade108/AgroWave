const OPENROUTER_API_KEY = "your_openrouter_key_here"; // paste your key
const API_URL = "https://openrouter.ai/api/v1/chat/completions";

async function callAPI(userPrompt) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
    },
    body: JSON.stringify({
      model: "meta-llama/llama-3.3-70b-instruct:free",
      max_tokens: 1024,
      messages: [{ role: "user", content: `${SYSTEM_PROMPT}\n\n${userPrompt}` }],
    }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err?.error?.message || `API error ${response.status}`);
  }

  const data = await response.json();
  const text = data.choices?.[0]?.message?.content || "";
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}

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

const IMPACT_STYLES = {
  High:   "bg-red-50 text-red-700 border border-red-200",
  Medium: "bg-amber-50 text-amber-700 border border-amber-200",
  Low:    "bg-blue-50 text-blue-700 border border-blue-200",
};

const GRADE_STYLES = {
  "Below Average": { text: "text-red-500",     bar: "bg-red-400",     pct: 25 },
  Average:         { text: "text-amber-500",   bar: "bg-amber-400",   pct: 50 },
  Good:            { text: "text-[#4CAF50]",   bar: "bg-[#4CAF50]",   pct: 75 },
  Excellent:       { text: "text-emerald-500", bar: "bg-emerald-500", pct: 100 },
};

const CAT_ICON = { Fungicide: "🍃", Insecticide: "🛡️", Herbicide: "🌾" };

const SelectField = ({ label, value, onChange, options, placeholder }) => (
  <div>
    <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wider">{label}</label>
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 bg-white focus:border-[#4CAF50] focus:outline-none text-gray-800 text-sm appearance-none cursor-pointer transition-colors"
      >
        <option value="">{placeholder}</option>
        {options.map((o) => <option key={o}>{o}</option>)}
      </select>
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">▼</span>
    </div>
  </div>
);

const InputField = ({ label, value, onChange, placeholder, type = "text" }) => (
  <div>
    <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wider">{label}</label>
    <input
      type={type}
      min={type === "number" ? "0.1" : undefined}
      step={type === "number" ? "0.5" : undefined}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 bg-white focus:border-[#4CAF50] focus:outline-none text-gray-800 text-sm transition-colors"
    />
  </div>
);

async function callAPI(userPrompt) {
  const response = await fetch(GEMINI_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: `${SYSTEM_PROMPT}\n\n${userPrompt}` }],
      }],
      generationConfig: {
        temperature: 0.2,
        maxOutputTokens: 1024,
      },
    }),
  });

  if (!response.ok) {
    const errData = await response.json();
    throw new Error(errData?.error?.message || `API error ${response.status}`);
  }

  const data = await response.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "";
  const clean = text.replace(/```json|```/g, "").trim();
  return JSON.parse(clean);
}

export default function YieldPredictor() {
  const [form, setForm] = useState({
    crop: "", soil: "", acres: "", irrigation: "",
    fertilizer: "", season: "", pestHistory: "", state: "",
  });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const update = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));

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

    const userPrompt = `Predict yield for this Indian farm:
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
      const parsed = await callAPI(userPrompt);
      setResult(parsed);
    } catch (err) {
      console.error(err);
      setError(`Prediction failed: ${err.message || "Please check your inputs and try again."}`);
    } finally {
      setLoading(false);
    }
  };

  const grade = result ? (GRADE_STYLES[result.yield_grade] || GRADE_STYLES.Average) : null;
  const extraRevenue = result
    ? Number(result.revenue_estimate_optimized) - Number(result.revenue_estimate_current)
    : 0;

  return (
    <section id="yield-predictor" className="py-24 bg-white px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20"
        style={{ backgroundImage: "radial-gradient(circle at 80% 80%, #dcfce7 0%, transparent 50%)" }} />

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#1a3c2e]/8 border border-[#1a3c2e]/15 rounded-full px-5 py-2 mb-6">
            <span className="w-2 h-2 rounded-full bg-[#4CAF50] animate-pulse" />
            <span className="text-[#1a3c2e] font-semibold text-sm tracking-wide">AI Yield Intelligence</span>
          </div>
          <h2 className="text-5xl sm:text-6xl font-black text-gray-900 mb-5 leading-tight tracking-tight">
            Yield
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#1a3c2e] to-[#4CAF50]">
              Predictor
            </span>
          </h2>
          <p className="text-gray-500 text-xl max-w-2xl mx-auto leading-relaxed font-light">
            Tell us about your farm. Our AI predicts your yield, finds what's holding it back, and shows exactly which products will boost your harvest.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Input Card */}
          <div className="bg-[#fafaf8] rounded-[2rem] border border-gray-100 p-8 lg:p-10 mb-8 shadow-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-[#1a3c2e] rounded-2xl flex items-center justify-center text-lg">🌾</div>
              <div>
                <h3 className="font-black text-gray-900">Farm Details</h3>
                <p className="text-xs text-gray-400">Fields marked * are required</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-5">
              <SelectField label="Crop Type *" value={form.crop} onChange={update("crop")} options={crops} placeholder="Select crop..." />
              <InputField label="Land Size (Acres) *" value={form.acres} onChange={update("acres")} type="number" placeholder="e.g. 5" />
              <SelectField label="Soil Type *" value={form.soil} onChange={update("soil")} options={soils} placeholder="Select soil..." />
              <SelectField label="Irrigation Method *" value={form.irrigation} onChange={update("irrigation")} options={irrigationOptions} placeholder="Select irrigation..." />
              <SelectField label="Fertilizer Used *" value={form.fertilizer} onChange={update("fertilizer")} options={fertilizerOptions} placeholder="Select fertilizer..." />
              <SelectField label="Season *" value={form.season} onChange={update("season")} options={seasons} placeholder="Select season..." />
              <InputField label="State / Region" value={form.state} onChange={update("state")} placeholder="e.g. Maharashtra, Punjab" />
              <div className="sm:col-span-2">
                <InputField label="Past Pest / Disease Problems" value={form.pestHistory} onChange={update("pestHistory")} placeholder="e.g. Aphids last season, yellow rust, powdery mildew" />
              </div>
            </div>

            {error && (
              <div className="mb-5 flex items-start gap-2 bg-red-50 border border-red-100 text-red-700 rounded-xl px-4 py-3 text-sm">
                <span>⚠️</span><span>{error}</span>
              </div>
            )}

            <button onClick={predict} disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-[#1a3c2e] to-[#2d6a4f] text-white font-black text-base rounded-2xl hover:from-[#4CAF50] hover:to-[#1a3c2e] transition-all duration-500 shadow-lg hover:shadow-xl disabled:opacity-60 flex items-center justify-center gap-3 tracking-wide">
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373.0 0 5.373 0 12h4z" />
                  </svg>
                  Predicting with Gemini AI...
                </>
              ) : (
                <>📈 Predict My Yield & Get Recommendations</>
              )}
            </button>
          </div>

          {/* Results */}
          {result && (
            <div className="animate-fadeIn space-y-6">
              {/* Summary Banner */}
              <div className="bg-gradient-to-br from-[#0d2318] to-[#1a3c2e] rounded-[2rem] p-8 text-white shadow-2xl">
                <p className="text-[#74C69D] text-sm leading-relaxed mb-6 max-w-2xl">{result.summary}</p>

                {/* Yield Grade Bar */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white/60 text-xs font-semibold uppercase tracking-wider">Yield Grade</span>
                    <span className={`font-black text-lg ${grade.text}`}>{result.yield_grade}</span>
                  </div>
                  <div className="h-2 bg-white/10 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-1000 ${grade.bar}`}
                      style={{ width: `${grade.pct}%` }} />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: "Current Yield", value: `${result.current_yield_qtl_per_acre}`, unit: "qtl/acre", color: "text-white" },
                    { label: "Potential Yield", value: `${result.optimized_yield_qtl_per_acre}`, unit: "qtl/acre", color: "text-[#4CAF50]" },
                    { label: "Yield Gap", value: `+${result.yield_gap_percent}%`, unit: "untapped", color: "text-amber-400" },
                    { label: "Extra Income", value: `₹${extraRevenue.toLocaleString("en-IN")}`, unit: "potential", color: "text-[#74C69D]" },
                  ].map((s) => (
                    <div key={s.label} className="bg-white/10 rounded-2xl p-4 text-center border border-white/10">
                      <p className={`text-2xl font-black ${s.color}`}>{s.value}</p>
                      <p className="text-white/40 text-xs mt-0.5">{s.unit}</p>
                      <p className="text-white/60 text-xs font-semibold mt-1">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Estimate */}
                <div className="bg-white rounded-[1.5rem] border border-gray-100 p-6 shadow-sm">
                  <h3 className="font-black text-gray-900 mb-5 flex items-center gap-2">
                    <span className="text-xl">💰</span>
                    Revenue Estimate ({form.acres} acres)
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between bg-gray-50 rounded-xl p-4">
                      <div>
                        <p className="text-xs text-gray-400 font-semibold">Current Earnings</p>
                        <p className="text-2xl font-black text-gray-700">
                          ₹{Number(result.revenue_estimate_current).toLocaleString("en-IN")}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-gray-200 rounded-xl flex items-center justify-center text-2xl">📉</div>
                    </div>
                    <div className="flex items-center justify-between bg-[#4CAF50]/8 border border-[#4CAF50]/20 rounded-xl p-4">
                      <div>
                        <p className="text-xs text-[#4CAF50] font-semibold">With Optimization</p>
                        <p className="text-2xl font-black text-[#1a3c2e]">
                          ₹{Number(result.revenue_estimate_optimized).toLocaleString("en-IN")}
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-[#4CAF50]/20 rounded-xl flex items-center justify-center text-2xl">📈</div>
                    </div>
                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-3 text-center">
                      <p className="text-amber-800 font-black text-sm">
                        +₹{extraRevenue.toLocaleString("en-IN")} extra potential income
                      </p>
                    </div>
                  </div>
                </div>

                {/* Limiting Factors */}
                <div className="bg-white rounded-[1.5rem] border border-gray-100 p-6 shadow-sm">
                  <h3 className="font-black text-gray-900 mb-5 flex items-center gap-2">
                    <span className="text-xl">⚠️</span>
                    What's Limiting Your Yield
                  </h3>
                  <div className="flex flex-col gap-3">
                    {result.limiting_factors?.map((f, i) => (
                      <div key={i} className={`flex items-start gap-3 rounded-xl p-3 ${IMPACT_STYLES[f.impact]}`}>
                        <span className={`text-xs font-black px-2 py-1 rounded-lg border shrink-0 ${IMPACT_STYLES[f.impact]}`}>{f.impact}</span>
                        <div>
                          <p className="text-sm font-bold">{f.factor}</p>
                          <p className="text-xs opacity-80 mt-0.5 leading-relaxed">{f.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recommended Products */}
              <div className="bg-white rounded-[1.5rem] border border-gray-100 p-6 shadow-sm">
                <div className="mb-6">
                  <h3 className="font-black text-gray-900 text-lg flex items-center gap-2">
                    <span>🛒</span> AgroWave Products to Boost Your Yield
                  </h3>
                  <p className="text-gray-400 text-sm mt-1">Targeted solutions for your specific yield-limiting factors</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {result.recommended_products?.map((prod, i) => {
                    const match = PRODUCT_MAP[prod.name] || { url: SHOPIFY_URLS.all, price: "View" };
                    return (
                      <div key={i} className="bg-[#fafaf8] border border-gray-100 rounded-2xl p-5 hover:border-[#4CAF50]/40 hover:shadow-md transition-all group">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-2xl">{CAT_ICON[prod.category] || "🌱"}</span>
                          <span className="text-xs font-black text-gray-400 uppercase tracking-wider">{prod.category}</span>
                        </div>
                        <p className="font-black text-gray-900 text-sm mb-1.5">{prod.name}</p>
                        <p className="text-gray-500 text-xs mb-3 leading-relaxed">{prod.reason}</p>
                        <div className="flex items-center gap-2 mb-4">
                          <span className="w-2 h-2 rounded-full bg-[#4CAF50]" />
                          <p className="text-[#1a3c2e] font-black text-xs">{prod.yield_impact} yield gain</p>
                        </div>
                        <a href={match.url} target="_blank" rel="noopener noreferrer"
                          className="flex items-center justify-center gap-1.5 w-full py-2.5 bg-[#1a3c2e] text-white text-xs font-black rounded-xl hover:bg-[#4CAF50] transition-colors">
                          🛒 Buy Now — {match.price}
                        </a>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action Plan */}
              <div className="bg-gradient-to-br from-[#f0fff4] to-white border border-[#4CAF50]/20 rounded-[1.5rem] p-6">
                <h3 className="font-black text-gray-900 text-lg mb-5 flex items-center gap-2">
                  <span>✅</span> Action Plan to Reach Optimal Yield
                </h3>
                <div className="space-y-3">
                  {result.optimization_actions?.map((a, i) => (
                    <div key={i} className="flex items-center gap-4 bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
                      <div className="w-9 h-9 bg-gradient-to-br from-[#1a3c2e] to-[#4CAF50] rounded-xl flex items-center justify-center text-white text-sm font-black shrink-0">
                        {i + 1}
                      </div>
                      <p className="flex-1 text-sm font-bold text-gray-800">{a.action}</p>
                      <div className="shrink-0 text-right">
                        <p className="text-[#4CAF50] font-black text-base">+{a.expected_gain_qtl}</p>
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
