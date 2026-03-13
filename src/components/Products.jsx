import { products } from "../data";

export default function Products() {
  return (
    <section id="products" className="py-20 bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-14">
          <span className="inline-block text-[#40916C] font-semibold text-sm uppercase tracking-widest mb-3">Our Store</span>
          <h2 className="text-4xl font-black text-gray-900 mb-4">
            Featured <span className="text-[#2D6A4F]">Products</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Top-rated agriculture products trusted by thousands of farmers across Pakistan.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl border border-gray-100 transition-all duration-300 hover:-translate-y-1.5 flex flex-col"
            >
              {/* Product Image Area */}
              <div className="relative bg-gradient-to-br from-[#D8F3DC] to-[#B7E4C7] h-48 flex items-center justify-center">
                <span className="text-7xl group-hover:scale-110 transition-transform duration-300">{product.emoji}</span>
                <span className={`absolute top-4 right-4 ${product.badgeColor} text-white text-xs font-bold px-3 py-1 rounded-full shadow`}>
                  {product.badge}
                </span>
              </div>

              {/* Product Info */}
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-lg font-black text-gray-900 mb-2">{product.name}</h3>
                <p className="text-gray-500 text-sm leading-relaxed flex-1 mb-4">
                  {product.description}
                </p>

                <div className="flex items-center justify-between mt-auto">
                  <span className="text-2xl font-black text-[#2D6A4F]">{product.price}</span>
                  <a
                    href={product.shopifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-5 py-2.5 bg-[#2D6A4F] text-white font-bold text-sm rounded-xl hover:bg-[#40916C] transition-colors duration-200 shadow-sm"
                  >
                    Buy Now →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div className="mt-16 bg-gradient-to-r from-[#2D6A4F] to-[#40916C] rounded-3xl p-10 text-center text-white shadow-xl">
          <h3 className="text-3xl font-black mb-3">View Our Full Catalog</h3>
          <p className="text-[#B7E4C7] mb-8 text-lg">500+ agriculture products ready for delivery across India</p>
          <a
            href="https://48cdqc-i6.myshopify.com/collections/all"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-10 py-4 bg-[#74C69D] text-[#1B4332] font-black text-lg rounded-2xl hover:bg-white transition-colors duration-200"
          >
            🛒 Shop All Products
          </a>
        </div>
      </div>
    </section>
  );
}