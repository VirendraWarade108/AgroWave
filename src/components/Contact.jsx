import { useState } from "react";

const WHATSAPP_NUMBER = "918554879079";

const ICONS = {
  phone:    "https://cdn-icons-png.flaticon.com/128/6470/6470993.png",
  location: "https://cdn-icons-png.flaticon.com/128/11785/11785250.png",
  email:    "https://cdn-icons-png.flaticon.com/128/7286/7286142.png",
  clock:    "https://cdn-icons-png.flaticon.com/128/2972/2972554.png",
  call:     "https://cdn-icons-png.flaticon.com/128/950/950237.png",
  shop:     "https://cdn-icons-png.flaticon.com/128/17787/17787183.png",
};

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    const text = `Hello AgroWave! 🌿\n\n*New Inquiry from Website*\n\n👤 Name: ${form.name}\n📧 Email: ${form.email}\n\n💬 Message:\n${form.message}\n\n---\nSent from AgroWave Farming Tools App`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, "_blank");
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <section id="contact" className="py-20 bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <span className="inline-block text-[#4CAF50] font-semibold text-sm uppercase tracking-widest mb-3">Get In Touch</span>
          <h2 className="text-4xl font-black text-gray-900 mb-4">Contact <span className="text-[#1a3c2e]">Us</span></h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">Questions about products, bulk orders, or farming advice? We're here to help.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Form */}
          <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-sm">
            <h3 className="text-xl font-black text-gray-900 mb-2">Send Us a Message</h3>
            <p className="text-gray-400 text-sm mb-6">Fill the form — it will open WhatsApp with your message pre-filled. Just hit Send!</p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Your Name *</label>
                <input type="text" required placeholder="Rahul Sharma" value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#4CAF50] focus:outline-none text-gray-800 bg-white transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address *</label>
                <input type="email" required placeholder="farmer@email.com" value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#4CAF50] focus:outline-none text-gray-800 bg-white transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Message *</label>
                <textarea required rows={4} placeholder="Tell us about your crop, pest problem, or bulk order..."
                  value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#4CAF50] focus:outline-none text-gray-800 bg-white transition-colors resize-none" />
              </div>
              <button type="submit"
                className="py-4 bg-[#25D366] text-white font-bold text-base rounded-2xl hover:bg-[#20b858] transition-all duration-300 shadow-md flex items-center justify-center gap-2">
                <img src={ICONS.phone} alt="whatsapp" width="22" height="22" className="invert" />
                Send via WhatsApp
              </button>
              <p className="text-center text-xs text-gray-400">Clicking will open WhatsApp with your message ready to send</p>
            </form>
          </div>

          {/* Info */}
          <div className="flex flex-col gap-5">
            {/* WhatsApp CTA */}
            <a href={`https://wa.me/${WHATSAPP_NUMBER}`} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-5 bg-[#25D366] rounded-3xl p-7 text-white shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group">
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shrink-0">
                <img src={ICONS.phone} alt="whatsapp" width="36" height="36" className="invert" />
              </div>
              <div>
                <div className="font-black text-xl">Chat on WhatsApp</div>
                <div className="text-green-100 text-sm mt-0.5">Instant reply for bulk orders & queries</div>
                <div className="font-bold text-lg mt-1">+91 85548 79079</div>
              </div>
            </a>

            {/* Store link */}
            <a href="https://48cdqc-i6.myshopify.com/collections/all" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-5 bg-[#1a3c2e] rounded-3xl p-6 text-white hover:bg-[#4CAF50] transition-all duration-300 group">
              <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
                <img src={ICONS.shop} alt="store" width="30" height="30" className="invert" />
              </div>
              <div>
                <div className="font-black text-lg">Visit Our Store</div>
                <div className="text-gray-300 text-sm mt-0.5 group-hover:text-white">Browse all products on AgroWave</div>
              </div>
            </a>

            {/* Details */}
            <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              <h3 className="text-lg font-black text-gray-900 mb-5">Our Details</h3>
              <div className="flex flex-col gap-4">
                {[
                  { icon: ICONS.location, label: "Address", value: "India" },
                  { icon: ICONS.email,    label: "Email",   value: "info@agrowave.in" },
                  { icon: ICONS.clock,    label: "Hours",   value: "Mon – Sat, 8:00 AM – 7:00 PM" },
                  { icon: ICONS.call,     label: "Phone",   value: "+91 85548 79079" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[#4CAF50]/10 rounded-xl flex items-center justify-center shrink-0">
                      <img src={item.icon} alt={item.label} width="20" height="20" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">{item.label}</p>
                      <p className="text-gray-800 font-medium text-sm">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}