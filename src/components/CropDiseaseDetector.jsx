import { useState, useRef } from "react";

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

const SYSTEM_PROMPT = `You are an expert agronomist and crop disease specialist for AgroWave, India's trusted agriculture store. Analyze the provided crop leaf image or symptom description and return ONLY a valid JSON object (no markdown, no backticks, no preamble).

Your JSON must follow this exact schema:
{
  "disease": "Disease name or 'No disease detected'",
  "confidence": "High / Medium / Low",
  "severity": "Mild / Moderate / Severe / None",
  "description": "2-sentence explanation of the disease and how it affects the crop",
  "cause": "Fungal / Bacterial / Viral / Pest / Nutrient Deficiency / Unknown",
  "treatment_steps": ["step 1", "step 2", "step 3"],
  "recommended_products": [
    {
      "name": "Product name from AgroWave (choose from: Acrobat Fungicide, Bavistin Fungicide, Blu Copper Fungicide, Abacin Insecticide, Proclaim Insecticide, Barazide Herbicide)",
      "reason": "One sentence why this product helps"
    }
  ],
  "prevention_tip": "One actionable prevention tip for future"
}

Always recommend 1-3 specific products from the AgroWave product list above. Map diseases correctly:
- Fungal diseases (downy mildew, late blight, powdery mildew, rust, anthracnose) → Acrobat Fungicide, Bavistin Fungicide, Blu Copper Fungicide
- Bacterial diseases → Blu Copper Fungicide
- Insect/pest damage → Abacin Insecticide or Proclaim Insecticide
- Weed competition visible → Barazide Herbicide
- Broad spectrum protection → recommend both fungicide + insecticide`;

const CAUSE_META = {
  Fungal:               { icon: "🍄", color: "from-amber-500 to-orange-500" },
  Bacterial:            { icon: "🦠", color: "from-red-500 to-rose-500" },
  Viral:                { icon: "🧬", color: "from-purple-500 to-violet-500" },
  Pest:                 { icon: "🐛", color: "from-green-500 to-emerald-500" },
  "Nutrient Deficiency":{ icon: "🌱", color: "from-teal-500 to-cyan-500" },
  Unknown:              { icon: "❓", color: "from-gray-400 to-gray-500" },
};

const CONFIDENCE_STYLES = {
  High:   "bg-emerald-100 text-emerald-800 border border-emerald-200",
  Medium: "bg-amber-100 text-amber-800 border border-amber-200",
  Low:    "bg-red-100 text-red-800 border border-red-200",
};

const SEVERITY_STYLES = {
  Mild:     "bg-yellow-50 text-yellow-800 border border-yellow-200",
  Moderate: "bg-orange-50 text-orange-800 border border-orange-200",
  Severe:   "bg-red-50 text-red-800 border border-red-200",
  None:     "bg-emerald-50 text-emerald-800 border border-emerald-200",
};

const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export default function CropDiseaseDetector() {
  const [image, setImage] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
  const [imageMimeType, setImageMimeType] = useState("image/jpeg");
  const [symptoms, setSymptoms] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef();

  const handleFile = (file) => {
    if (!file || !file.type.startsWith("image/")) {
      setError("Please upload a valid image file (JPG, PNG, WEBP).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5MB.");
      return;
    }
    setError("");
    setResult(null);
    const url = URL.createObjectURL(file);
    setImage(url);
    setImageMimeType(file.type || "image/jpeg");
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target.result.split(",")[1];
      setImageBase64(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const analyzeDisease = async () => {
    if (!imageBase64 && !symptoms.trim()) {
      setError("Please upload a crop image or describe the symptoms.");
      return;
    }
    setError("");
    setLoading(true);
    setResult(null);

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      setError("Gemini API key not found. Add VITE_GEMINI_API_KEY to your .env file.");
      setLoading(false);
      return;
    }

    try {
      // Build parts array for Gemini
      const parts = [];

      // Add system instruction as first text part
      parts.push({ text: SYSTEM_PROMPT });

      // Add image if provided
      if (imageBase64) {
        parts.push({
          inline_data: {
            mime_type: imageMimeType,
            data: imageBase64,
          },
        });
      }

      // Add user prompt text
      const userText = imageBase64
        ? symptoms.trim()
          ? `Analyze this crop leaf image for diseases. The farmer also reports: "${symptoms}". Return JSON only.`
          : "Analyze this crop leaf image for diseases and return JSON only."
        : `Farmer reports these crop symptoms: "${symptoms}". Identify the likely disease and return JSON only.`;

      parts.push({ text: userText });

      const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ role: "user", parts }],
          generationConfig: {
            temperature: 0.2,
            maxOutputTokens: 1024,
            responseMimeType: "application/json",
          },
        }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData?.error?.message || `API error ${response.status}`);
      }

      const data = await response.json();
      const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setResult(parsed);
    } catch (err) {
      console.error(err);
      setError(`Analysis failed: ${err.message || "Please try again or describe symptoms in text."}`);
    } finally {
      setLoading(false);
    }
  };

  const causeMeta = result ? (CAUSE_META[result.cause] || CAUSE_META.Unknown) : null;

  return (
    <section id="disease-detector" className="py-24 bg-[#fafaf8] px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute inset-0 opacity-30"
        style={{ backgroundImage: "radial-gradient(circle at 20% 50%, #dcfce7 0%, transparent 50%), radial-gradient(circle at 80% 20%, #d1fae5 0%, transparent 40%)" }} />

      <div className="max-w-7xl mx-auto relative">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#1a3c2e]/8 border border-[#1a3c2e]/15 rounded-full px-5 py-2 mb-6">
            <span className="w-2 h-2 rounded-full bg-[#4CAF50] animate-pulse" />
            <span className="text-[#1a3c2e] font-semibold text-sm tracking-wide">AI-Powered Vision Analysis</span>
          </div>
          <h2 className="text-5xl sm:text-6xl font-black text-gray-900 mb-5 leading-tight tracking-tight">
            Crop Disease
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-[#1a3c2e] to-[#4CAF50]">
              Detector
            </span>
          </h2>
          <p className="text-gray-500 text-xl max-w-2xl mx-auto leading-relaxed font-light">
            Upload a photo or describe symptoms — our AI diagnoses instantly and prescribes the right treatment from AgroWave.
          </p>
        </div>

        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-[2rem] shadow-[0_8px_60px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden">
            <div className="grid grid-cols-1 lg:grid-cols-2">
              {/* LEFT — Input Panel */}
              <div className="p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-gray-100">
                <h3 className="text-lg font-black text-gray-900 mb-6 flex items-center gap-2">
                  <span className="w-8 h-8 bg-[#4CAF50]/15 rounded-xl flex items-center justify-center text-sm">📸</span>
                  Upload & Describe
                </h3>

                {/* Drop Zone */}
                <div
                  className={`relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 mb-5
                    ${dragOver
                      ? "ring-2 ring-[#4CAF50] ring-offset-2 bg-[#4CAF50]/5"
                      : image
                        ? "ring-2 ring-[#4CAF50]/30"
                        : "border-2 border-dashed border-gray-200 hover:border-[#4CAF50]/60 hover:bg-[#4CAF50]/2"
                    }`}
                  style={{ minHeight: 200 }}
                  onClick={() => fileRef.current?.click()}
                  onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={handleDrop}
                >
                  {image ? (
                    <>
                      <img src={image} alt="Uploaded crop" className="w-full h-52 object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                      <button
                        onClick={(e) => { e.stopPropagation(); setImage(null); setImageBase64(null); setResult(null); }}
                        className="absolute top-3 right-3 w-8 h-8 bg-white/90 backdrop-blur rounded-full shadow-lg flex items-center justify-center text-gray-700 hover:bg-red-50 hover:text-red-500 transition-colors font-bold text-sm"
                      >✕</button>
                      <div className="absolute bottom-3 left-3">
                        <span className="bg-[#4CAF50] text-white text-xs font-bold px-3 py-1 rounded-full">✓ Image ready</span>
                      </div>
                    </>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-52 gap-3 p-6">
                      <div className="w-16 h-16 bg-gradient-to-br from-[#1a3c2e]/8 to-[#4CAF50]/15 rounded-2xl flex items-center justify-center text-3xl">🌿</div>
                      <div className="text-center">
                        <p className="text-sm font-bold text-gray-700">Drop your crop image here</p>
                        <p className="text-xs text-gray-400 mt-1">or click to browse · JPG, PNG, WEBP · max 5MB</p>
                      </div>
                      <span className="text-xs bg-gray-100 text-gray-500 px-3 py-1 rounded-full font-medium">Click to upload</span>
                    </div>
                  )}
                  <input ref={fileRef} type="file" accept="image/*" className="hidden"
                    onChange={(e) => handleFile(e.target.files[0])} />
                </div>

                {/* Divider */}
                <div className="flex items-center gap-3 mb-5">
                  <div className="flex-1 h-px bg-gray-100" />
                  <span className="text-xs text-gray-400 font-semibold uppercase tracking-widest">or</span>
                  <div className="flex-1 h-px bg-gray-100" />
                </div>

                {/* Symptom Input */}
                <div className="mb-5">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    📝 Describe Symptoms
                    <span className="ml-2 font-normal text-gray-400 text-xs">optional if image uploaded</span>
                  </label>
                  <textarea
                    rows={4}
                    placeholder="e.g. Yellow spots on leaves, brown edges, white powder, holes in leaves, wilting..."
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-100 focus:border-[#4CAF50] focus:outline-none text-gray-800 bg-gray-50 focus:bg-white transition-all text-sm resize-none placeholder-gray-400"
                  />
                </div>

                {error && (
                  <div className="mb-5 flex items-start gap-2 bg-red-50 border border-red-100 text-red-700 rounded-xl px-4 py-3 text-sm">
                    <span>⚠️</span><span>{error}</span>
                  </div>
                )}

                <button
                  onClick={analyzeDisease}
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-[#1a3c2e] to-[#2d6a4f] text-white font-black text-base rounded-2xl hover:from-[#4CAF50] hover:to-[#1a3c2e] transition-all duration-500 shadow-lg hover:shadow-xl disabled:opacity-60 flex items-center justify-center gap-3 tracking-wide"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Analyzing with Gemini AI...
                    </>
                  ) : (
                    <>🔬 Detect Disease & Get Treatment</>
                  )}
                </button>

                {/* Capability pills */}
                <div className="flex flex-wrap gap-2 mt-5">
                  {["Fungal diseases", "Bacterial infections", "Pest damage", "Nutrient deficiency"].map((t) => (
                    <span key={t} className="text-xs bg-[#4CAF50]/10 text-[#1a3c2e] px-3 py-1 rounded-full font-semibold border border-[#4CAF50]/20">✓ {t}</span>
                  ))}
                </div>
              </div>

              {/* RIGHT — Results Panel */}
              <div className="p-8 lg:p-10 bg-gradient-to-br from-gray-50 to-white">
                {!result && !loading && (
                  <div className="h-full flex flex-col items-center justify-center text-center gap-5 py-10">
                    <div className="w-24 h-24 bg-gradient-to-br from-[#1a3c2e]/8 to-[#4CAF50]/15 rounded-3xl flex items-center justify-center text-5xl">🔬</div>
                    <div>
                      <p className="font-black text-gray-700 text-lg mb-2">Ready to Diagnose</p>
                      <p className="text-gray-400 text-sm leading-relaxed max-w-xs">Upload a leaf photo or describe what you see. Instant AI diagnosis with product recommendations.</p>
                    </div>
                    <div className="w-full max-w-xs bg-white rounded-2xl p-4 border border-gray-100 shadow-sm text-left">
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">What we detect</p>
                      {[
                        ["🍄", "Downy mildew, late blight, rust"],
                        ["🦠", "Bacterial leaf spot, wilt"],
                        ["🐛", "Aphids, caterpillars, borers"],
                        ["🌱", "Iron, zinc, NPK deficiency"],
                      ].map(([icon, label]) => (
                        <div key={label} className="flex items-center gap-2 py-1.5">
                          <span>{icon}</span>
                          <span className="text-xs text-gray-600">{label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {loading && (
                  <div className="h-full flex flex-col items-center justify-center gap-5">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-[#1a3c2e] to-[#4CAF50] flex items-center justify-center">
                        <span className="text-4xl animate-pulse">🧬</span>
                      </div>
                      <div className="absolute -inset-2 rounded-[20px] border-2 border-[#4CAF50]/30 animate-ping" />
                    </div>
                    <div className="text-center">
                      <p className="font-black text-gray-800 text-lg">Analyzing...</p>
                      <p className="text-gray-400 text-sm mt-1">Gemini AI Vision is examining your crop</p>
                    </div>
                    <div className="flex gap-1.5">
                      {[0, 1, 2].map((i) => (
                        <div key={i} className="w-2 h-2 rounded-full bg-[#4CAF50] animate-bounce"
                          style={{ animationDelay: `${i * 0.15}s` }} />
                      ))}
                    </div>
                  </div>
                )}

                {result && (
                  <div className="flex flex-col gap-4 animate-fadeIn">
                    {/* Disease Card */}
                    <div className={`rounded-2xl p-5 bg-gradient-to-br ${causeMeta.color} text-white`}>
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xl">{causeMeta.icon}</span>
                            <span className="text-white/80 text-xs font-bold uppercase tracking-wider">{result.cause}</span>
                          </div>
                          <h3 className="text-2xl font-black leading-tight">{result.disease}</h3>
                        </div>
                        <div className="flex flex-col gap-1.5 shrink-0">
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${CONFIDENCE_STYLES[result.confidence]}`}>
                            {result.confidence} confidence
                          </span>
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${SEVERITY_STYLES[result.severity]}`}>
                            {result.severity} severity
                          </span>
                        </div>
                      </div>
                      <p className="text-white/85 text-sm leading-relaxed">{result.description}</p>
                    </div>

                    {/* Treatment Steps */}
                    <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
                      <p className="text-amber-900 text-xs font-black uppercase tracking-wider mb-3">Treatment Plan</p>
                      <div className="flex flex-col gap-2.5">
                        {result.treatment_steps?.map((step, i) => (
                          <div key={i} className="flex gap-3 items-start">
                            <span className="w-6 h-6 bg-amber-200 text-amber-900 rounded-full text-xs font-black flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                            <p className="text-gray-700 text-sm leading-relaxed">{step}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recommended Products */}
                    <div>
                      <p className="text-sm font-black text-gray-900 mb-2.5">🛒 Recommended Products</p>
                      <div className="flex flex-col gap-2">
                        {result.recommended_products?.map((prod, i) => {
                          const match = PRODUCT_MAP[prod.name] || { url: SHOPIFY_URLS.all, price: "View" };
                          return (
                            <div key={i} className="flex items-center gap-3 bg-[#1a3c2e]/4 border border-[#4CAF50]/20 rounded-xl p-3 hover:border-[#4CAF50]/50 hover:bg-[#4CAF50]/6 transition-all">
                              <div className="w-10 h-10 bg-[#4CAF50]/20 rounded-xl flex items-center justify-center text-lg shrink-0">🌿</div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-gray-900 truncate">{prod.name}</p>
                                <p className="text-xs text-gray-500 leading-snug">{prod.reason}</p>
                              </div>
                              <a href={match.url} target="_blank" rel="noopener noreferrer"
                                className="shrink-0 px-3 py-2 bg-[#1a3c2e] text-white text-xs font-bold rounded-lg hover:bg-[#4CAF50] transition-colors whitespace-nowrap">
                                Buy {match.price}
                              </a>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Prevention Tip */}
                    {result.prevention_tip && (
                      <div className="bg-blue-50 border border-blue-100 rounded-xl p-3.5">
                        <p className="text-blue-900 text-xs font-black mb-1">💡 Prevention Tip</p>
                        <p className="text-blue-800 text-xs leading-relaxed">{result.prevention_tip}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
