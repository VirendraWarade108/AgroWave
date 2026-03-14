import { features } from "../data";

const ICONS = {
  seed:     "https://cdn-icons-png.flaticon.com/128/346/346246.png",
  shop:     "https://cdn-icons-png.flaticon.com/128/17787/17787183.png",
  calc:     "https://cdn-icons-png.flaticon.com/128/3167/3167764.png",
  certified:"https://cdn-icons-png.flaticon.com/128/12503/12503776.png",
  delivery: "https://cdn-icons-png.flaticon.com/128/726/726455.png",
  lab:      "https://cdn-icons-png.flaticon.com/128/6552/6552242.png",
  farmer:   "https://cdn-icons-png.flaticon.com/128/9319/9319106.png",
  pesticide:"https://cdn-icons-png.flaticon.com/128/17863/17863737.png",
};

const featureIcons = [ICONS.seed, ICONS.pesticide, ICONS.farmer];

export default function Hero() {
  const handleNav = (href) => {
    const el = document.getElementById(href.replace("#", ""));
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <section id="home" className="pt-16">
      {/* Hero Banner */}
      <div className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1600&q=80')" }} />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0d2318]/95 via-[#1a3c2e]/85 to-[#1a3c2e]/40" />
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#4CAF50] via-[#74C69D] to-[#4CAF50]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-[#4CAF50]/20 border border-[#4CAF50]/40 rounded-full px-4 py-1.5 mb-6">
              <img src="https://res.cloudinary.com/do1q7vrjj/image/upload/v1773466303/agrowave_logo3_clean_nobg_di2csk.png"
                alt="AgroWave" width="60" height="24" className="h-6 w-auto object-contain" />
              <span className="text-[#74C69D] text-sm font-semibold">India's Trusted Agri Store</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-tight mb-4">
              Grow Smarter,
              <span className="text-[#4CAF50] block">Harvest More.</span>
            </h1>

            <p className="text-lg text-gray-300 mb-10 leading-relaxed max-w-lg">
              Premium quality seeds, fertilizers & pesticides trusted by 12,000+ Indian farmers.
              Science-backed agriculture for better yields.
            </p>

            <div className="flex flex-wrap gap-4">
              <a href="https://48cdqc-i6.myshopify.com/collections/all" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-2 px-8 py-4 bg-[#4CAF50] text-white font-bold text-lg rounded-full hover:bg-[#43a047] transition-all duration-300 shadow-xl hover:-translate-y-0.5">
                <img src={ICONS.shop} alt="shop" width="22" height="22" className="invert" />
                Shop All Products
              </a>
              <button onClick={() => handleNav("#calculator")}
                className="flex items-center gap-2 px-8 py-4 bg-white/10 border border-white/30 text-white font-bold text-lg rounded-full hover:bg-white/20 transition-all duration-300">
                <img src={ICONS.calc} alt="calculator" width="22" height="22" className="invert opacity-80" />
                Free Calculator
              </button>
            </div>

            {/* Stats */}
            <div className="mt-14 grid grid-cols-3 gap-6 max-w-md">
              {[
                { value: "12,000+", label: "Farms Served" },
                { value: "98%", label: "Reorder Rate" },
                { value: "22", label: "States Covered" },
              ].map((stat) => (
                <div key={stat.label} className="text-center bg-white/10 rounded-2xl p-4 backdrop-blur-sm border border-white/10">
                  <div className="text-2xl font-black text-[#4CAF50]">{stat.value}</div>
                  <div className="text-gray-300 text-xs mt-1 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Trust Bar */}
      <div className="bg-[#1a3c2e] py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { icon: ICONS.certified, title: "100% Certified", desc: "All products are lab certified & quality tested" },
              { icon: ICONS.delivery,  title: "Fast Delivery",  desc: "Pan India delivery within 3–5 business days" },
              { icon: ICONS.lab,       title: "Lab Tested Results", desc: "Science-backed formulations for real results" },
            ].map((item) => (
              <div key={item.title} className="flex items-center gap-4 bg-white/5 rounded-2xl px-5 py-4 border border-white/10">
                <img src={item.icon} alt={item.title} width="36" height="36" className="invert shrink-0" />
                <div>
                  <p className="text-white font-bold text-sm">{item.title}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="bg-gray-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block text-[#4CAF50] font-semibold text-sm uppercase tracking-widest mb-3">Why Choose AgroWave</span>
            <h2 className="text-4xl font-black text-gray-900">Everything Your Farm <span className="text-[#1a3c2e]">Needs</span></h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div key={i} className="group bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl border border-gray-100 hover:border-[#4CAF50]/40 transition-all duration-300 hover:-translate-y-1">
                <div className="w-16 h-16 bg-gradient-to-br from-[#1a3c2e]/10 to-[#4CAF50]/20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <img src={featureIcons[i]} alt={f.title} width="36" height="36" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{f.title}</h3>
                <p className="text-gray-500 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}