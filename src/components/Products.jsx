import { products } from "../data";

const ALL_PRODUCTS = "https://48cdqc-i6.myshopify.com/collections/all?filter.v.price.gte=&filter.v.price.lte=&sort_by=title-ascending";

// Category filter buttons matching AgroWave store product types
const categories = [
  { label: "All Products", url: ALL_PRODUCTS },
  { label: "Fungicide", url: "https://48cdqc-i6.myshopify.com/collections/all?filter.v.price.gte=&filter.v.price.lte=&filter.p.product_type=Fungicide&sort_by=title-ascending" },
  { label: "Insecticide", url: "https://48cdqc-i6.myshopify.com/collections/all?filter.v.price.gte=&filter.v.price.lte=&filter.p.product_type=Insecticide&sort_by=title-ascending" },
  { label: "Herbicide", url: "https://48cdqc-i6.myshopify.com/collections/all?filter.v.price.gte=&filter.v.price.lte=&filter.p.product_type=Herbicide&sort_by=title-ascending" },
  { label: "Fungicide & Insecticide", url: "https://48cdqc-i6.myshopify.com/collections/all?filter.p.product_type=Fungicide+%26+Insecticide&sort_by=title-ascending" },
];

// Product images — real Shopify product image style placeholders
const productImages = {
  1: "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=400&q=80",
  2: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&q=80",
  3: "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?w=400&q=80",
  4: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&q=80",
  5: "https://images.unsplash.com/photo-1592419044706-39796d40f98c?w=400&q=80",
  6: "https://images.unsplash.com/photo-1559181567-c3190ca9d5db?w=400&q=80",
};

export default function Products() {
  return (
    <section id="products" className="py-20 bg-white px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-10">
          <span className="inline-block text-[#4CAF50] font-semibold text-sm uppercase tracking-widest mb-3">Trusted By Farmers</span>
          <h2 className="text-4xl font-black text-gray-900 mb-4">
            Featured <span className="text-[#1a3c2e]">Products</span>
          </h2>
          <p className="text-gray-500 text-lg max-w-xl mx-auto">
            Top-rated crop protection products from BASF, Crystal & Syngenta. Trusted by 12,000+ Indian farmers.
          </p>
        </div>

        {/* Category Filter Buttons — links to Shopify collections */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((cat) => (
            <a
              key={cat.label}
              href={cat.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2 rounded-full text-sm font-semibold border border-gray-200 text-gray-600 hover:bg-[#1a3c2e] hover:text-white hover:border-[#1a3c2e] transition-all duration-200"
            >
              {cat.label}
            </a>
          ))}
        </div>

        {/* Product Grid — matching AgroWave Shopify store card style */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 transition-all duration-300 hover:-translate-y-1 flex flex-col"
            >
              {/* Product Image — white background like Shopify store */}
              <div className="relative bg-white h-52 flex items-center justify-center p-4 border-b border-gray-50">
                <img
                  src={productImages[product.id]}
                  alt={product.name}
                  className="h-44 w-full object-contain group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                  width="300"
                  height="176"
                />
                {/* Badge — top left like AgroWave store */}
                <span className={`absolute top-3 left-3 ${product.badgeColor} text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow`}>
                  {product.badge}
                </span>
                {/* Product type tag */}
                <span className="absolute top-3 right-3 bg-gray-100 text-gray-500 text-[10px] font-semibold px-2.5 py-1 rounded-full">
                  {product.type}
                </span>
              </div>

              {/* Product Info */}
              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-sm font-bold text-gray-900 mb-1 leading-snug">{product.name}</h3>
                <p className="text-gray-400 text-xs leading-relaxed flex-1 mb-4">{product.description}</p>
                <div className="flex items-center justify-between mt-auto">
                  <div>
                    <span className="text-lg font-black text-gray-900">{product.price}</span>
                    <span className="text-xs text-gray-400 ml-1">INR</span>
                  </div>
                  <a
                    href={product.shopifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-[#1a3c2e] text-white font-bold text-xs rounded-lg hover:bg-[#4CAF50] transition-colors duration-200 shadow-sm"
                  >
                    Add to Cart
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View All Banner */}
        <div className="mt-14 bg-gradient-to-r from-[#0d2318] to-[#1a3c2e] rounded-3xl p-10 text-center text-white shadow-xl">
          <p className="text-[#4CAF50] font-semibold text-sm uppercase tracking-widest mb-2">Find What Your Crop Needs</p>
          <h3 className="text-3xl font-black mb-3">View Our Full Catalog</h3>
          <p className="text-gray-300 mb-3 text-base">Fungicides · Insecticides · Herbicides · Micronutrients</p>
          <p className="text-[#74C69D] text-sm mb-8">98% Reorder Rate · 22 States Covered · 12,000+ Farms Served</p>
          <a
            href={ALL_PRODUCTS}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-10 py-4 bg-[#4CAF50] text-white font-black text-lg rounded-full hover:bg-white hover:text-[#1a3c2e] transition-colors duration-200"
          >
            🛒 View All Products
          </a>
        </div>
      </div>
    </section>
  );
}