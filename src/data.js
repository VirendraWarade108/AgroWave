export const cropCalendarData = [
  { id: 1, name: "Wheat", emoji: "🌾", plantingMonth: "November", harvestMonth: "April", waterNeeds: "Moderate", bestSoil: "Loamy", season: "Winter", color: "from-amber-400 to-yellow-500" },
  { id: 2, name: "Rice", emoji: "🌿", plantingMonth: "June", harvestMonth: "October", waterNeeds: "High", bestSoil: "Clay", season: "Summer", color: "from-green-400 to-emerald-500" },
  { id: 3, name: "Cotton", emoji: "🌸", plantingMonth: "March", harvestMonth: "October", waterNeeds: "Moderate", bestSoil: "Sandy", season: "Spring", color: "from-pink-300 to-rose-400" },
  { id: 4, name: "Sugarcane", emoji: "🎋", plantingMonth: "February", harvestMonth: "December", waterNeeds: "Very High", bestSoil: "Loamy", season: "Spring", color: "from-lime-400 to-green-500" },
  { id: 5, name: "Corn", emoji: "🌽", plantingMonth: "April", harvestMonth: "August", waterNeeds: "Moderate", bestSoil: "Loamy", season: "Summer", color: "from-yellow-300 to-orange-400" },
  { id: 6, name: "Tomatoes", emoji: "🍅", plantingMonth: "January", harvestMonth: "April", waterNeeds: "Moderate", bestSoil: "Sandy", season: "Winter", color: "from-red-400 to-rose-500" },
];

const FUNGICIDE = "https://48cdqc-i6.myshopify.com/collections/all?filter.v.price.gte=&filter.v.price.lte=&filter.p.product_type=Fungicide&sort_by=title-ascending";
const FUNGICIDE_INSECTICIDE = "https://48cdqc-i6.myshopify.com/collections/all?filter.p.product_type=Fungicide+%26+Insecticide&sort_by=title-ascending";
const HERBICIDE = "https://48cdqc-i6.myshopify.com/collections/all?filter.v.price.gte=&filter.v.price.lte=&filter.p.product_type=Herbicide&sort_by=title-ascending";
const INSECTICIDE = "https://48cdqc-i6.myshopify.com/collections/all?filter.v.price.gte=&filter.v.price.lte=&filter.p.product_type=Insecticide&sort_by=title-ascending";
const ALL_PRODUCTS = "https://48cdqc-i6.myshopify.com/collections/all?filter.v.price.gte=&filter.v.price.lte=&sort_by=title-ascending";

export const products = [
  {
    id: 1,
    name: "Abacin 250ml Insecticide",
    price: "₹700",
    description: "Effective pest control for crops. Broad-spectrum insecticide by Crystal for sucking & biting pests.",
    image: "https://images.unsplash.com/photo-1563514227147-6d2ff665a6a0?w=300&q=80",
    realImage: null,
    badge: "Best Product",
    badgeColor: "bg-[#1a3c2e]",
    shopifyUrl: INSECTICIDE,
    type: "Insecticide",
  },
  {
    id: 2,
    name: "Acrobat Fungicide 200gm",
    price: "₹999",
    description: "BASF Acrobat — systemic fungicide for downy mildew & late blight. Trusted pan-India by farmers.",
    image: "https://images.unsplash.com/photo-1592419044706-39796d40f98c?w=300&q=80",
    realImage: null,
    badge: "Best Product",
    badgeColor: "bg-[#1a3c2e]",
    shopifyUrl: FUNGICIDE,
    type: "Fungicide",
  },
  {
    id: 3,
    name: "Barazide 500ml Herbicide",
    price: "₹900",
    description: "Effective weed control for agricultural crops. Reliable pre & post-emergent herbicide for paddy & wheat.",
    image: "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=300&q=80",
    realImage: null,
    badge: "Limited Stock",
    badgeColor: "bg-orange-500",
    shopifyUrl: HERBICIDE,
    type: "Herbicide",
  },
  {
    id: 4,
    name: "Bavistin 500ml Fungicide",
    price: "₹650",
    description: "Carbendazim systemic crop protection. Controls soil-borne & foliar fungal diseases across major crops.",
    image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=300&q=80",
    realImage: null,
    badge: "Limited Stock",
    badgeColor: "bg-orange-500",
    shopifyUrl: FUNGICIDE,
    type: "Fungicide",
  },
  {
    id: 5,
    name: "Blu Copper Fungicide 500ml",
    price: "₹850",
    description: "Copper-based fungicide for bacterial & fungal disease control. Ideal for grapes, potato & tomato crops.",
    image: "https://images.unsplash.com/photo-1518398046578-8cca57782e17?w=300&q=80",
    realImage: null,
    badge: "Limited Stock",
    badgeColor: "bg-orange-500",
    shopifyUrl: FUNGICIDE,
    type: "Fungicide",
  },
  {
    id: 6,
    name: "Proclaim Insecticide 30g",
    price: "₹1,400",
    description: "Advanced caterpillar pest control. Highly effective against diamond-back moth & fruit borers.",
    image: "https://images.unsplash.com/photo-1559181567-c3190ca9d5db?w=300&q=80",
    realImage: null,
    badge: "Best Product",
    badgeColor: "bg-[#1a3c2e]",
    shopifyUrl: INSECTICIDE,
    type: "Insecticide",
  },
];

export const features = [
  {
    icon: "🌱",
    title: "Quality Products",
    description: "Certified, lab-tested agriculture products sourced from top brands like BASF, Crystal & Syngenta.",
  },
  {
    icon: "🧪",
    title: "Crop Protection",
    description: "Complete range of fungicides, insecticides & herbicides that protect crops and maximize yield safely.",
  },
  {
    icon: "👨‍🌾",
    title: "Expert Support",
    description: "Our agri-experts are available 24/7 to guide you on crop management, pest control, and soil health.",
  },
];

export const seoMeta = {
  title: "AgroWave – India's Trusted Agriculture Store | Seeds, Fertilizers & Pesticides",
  description: "Buy certified seeds, fertilizers, fungicides, insecticides & herbicides online. Trusted by 12,000+ Indian farmers. Fast delivery across 22 states. Shop AgroWave now.",
  keywords: "agriculture store india, buy fungicide online, insecticide india, herbicide for crops, crop protection products, farming tools india, fertilizer online, seeds india, agrowave, agro products india",
  ogTitle: "AgroWave – Farm Better | India's #1 Agri Store",
  ogDescription: "Premium quality crop protection products — fungicides, insecticides, herbicides and more. Delivered pan-India. Shop now at AgroWave.",
  canonical: "https://agrowave108-git-main-khushalwarade24-6419s-projects.vercel.app/",
};