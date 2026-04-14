import { useState, useRef } from "react";

const SHOPIFY_URLS = {
  fungicide: "https://48cdqc-i6.myshopify.com/collections/all?filter.p.product_type=Fungicide&sort_by=title-ascending",
  insecticide: "https://48cdqc-i6.myshopify.com/collections/all?filter.p.product_type=Insecticide&sort_by=title-ascending",
  herbicide: "https://48cdqc-i6.myshopify.com/collections/all?filter.p.product_type=Herbicide&sort_by=title-ascending",
  all: "https://48cdqc-i6.myshopify.com/collections/all?sort_by=title-ascending",
};

const PRODUCT_MAP = {
  "Acrobat Fungicide": { url: "https://48cdqc-i6.myshopify.com/collections/all?filter.p.product_type=Fungicide&sort_by=title-ascending", price: "₹999" },
  "Bavistin Fungicide": { url: "https://48cdqc-i6.myshopify.com/collections/all?filter.p.product_type=Fungicide&sort_by=title-ascending", price: "₹650" },
  "Blu Copper Fungicide": { url: "https://48cdqc-i6.myshopify.com/collections/all?filter.p.product_type=Fungicide&sort_by=title-ascending", price: "₹850" },
  "Abacin Insecticide": { url: "https://48cdqc-i6.myshopify.com/collections/all?filter.p.product_type=Insecticide&sort_by=title-ascending", price: "₹700" },
  "Proclaim Insecticide": { url: "https://48cdqc-i6.myshopify.com/collections/all?filter.p.product_type=Insecticide&sort_by=title-ascending", price: "₹1,400" },
  "Barazide Herbicide": { url: "https://48cdqc-i6.myshopify.com/collections/all?filter.p.product_type=Herbicide&sort_by=title-ascending", price: "₹900" },
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

export default function CropDiseaseDetector() {
  const [image, setImage] = useState(null);
  const [imageBase64, setImageBase64] = useState(null);
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
    const file = e.dataTransfer.files[0];
    handleFile(file);
  };

  const analyzeDisease = async () => {
    if (!imageBase64 && !symptoms.trim()) {
      setError("Please upload a crop image or describe the symptoms.");
      return;
    }
    setError("");
    setLoading(true);
    setResult(null);

    try {
      const messages = [];

      if (imageBase64) {
        const content = [
          {
            type: "image",
            source: { type: "base64", media_type: "image/jpeg", data: imageBase64 },
          },
          {
            type: "text",
            text: symptoms.trim()
              ? `Analyze this crop leaf image for diseases. The farmer also reports these symptoms: "${symptoms}". Return your analysis as JSON.`
              : "Analyze this crop leaf image for diseases and return your analysis as JSON.",
          },
        ];
        messages.push({ role: "user", content });
      } else {
        messages.push({
          role: "user",
          content: `Farmer reports these crop symptoms: "${symptoms}". Identify the likely disease and return your analysis as JSON.`,
        });
      }

      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages,
        }),
      });

      const data = await response.json();
      const text = data.content?.find((b) => b.type === "text")?.text || "";
      const clean = text.replace(/```json|```/g, "").trim();
      const parsed = JSON.parse(clean);
      setResult(parsed);
    } catch (err) {
      setError("Analysis failed. Please try again or describe symptoms in text.");
    } finally {
      setLoading(false);
    }
  };

  const confidenceColor = {
    High: "bg-emerald-100 text-emerald-800",
    Medium: "bg-amber-100 text-amber-800",
    Low: "bg-red-100 text-red-800",
  };

  const severityColor = {
    Mild: "bg-yellow-100 text-yellow-800",
    Moderate: "bg-orange-100 text-orange-800",
    Severe: "bg-red-100 text-red-800",
    None: "bg-green-100 text-green-800",
  };

  const causeIcon = {
    Fungal: "🍄",
    Bacterial: "🦠",
    Viral: "🧬",
    Pest: "🐛",
    "Nutrient Deficiency": "🌱",
    Unknown: "❓",
  };

  return (
    <section id="disease-detector" className="py-20 bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-14">
          <span className="inline-block text-[#4CAF50] font-semibold text-sm uppercase tracking-widest mb-3">
            AI-Powered
          </span>
          <h2 className="text-4xl font-black text-gray-900 mb-4">
            Crop Disease <span className="text-[#1a3c2e]">Detector</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Upload a photo of your diseased crop or describe symptoms. Our AI instantly identifies the disease and recommends the right AgroWave treatment.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left: Upload + Input */}
              <div className="flex flex-col gap-6">
                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    📸 Upload Crop Leaf Photo
                  </label>
                  <div
                    className={`relative border-2 border-dashed rounded-2xl transition-all cursor-pointer overflow-hidden
                      ${dragOver ? "border-[#4CAF50] bg-[#4CAF50]/5" : "border-gray-200 hover:border-[#4CAF50]"}`}
                    style={{ minHeight: "180px" }}
                    onClick={() => fileRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                  >
                    {image ? (
                      <div className="relative">
                        <img src={image} alt="Uploaded crop" className="w-full h-48 object-cover" />
                        <button
                          onClick={(e) => { e.stopPropagation(); setImage(null); setImageBase64(null); setResult(null); }}
                          className="absolute top-2 right-2 w-7 h-7 bg-white rounded-full shadow flex items-center justify-center text-gray-600 hover:bg-red-50 hover:text-red-500 text-sm font-bold"
                        >
                          ✕
                        </button>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center justify-center h-44 gap-3">
                        <div className="w-14 h-14 bg-[#4CAF50]/10 rounded-2xl flex items-center justify-center text-2xl">🌿</div>
                        <div className="text-center">
                          <p className="text-sm font-semibold text-gray-700">Drop image here or click to upload</p>
                          <p className="text-xs text-gray-400 mt-1">JPG, PNG, WEBP — max 5MB</p>
                        </div>
                      </div>
                    )}
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => handleFile(e.target.files[0])}
                    />
                  </div>
                </div>

                {/* Symptoms Text */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    📝 Describe Symptoms <span className="text-gray-400 font-normal">(optional if photo uploaded)</span>
                  </label>
                  <textarea
                    rows={4}
                    placeholder="e.g. Yellow spots on leaves, brown edges, wilting, white powder on surface, holes in leaves..."
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#4CAF50] focus:outline-none text-gray-800 bg-white transition-colors resize-none text-sm"
                  />
                </div>

                {error && (
                  <p className="text-red-500 text-sm bg-red-50 px-4 py-2 rounded-xl">⚠️ {error}</p>
                )}

                <button
                  onClick={analyzeDisease}
                  disabled={loading}
                  className="w-full py-4 bg-gradient-to-r from-[#1a3c2e] to-[#4CAF50] text-white font-bold text-base rounded-2xl hover:from-[#4CAF50] hover:to-[#1a3c2e] transition-all duration-300 shadow-md hover:shadow-xl disabled:opacity-70 flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Analyzing with AI...
                    </>
                  ) : (
                    <>🔬 Detect Disease & Get Treatment</>
                  )}
                </button>
              </div>

              {/* Right: Results */}
              <div>
                {!result && !loading && (
                  <div className="h-full flex flex-col items-center justify-center text-center gap-4 py-10">
                    <div className="w-20 h-20 bg-[#4CAF50]/10 rounded-3xl flex items-center justify-center text-4xl">🔬</div>
                    <p className="text-gray-400 text-sm max-w-xs">
                      Upload a leaf photo or describe symptoms. Our AI will diagnose the disease and recommend the right AgroWave products.
                    </p>
                    <div className="flex flex-col gap-2 text-left w-full max-w-xs mt-2">
                      {["Fungal diseases: downy mildew, blight, rust", "Bacterial & viral infections", "Pest & insect damage", "Nutrient deficiencies"].map((t) => (
                        <div key={t} className="flex items-center gap-2 text-xs text-gray-500">
                          <span className="text-[#4CAF50]">✓</span> {t}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {loading && (
                  <div className="h-full flex flex-col items-center justify-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#1a3c2e] to-[#4CAF50] flex items-center justify-center animate-pulse">
                      <span className="text-3xl">🧬</span>
                    </div>
                    <p className="text-gray-500 text-sm font-medium">Analyzing crop condition...</p>
                    <p className="text-gray-400 text-xs">Powered by Claude AI Vision</p>
                  </div>
                )}

                {result && (
                  <div className="flex flex-col gap-4 animate-fadeIn">
                    {/* Disease Header */}
                    <div className="bg-gradient-to-br from-[#1a3c2e] to-[#2d6a4f] rounded-2xl p-5 text-white">
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div>
                          <p className="text-[#74C69D] text-xs font-semibold uppercase tracking-wider mb-1">Detected Disease</p>
                          <h3 className="text-xl font-black">{result.disease}</h3>
                          <p className="text-gray-300 text-xs mt-1">
                            {causeIcon[result.cause]} {result.cause}
                          </p>
                        </div>
                        <div className="flex flex-col gap-1.5 shrink-0">
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${confidenceColor[result.confidence]}`}>
                            {result.confidence} confidence
                          </span>
                          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${severityColor[result.severity]}`}>
                            {result.severity} severity
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-300 text-xs leading-relaxed">{result.description}</p>
                    </div>

                    {/* Treatment Steps */}
                    <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
                      <p className="text-amber-800 text-xs font-bold uppercase tracking-wider mb-3">Treatment Steps</p>
                      <div className="flex flex-col gap-2">
                        {result.treatment_steps?.map((step, i) => (
                          <div key={i} className="flex gap-2.5 items-start">
                            <span className="w-5 h-5 bg-amber-200 text-amber-800 rounded-full text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                            <p className="text-gray-700 text-xs leading-relaxed">{step}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Recommended Products */}
                    <div>
                      <p className="text-sm font-bold text-gray-700 mb-3">🛒 Recommended AgroWave Products</p>
                      <div className="flex flex-col gap-2">
                        {result.recommended_products?.map((prod, i) => {
                          const match = PRODUCT_MAP[prod.name] || { url: SHOPIFY_URLS.all, price: "View Price" };
                          return (
                            <div key={i} className="flex items-center gap-3 bg-[#4CAF50]/8 border border-[#4CAF50]/20 rounded-xl p-3">
                              <div className="w-10 h-10 bg-[#4CAF50]/20 rounded-xl flex items-center justify-center text-lg shrink-0">🌿</div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-gray-900 truncate">{prod.name}</p>
                                <p className="text-xs text-gray-500 leading-snug">{prod.reason}</p>
                              </div>
                              <a
                                href={match.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="shrink-0 px-3 py-2 bg-[#1a3c2e] text-white text-xs font-bold rounded-lg hover:bg-[#4CAF50] transition-colors"
                              >
                                Buy {match.price}
                              </a>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Prevention tip */}
                    {result.prevention_tip && (
                      <div className="bg-blue-50 border border-blue-100 rounded-xl p-3">
                        <p className="text-blue-800 text-xs font-bold mb-1">💡 Prevention Tip</p>
                        <p className="text-blue-700 text-xs leading-relaxed">{result.prevention_tip}</p>
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
