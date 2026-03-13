import { useState } from "react";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) return;
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <section id="contact" className="py-20 bg-white px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <span className="inline-block text-[#40916C] font-semibold text-sm uppercase tracking-widest mb-3">Get In Touch</span>
          <h2 className="text-4xl font-black text-gray-900 mb-4">
            Contact <span className="text-[#2D6A4F]">Us</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Questions about products, bulk orders, or farming advice? We're here to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          {/* Contact Form */}
          <div className="bg-gradient-to-br from-[#F0FFF4] to-white border border-[#74C69D]/30 rounded-3xl p-8 shadow-lg">
            <h3 className="text-xl font-black text-gray-900 mb-6">Send Us a Message</h3>

            {submitted && (
              <div className="mb-4 p-4 bg-green-100 border border-green-300 rounded-xl text-green-800 font-semibold text-sm">
                ✅ Message sent! We'll get back to you within 24 hours.
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="Muhammad Ali"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#40916C] focus:outline-none text-gray-800 bg-white transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="farmer@email.com"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#40916C] focus:outline-none text-gray-800 bg-white transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                <textarea
                  required
                  rows={4}
                  placeholder="Tell us about your farming needs or bulk order..."
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-[#40916C] focus:outline-none text-gray-800 bg-white transition-colors resize-none"
                />
              </div>
              <button
                type="submit"
                className="py-4 bg-gradient-to-r from-[#2D6A4F] to-[#40916C] text-white font-bold text-base rounded-2xl hover:from-[#40916C] hover:to-[#74C69D] transition-all duration-300 shadow-md"
              >
                📨 Send Message
              </button>
            </form>
          </div>

          {/* Contact Info */}
          <div className="flex flex-col gap-6">
            {/* WhatsApp CTA */}
            <a
              href="https://wa.me/918554879079"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-5 bg-[#25D366] rounded-3xl p-7 text-white shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">
                📱
              </div>
              <div>
                <div className="font-black text-xl">Chat on WhatsApp</div>
                <div className="text-green-100 text-sm mt-0.5">Instant reply for bulk orders</div>
                <div className="font-bold text-lg mt-1">+91 85548 79079</div>
              </div>
            </a>

            {/* Address & Email */}
            <div className="bg-gray-50 rounded-3xl p-7 border border-gray-100">
              <h3 className="text-xl font-black text-gray-900 mb-6">Our Details</h3>
              <div className="flex flex-col gap-5">
                {[
                  {
                    icon: "📍",
                    label: "Address",
                    value: "India",
                  },
                  {
                    icon: "📧",
                    label: "Email",
                    value: "info@agrowave.in",
                  },
                  {
                    icon: "⏰",
                    label: "Hours",
                    value: "Monday – Saturday, 8:00 AM – 7:00 PM",
                  },
                  {
                    icon: "📞",
                    label: "Phone",
                    value: "+91 85548 79079",
                  },
                ].map((item) => (
                  <div key={item.label} className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-[#74C69D]/20 rounded-xl flex items-center justify-center text-xl shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide">{item.label}</p>
                      <p className="text-gray-800 font-medium">{item.value}</p>
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