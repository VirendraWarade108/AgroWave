import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Calculator from "./components/Calculator";
import CropCalendar from "./components/CropCalendar";
import Weather from "./components/Weather";
import Products from "./components/Products";
import Contact from "./components/Contact";

function Footer() {
  return (
    <footer className="bg-[#1B4332] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#40916C] to-[#74C69D] flex items-center justify-center text-xl shadow-md">
                🌱
              </div>
              <span className="text-2xl font-black">
                <span className="text-[#74C69D]">Agro</span>Smart
              </span>
            </div>
            <p className="text-[#B7E4C7] leading-relaxed text-sm">
              Pakistan's trusted agriculture companion. Empowering farmers with premium products and smart tools since 2009.
            </p>
            <div className="flex gap-3 mt-5">
              {["📘", "📸", "▶️", "🐦"].map((icon, i) => (
                <a
                  key={i}
                  href="#"
                  onClick={(e) => e.preventDefault()}
                  className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-[#40916C] transition-colors duration-200 text-sm"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-black text-[#74C69D] mb-4 uppercase tracking-wide text-sm">Quick Links</h4>
            <ul className="flex flex-col gap-2">
              {["Home", "Calculator", "Crop Calendar", "Weather", "Products", "Contact"].map((l) => (
                <li key={l}>
                  <a
                    href={`#${l.toLowerCase().replace(" ", "")}`}
                    onClick={(e) => {
                      e.preventDefault();
                      document.querySelector(`#${l.toLowerCase().replace(" ", "")}`)?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="text-gray-300 hover:text-[#74C69D] transition-colors text-sm"
                  >
                    → {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-black text-[#74C69D] mb-4 uppercase tracking-wide text-sm">Contact</h4>
            <div className="flex flex-col gap-3 text-sm text-gray-300">
              <p>📍 India</p>
              <p>📧 info@agrowave.in</p>
              <p>📞 +91 85548 79079</p>
              <p>⏰ Mon–Sat: 8AM – 7PM</p>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-400 text-sm">
            © 2025 AgroSmart. All rights reserved.
          </p>
          <p className="text-[#74C69D] text-sm font-semibold italic">
            "Empowering Farmers with Smart Tools" 🌾
          </p>
        </div>
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <div className="font-sans antialiased">
      <Navbar />
      <main>
        <Hero />
        <Calculator />
        <CropCalendar />
        <Weather />
        <Products />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}