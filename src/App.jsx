import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Calculator from "./components/Calculator";
import CropCalendar from "./components/CropCalendar";
import Weather from "./components/Weather";
import Products from "./components/Products";
import Contact from "./components/Contact";

function Footer() {
  return (
    <footer className="bg-[#0d2318] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="mb-4">
              <img
                src="https://res.cloudinary.com/do1q7vrjj/image/upload/v1773466303/agrowave_logo3_clean_nobg_di2csk.png"
                alt="AgroWave Logo"
                className="h-12 w-auto object-contain"
              />
            </div>
            <p className="text-gray-400 leading-relaxed text-sm mb-4">
              India's trusted agriculture companion. Rooted in science, built for farmers. Empowering 12,000+ farms since 2009.
            </p>
            <div className="flex gap-3">
              {[
                { icon: "https://cdn-icons-png.flaticon.com/128/5968/5968764.png", label: "Facebook" },
                { icon: "https://cdn-icons-png.flaticon.com/128/2111/2111463.png", label: "Instagram" },
                { icon: "https://cdn-icons-png.flaticon.com/128/1384/1384060.png", label: "YouTube" },
                { icon: "https://cdn-icons-png.flaticon.com/128/3670/3670151.png", label: "Twitter" },
              ].map((social, i) => (
                <a key={i} href="#" onClick={(e) => e.preventDefault()}
                  className="w-9 h-9 bg-white/10 rounded-lg flex items-center justify-center hover:bg-[#4CAF50] transition-colors duration-200">
                  <img src={social.icon} alt={social.label} width="18" height="18" className="invert opacity-80" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-black text-[#4CAF50] mb-4 uppercase tracking-wide text-sm">Quick Links</h4>
            <ul className="flex flex-col gap-2">
              {["Home", "Calculator", "Crop Calendar", "Weather", "Products", "Contact"].map((l) => (
                <li key={l}>
                  <a href={`#${l.toLowerCase().replace(" ", "")}`}
                    onClick={(e) => {
                      e.preventDefault();
                      document.getElementById(l.toLowerCase().replace(" ", ""))?.scrollIntoView({ behavior: "smooth" });
                    }}
                    className="text-gray-400 hover:text-[#4CAF50] transition-colors text-sm">
                    → {l}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Store Links */}
          <div>
            <h4 className="font-black text-[#4CAF50] mb-4 uppercase tracking-wide text-sm">Our Store</h4>
            <ul className="flex flex-col gap-2">
              {[
                { label: "All Products", href: "/collections/all" },
                { label: "Seeds", href: "/collections/seeds" },
                { label: "Fertilizers", href: "/collections/fertilizers" },
                { label: "Pesticides", href: "/collections/pesticides" },
                { label: "Micronutrients", href: "/collections/micronutrients" },
                { label: "Herbicides", href: "/collections/herbicides" },
              ].map((l) => (
                <li key={l.label}>
                  <a href={`https://48cdqc-i6.myshopify.com${l.href}`} target="_blank" rel="noopener noreferrer"
                    className="text-gray-400 hover:text-[#4CAF50] transition-colors text-sm">
                    → {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-black text-[#4CAF50] mb-4 uppercase tracking-wide text-sm">Contact</h4>
            <div className="flex flex-col gap-3 text-sm text-gray-400">
              <p>📍 India</p>
              <p>📧 virendrawarade873@agrowave.in</p>
              <p>📞 +91 85548 79079</p>
              <p>⏰ Mon–Sat: 8AM – 7PM</p>
              <a href="https://wa.me/918554879079" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 mt-2 px-4 py-2 bg-[#25D366] text-white text-xs font-bold rounded-full w-fit hover:bg-[#20b858] transition-colors">
                📱 WhatsApp Us
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">© 2026 AgroWave. All rights reserved.</p>
          <p className="text-[#4CAF50] text-sm font-semibold italic">"Empowering Farmers with Smart Tools" 🌾</p>
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
