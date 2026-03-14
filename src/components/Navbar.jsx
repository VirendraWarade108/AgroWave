import { useState, useEffect } from "react";

const navLinks = [
  { label: "Home", href: "#home" },
  { label: "Calculator", href: "#calculator" },
  { label: "Crop Calendar", href: "#calendar" },
  { label: "Weather", href: "#weather" },
  { label: "Products", href: "#products" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleNav = (href) => {
    setMenuOpen(false);
    const el = document.querySelector(href);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? "bg-[#1a3c2e] shadow-xl" : "bg-[#1a3c2e]"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"/>
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => handleNav("#home")}>
            <img
              src="https://res.cloudinary.com/do1q7vrjj/image/upload/v1773466303/agrowave_logo3_clean_nobg_di2csk.png"
              alt="AgroWave Logo"
              className="h-10 w-auto object-contain"
            />

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <button key={link.href} onClick={() => handleNav(link.href)}
                className="px-3 py-2 rounded-lg text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200">
                {link.label}
              </button>
            ))}
            <a href="https://48cdqc-i6.myshopify.com" target="_blank" rel="noopener noreferrer"
              className="ml-3 px-5 py-2 bg-[#4CAF50] text-white text-sm font-bold rounded-full hover:bg-[#43a047] transition-all duration-200 shadow-md">
              🛒 Shop Now
            </a>
          </div>

          <button className="md:hidden p-2 rounded-lg text-white hover:bg-white/10 transition-colors"
            onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
            <div className="w-5 h-5 flex flex-col justify-center gap-1.5">
              <span className={`block h-0.5 bg-white transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`block h-0.5 bg-white transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`block h-0.5 bg-white transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </div>
          </button>
        </div>
      </div>

      <div className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
        <div className="bg-[#152e23] border-t border-white/10 px-4 py-3 flex flex-col gap-1">
          {navLinks.map((link) => (
            <button key={link.href} onClick={() => handleNav(link.href)}
              className="text-left px-4 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:bg-white/10 hover:text-white transition-all">
              {link.label}
            </button>
          ))}
          <a href="https://48cdqc-i6.myshopify.com" target="_blank" rel="noopener noreferrer"
            className="mt-2 px-4 py-3 bg-[#4CAF50] text-white text-sm font-bold rounded-xl text-center">
            🛒 Shop Now
          </a>
        </div>
      </div>
    </nav>
  );
}