import { features } from "../data";

export default function Hero() {
  const handleNav = (href) => {
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="home" className="pt-16">
      {/* Hero Banner */}
      <div className="relative min-h-[92vh] flex items-center overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1500595046743-cd271d694d30?w=1600&q=80')",
          }}
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#1B4332]/90 via-[#2D6A4F]/80 to-[#2D6A4F]/40" />
        {/* Decorative circles */}
        <div className="absolute top-20 right-20 w-64 h-64 bg-[#74C69D]/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-40 w-48 h-48 bg-[#40916C]/15 rounded-full blur-2xl" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="max-w-2xl">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-[#74C69D]/20 border border-[#74C69D]/40 rounded-full px-4 py-1.5 mb-6 backdrop-blur-sm">
              <span className="w-2 h-2 bg-[#74C69D] rounded-full animate-pulse" />
              <span className="text-[#74C69D] text-sm font-medium">Pakistan's Trusted Agri Store</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-tight mb-6">
              Smart Farming{" "}
              <span className="text-[#74C69D] block">Starts Here</span>
            </h1>

            <p className="text-lg text-gray-200 mb-10 leading-relaxed max-w-lg">
              Your complete agriculture partner — premium seeds, fertilizers, tools, and
              expert guidance to maximize your harvest every season.
            </p>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => handleNav("#products")}
                className="px-8 py-4 bg-[#74C69D] text-[#1B4332] font-bold text-lg rounded-2xl hover:bg-white hover:text-[#2D6A4F] transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-0.5 active:translate-y-0"
              >
                🛒 Shop Now
              </button>
              <button
                onClick={() => handleNav("#calculator")}
                className="px-8 py-4 bg-white/10 border border-white/30 text-white font-bold text-lg rounded-2xl hover:bg-white/20 transition-all duration-300 backdrop-blur-sm"
              >
                🧪 Try Calculator
              </button>
            </div>

            {/* Quick Stats */}
            <div className="mt-14 flex flex-wrap gap-8">
              {[
                { value: "500+", label: "Products" },
                { value: "10K+", label: "Farmers Served" },
                { value: "15+", label: "Years Experience" },
              ].map((stat) => (
                <div key={stat.label}>
                  <div className="text-3xl font-black text-[#74C69D]">{stat.value}</div>
                  <div className="text-gray-300 text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Feature Cards */}
      <div className="bg-gray-50 py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <span className="inline-block text-[#40916C] font-semibold text-sm uppercase tracking-widest mb-3">Why Choose Us</span>
            <h2 className="text-4xl font-black text-gray-900">
              Everything Your Farm <span className="text-[#2D6A4F]">Needs</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <div
                key={i}
                className="group bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl border border-gray-100 hover:border-[#74C69D]/40 transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-[#2D6A4F]/10 to-[#74C69D]/20 rounded-2xl flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition-transform duration-300">
                  {f.icon}
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