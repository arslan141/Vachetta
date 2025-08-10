/**
 * Vachetta Products Seeding Script
 * Creates an extensive collection of leather goods.
 * * Usage: node scripts/seed-products.js
 */

const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

// Product Schema (Standard Collection)
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number },
  category: { type: String, required: true, enum: ['bags', 'wallets', 'belts', 'accessories', 'jackets'] },
  subcategory: { type: String },
  images: [{ url: String, alt: String, isPrimary: { type: Boolean, default: false } }],
  stock: { type: Number, default: 0 },
  sku: { type: String, unique: true },
  material: { type: String, default: 'Premium Leather' },
  color: { type: String },
  size: { type: String },
  weight: { type: String },
  dimensions: { length: String, width: String, height: String },
  features: [String],
  care: [String],
  isActive: { type: Boolean, default: true },
  isFeatured: { type: Boolean, default: false },
  rating: { average: { type: Number, default: 0 }, count: { type: Number, default: 0 } },
  tags: [String],
  seo: { title: String, description: String, keywords: [String] }
}, { timestamps: true });

// Leather Product Schema (Premium Collection)
const LeatherProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true, enum: ['premium-bags', 'luxury-wallets', 'custom-belts', 'artisan-accessories'] },
  leatherType: { type: String, enum: ['full-grain', 'top-grain', 'vachetta', 'patent', 'suede'], default: 'vachetta' },
  craftmanship: { artisan: String, technique: String, timeToMake: String, origin: String },
  customization: { available: { type: Boolean, default: true }, options: [String] },
  images: [{ url: String, alt: String, isPrimary: Boolean }],
  stock: { type: Number, default: 5 },
  sku: { type: String, unique: true },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

const Product = mongoose.model('Product', ProductSchema);
const LeatherProduct = mongoose.model('LeatherProduct', LeatherProductSchema);

// --- Expanded Sample Products Data (21 Products) ---
const sampleProducts = [
  // Wallets (5)
  {
    name: "Classic Bi-Fold Wallet",
    description: "A timeless bi-fold wallet crafted from rich, full-grain leather. It features ample card slots, a spacious bill compartment, and a dedicated ID window, combining classic style with modern functionality.",
    price: 89.99,
    originalPrice: 119.99,
    category: "wallets",
    subcategory: "bi-fold",
    images: [
      { url: "https://duret-paris.com/en/product/oxblood-color-vegetable-tanned-calfskin-empeiria-wallet/", alt: "Classic Bi-Fold Wallet", isPrimary: true }
    ],
    stock: 75,
    sku: "WAL-BIF-001",
    material: "Full-Grain Leather",
    color: "Rich Brown",
    features: ["8 card slots", "2 bill compartments", "ID window", "RFID blocking", "Hand-stitched edges"],
    isFeatured: true,
    rating: { average: 4.7, count: 189 }
  },
  {
    name: "Minimalist Card Holder",
    description: "Designed for the modern minimalist, this slim card holder is made from fine Italian leather. It fits comfortably in any pocket while keeping your essential cards secure.",
    price: 39.99,
    category: "wallets",
    subcategory: "card-holder",
    images: [
      { url: "https://nableather.com/products/engraved-cognac-full-grain-leather-minimalist-wallet", alt: "Minimalist Card Holder", isPrimary: true }
    ],
    stock: 120,
    sku: "WAL-CRD-002",
    material: "Italian Leather",
    color: "Cognac",
    features: ["Holds 4-6 cards", "Ultra-slim design", "Center cash pocket", "Hand-stitched"],
    rating: { average: 4.8, count: 254 }
  },
  {
    name: "Traveler's Zip Wallet",
    description: "The perfect companion for your journeys. This zip-around wallet secures your passport, currencies, and cards with a durable zipper and organized interior.",
    price: 119.99,
    category: "wallets",
    subcategory: "travel",
    images: [
      { url: "https://www.polareoriginal.com/products/rfid-passport-wallet", alt: "Traveler's Zip Wallet", isPrimary: true }
    ],
    stock: 40,
    sku: "WAL-TRV-003",
    material: "Top-Grain Leather",
    color: "Obsidian Black",
    features: ["Zip-around closure", "Passport sleeve", "Multiple currency sections", "Boarding pass slot", "Pen holder"],
    rating: { average: 4.6, count: 95 }
  },
  {
    name: "Rugged Money Clip Wallet",
    description: "For those who prefer a streamlined carry, this rugged wallet combines card slots with a sturdy, spring-loaded money clip. Made from distressed leather for a vintage look.",
    price: 59.99,
    category: "wallets",
    subcategory: "money-clip",
    images: [
      { url: "https://www.colonellittleton.com/shop/money-clip-wallet-no-11/", alt: "Rugged Money Clip Wallet", isPrimary: true }
    ],
    stock: 65,
    sku: "WAL-CLP-004",
    material: "Distressed Leather",
    color: "Saddle Brown",
    features: ["3 external card slots", "Polished steel money clip", "Slim profile", "Durable construction"],
    rating: { average: 4.5, count: 112 }
  },
  {
    name: "Heritage Long Wallet",
    description: "A sophisticated long wallet, also known as a breast-pocket wallet, designed to hold bills flat and provide numerous card slots without adding bulk. A statement of elegance.",
    price: 139.99,
    category: "wallets",
    subcategory: "long-wallet",
    images: [
      { url: "https://duret-paris.com/en/product/oxblood-color-vegetable-tanned-calfskin-empeiria-wallet/", alt: "Heritage Long Wallet", isPrimary: true }
    ],
    stock: 30,
    sku: "WAL-LNG-005",
    material: "Full-Grain Calfskin",
    color: "Oxblood",
    features: ["12 card slots", "2 full-length bill compartments", "Checkbook sleeve", "Silk-blend lining", "Fits in a jacket's inner pocket"],
    isFeatured: true,
    rating: { average: 4.9, count: 78 }
  },
  // Bags (6)
  {
    name: "Classic Vachetta Tote Bag",
    description: "Handcrafted from premium vachetta leather, this timeless tote develops a beautiful patina over time. Perfect for daily use with its spacious interior and elegant design.",
    price: 289.99,
    category: "bags",
    subcategory: "tote",
    images: [
      { url: "https://findlayco.com/products/simple-mag-tote-smooth-natural-vachetta-1", alt: "Classic Vachetta Tote Bag", isPrimary: true }
    ],
    stock: 25,
    sku: "BAG-TTE-001",
    material: "Premium Vachetta Leather",
    color: "Natural Tan",
    features: ["Develops beautiful patina", "Cotton canvas lining", "Interior zip pocket", "Magnetic snap closure"],
    isFeatured: true,
    rating: { average: 4.8, count: 127 }
  },
  {
    name: "Vintage Messenger Bag",
    description: "Inspired by classic postal bags, this messenger combines functionality with timeless appeal. Made from durable distressed leather, it's perfect for work or everyday adventures.",
    price: 199.99,
    category: "bags",
    subcategory: "messenger",
    images: [
      { url: "https://classyleatherbags.com/products/retro-vintage-distressed-large-leather-messenger-bag", alt: "Vintage Messenger Bag", isPrimary: true }
    ],
    stock: 18,
    sku: "BAG-MSG-002",
    material: "Distressed Leather",
    color: "Vintage Brown",
    features: ["Adjustable shoulder strap", "Padded laptop compartment (fits 14-inch)", "Antique brass hardware"],
    rating: { average: 4.6, count: 64 }
  },
  {
    name: "Executive Leather Briefcase",
    description: "A structured, professional briefcase for the modern executive. Crafted from sleek, premium leather, it features multiple compartments and robust hardware for a commanding presence.",
    price: 449.99,
    category: "bags",
    subcategory: "briefcase",
    images: [
      { url: "https://luxorro.com/products/the-maverick-leather-briefcase", alt: "Executive Leather Briefcase", isPrimary: true }
    ],
    stock: 12,
    sku: "BAG-BRF-003",
    material: "Premium Top-Grain Leather",
    color: "Deep Black",
    features: ["Padded laptop compartment (fits 15-inch)", "Multiple file organizers", "Detachable shoulder strap", "Trolley sleeve on back"],
    isFeatured: true,
    rating: { average: 4.9, count: 31 }
  },
  {
    name: "Nomad Leather Backpack",
    description: "The Nomad backpack offers style and utility for the urban explorer. With a spacious main compartment, a secure laptop sleeve, and comfortable straps, it's built for life on the move.",
    price: 329.99,
    category: "bags",
    subcategory: "backpack",
    images: [
      { url: "https://www.korchmar.com/products/lewis-1", alt: "Nomad Leather Backpack", isPrimary: true }
    ],
    stock: 22,
    sku: "BAG-BCK-004",
    material: "Full-Grain Cowhide",
    color: "Espresso Brown",
    features: ["Padded 15-inch laptop sleeve", "Two front utility pockets", "Padded, adjustable shoulder straps", "Top grab handle"],
    rating: { average: 4.7, count: 55 }
  },
  {
    name: "Weekender Duffle Bag",
    description: "The quintessential bag for short trips and getaways. Our Weekender is crafted from supple yet durable leather and sized perfectly for overhead compartments.",
    price: 399.99,
    category: "bags",
    subcategory: "duffle",
    images: [
      { url: "https://mahileather.com/products/duffle-in-vintage-brown", alt: "Weekender Duffle Bag", isPrimary: true }
    ],
    stock: 15,
    sku: "BAG-DUF-005",
    material: "Full-Grain Leather",
    color: "Caramel Brown",
    features: ["Cabin-size compliant", "Removable shoulder strap", "Interior zip pockets", "Protective metal feet"],
    isFeatured: true,
    rating: { average: 4.8, count: 88 }
  },
  {
    name: "Sleek Leather Crossbody",
    description: "For days when you only need the essentials. This sleek crossbody bag keeps your phone, wallet, and keys secure and accessible without weighing you down. ",
    price: 159.99,
    category: "bags",
    subcategory: "crossbody",
    images: [
      { url: "https://www.coach.com/shop/women/handbags/crossbody-bags", alt: "Sleek Leather Crossbody", isPrimary: true }
    ],
    stock: 35,
    sku: "BAG-CRS-006",
    material: "Pebbled Leather",
    color: "Black",
    features: ["Adjustable strap", "Exterior slip pocket", "Secure top-zip closure", "Compact and lightweight design"],
    rating: { average: 4.6, count: 43 }
  },
  // Belts (3)
  {
    name: "Classic Dress Belt",
    description: "The perfect finishing touch for any formal or business attire. This belt is crafted from smooth, top-grain leather with a polished silver-tone buckle.",
    price: 69.99,
    category: "belts",
    subcategory: "dress",
    images: [
      { url: "https://www.trendhim.com/all-black-full-grain-leather-dress-belt-p.html", alt: "Classic Dress Belt", isPrimary: true }
    ],
    stock: 90,
    sku: "BLT-DRS-001",
    material: "Top-Grain Leather",
    color: "Black",
    size: "Available in 32-42 inches",
    features: ["Polished silver-tone buckle", "1.25-inch width", "Hand-finished edges", "Versatile for formal wear"],
    rating: { average: 4.7, count: 152 }
  },
  {
    name: "Casual Jean Belt",
    description: "A rugged, wide belt designed to pair perfectly with your favorite denim. Made from thick, full-grain leather that will only get better with age.",
    price: 79.99,
    category: "belts",
    subcategory: "casual",
    images: [
      { url: "https://www.timberland.com/en-us/p/men/accessories-10058/mens-38mm-classic-reversible-belt-TB0A1CMN214", alt: "Casual Jean Belt", isPrimary: true }
    ],
    stock: 80,
    sku: "BLT-CSL-002",
    material: "Full-Grain Buffalo Leather",
    color: "Timber Brown",
    size: "Available in 32-44 inches",
    features: ["Solid brass roller buckle", "1.5-inch width", "Durable construction", "Pairs well with jeans and chinos"],
    rating: { average: 4.8, count: 210 }
  },
  {
    name: "Woven Leather Belt",
    description: "Add a touch of texture to your look with this intricately woven leather belt. Its braided design allows for a perfect fit at any point, eliminating the need for pre-set holes.",
    price: 89.99,
    category: "belts",
    subcategory: "braided",
    images: [
      { url: "https://www.thearmoury.com/collections/belts/woven-belt-with-leather-covered-buckle?variant=39994688208967", alt: "Woven Leather Belt", isPrimary: true }
    ],
    stock: 50,
    sku: "BLT-WVN-003",
    material: "Woven Calfskin",
    color: "Natural Tan",
    size: "Available in S, M, L, XL",
    features: ["Intricate woven construction", "No-hole design for a custom fit", "Leather-tipped end", "Satin nickel buckle"],
    rating: { average: 4.6, count: 98 }
  },
  // Accessories (5)
  {
    name: "Writer's Leather Journal",
    description: "A handsome, refillable leather journal cover that inspires you to write, sketch, or plan. The wrap-around tie keeps your thoughts secure.",
    price: 59.99,
    category: "accessories",
    subcategory: "journal",
    images: [
      { url: "https://innovativejournaling.com/products/traditional-refillable-journal-wrap-and-tie-closure", alt: "Writer's Leather Journal", isPrimary: true }
    ],
    stock: 60,
    sku: "ACC-JNL-001",
    material: "Distressed Full-Grain Leather",
    color: "Walnut Brown",
    features: ["Includes A5 lined paper insert", "Refillable design", "Leather wrap closure", "Interior pen loop"],
    rating: { average: 4.9, count: 180 }
  },
  {
    name: "Globetrotter Passport Holder",
    description: "Travel in style and keep your most important document safe. This leather passport holder includes slots for your passport, boarding pass, and essential cards.",
    price: 49.99,
    category: "accessories",
    subcategory: "passport-holder",
    images: [
      { url: "https://www.aspinaloflondon.com/products/passport-cover-navy-saffiano", alt: "Globetrotter Passport Holder", isPrimary: true }
    ],
    stock: 70,
    sku: "ACC-PAS-002",
    material: "Saffiano Leather",
    color: "Midnight Blue",
    features: ["Dedicated passport sleeve", "Two card slots", "Boarding pass flap", "Slim and protective"],
    rating: { average: 4.8, count: 132 }
  },
  {
    name: "Heritage Leather Key Fob",
    description: "A simple, durable, and stylish way to organize your keys. Made from the same premium leather as our bags and wallets, featuring a robust metal clasp.",
    price: 29.99,
    category: "accessories",
    subcategory: "key-fob",
    images: [
      { url: "https://www.mrlentz.com/shopping/product/leather-keychain-fob/", alt: "Heritage Leather Key Fob", isPrimary: true }
    ],
    stock: 150,
    sku: "ACC-KEY-003",
    material: "Full-Grain Leather",
    color: "Black",
    features: ["Solid metal hardware", "Stamped logo", "Durable loop design", "Easy to find in a bag"],
    rating: { average: 4.7, count: 240 }
  },
  {
    name: "Gentleman's Valet Tray",
    description: "The perfect catch-all for your entryway table or nightstand. This leather valet tray is an elegant way to store your keys, wallet, watch, and coins.",
    price: 64.99,
    category: "accessories",
    subcategory: "valet-tray",
    images: [
      { url: "https://royce.us/product/luxury-suede-lined-catchall-valet-tray-2/", alt: "Gentleman's Valet Tray", isPrimary: true }
    ],
    stock: 45,
    sku: "ACC-VLT-004",
    material: "Suede-lined Leather",
    color: "Chestnut Brown",
    features: ["Snap corners for flat packing", "Soft suede lining", "Embossed center logo", "Keeps essentials organized"],
    rating: { average: 4.9, count: 99 }
  },
  {
    name: "Leather Eyeglass Case",
    description: "Protect your eyewear with this structured leather case. A soft suede interior prevents scratches, while the firm exterior guards against impacts.",
    price: 54.99,
    category: "accessories",
    subcategory: "eyeglass-case",
    images: [
      { url: "https://www.villageleathers.com/products/missouri-green-leather-glasses-case", alt: "Leather Eyeglass Case", isPrimary: true }
    ],
    stock: 55,
    sku: "ACC-EGC-005",
    material: "Vegetable-Tanned Leather",
    color: "Forest Green",
    features: ["Structured hard-shell design", "Soft suede lining", "Magnetic closure", "Fits most standard glasses and sunglasses"],
    rating: { average: 4.8, count: 81 }
  },
  // Jackets (2)
  {
    name: "Aviator Bomber Jacket",
    description: "A timeless icon of style, the Aviator Bomber is crafted from supple sheepskin leather and features a classic shearling collar for warmth and comfort.",
    price: 699.99,
    category: "jackets",
    subcategory: "bomber",
    images: [
      { url: "https://www.burgundschild.com/en/products/b-3-elc-flight-jacket-seal-brown", alt: "Aviator Bomber Jacket", isPrimary: true }
    ],
    stock: 20,
    sku: "JCK-BOM-001",
    material: "Sheepskin Leather",
    color: "Seal Brown",
    size: "S, M, L, XL, XXL",
    features: ["Genuine shearling collar", "Ribbed knit cuffs and hem", "Two front flap pockets", "Quilted interior lining"],
    isFeatured: true,
    rating: { average: 4.9, count: 42 }
  },
  {
    name: "Rebel Moto Jacket",
    description: "Embrace a rebellious spirit with this quintessential moto jacket. Made from rugged cowhide, it features an asymmetrical zipper, wide lapels, and durable silver hardware.",
    price: 649.99,
    category: "jackets",
    subcategory: "moto",
    images: [
      { url: "https://www.understatedleather.com/products/rebel-yell-moto-jacket", alt: "Rebel Moto Jacket", isPrimary: true }
    ],
    stock: 25,
    sku: "JCK-MOT-002",
    material: "Cowhide Leather",
    color: "Black",
    size: "S, M, L, XL, XXL",
    features: ["Asymmetrical front zip", "Zippered cuffs", "Multiple zip pockets", "Belted waist", "Epaulets on shoulders"],
    rating: { average: 4.8, count: 68 }
  }
];

// --- Expanded Premium Leather Products Data (6 Products) ---
const premiumProducts = [
  {
    name: "Handcrafted Vachetta Satchel",
    description: "Artisan-crafted satchel made from the finest Florence-sourced vachetta leather. Each piece is a unique work of art, designed to develop a distinctive patina that tells your story over time.",
    price: 599.99,
    category: "premium-bags",
    leatherType: "vachetta",
    craftmanship: { artisan: "Marco Rossi", technique: "Traditional Italian Hand-stitching", timeToMake: "48 hours", origin: "Florence, Italy" },
    customization: { available: true, options: ["Monogram embossing", "Custom color patina", "Hardware selection"] },
    images: [
      { url: "https://www.zellihandbags.com/products/classic-handbag-in-three-tone-vachetta-leather", alt: "Handcrafted Vachetta Satchel", isPrimary: true }
    ],
    stock: 8,
    sku: "PREM-BAG-001"
  },
  {
    name: "Master Craftsman Wallet",
    description: "An exceptional wallet created by master artisans using centuries-old techniques. Features hand-selected, full-grain Tuscan leather and meticulous hand-saddle stitching for unparalleled durability.",
    price: 189.99,
    category: "luxury-wallets",
    leatherType: "full-grain",
    craftmanship: { artisan: "Elena Bianchi", technique: "Hand-saddle stitching", timeToMake: "12 hours", origin: "Tuscany, Italy" },
    customization: { available: true, options: ["Personal monogram", "Interior layout", "Thread color", "Edge paint"] },
    images: [
      { url: "https://www.axesswallets.com/products/coolwallet", alt: "Master Craftsman Wallet", isPrimary: true }
    ],
    stock: 15,
    sku: "PREM-WAL-002"
  },
  {
    name: "Bespoke Leather Belt",
    description: "A custom-made belt crafted to your exact specifications. Choose from premium French calfskin selections and solid bronze hardware options for a truly personalized and lifelong accessory.",
    price: 249.99,
    category: "custom-belts",
    leatherType: "top-grain",
    craftmanship: { artisan: "Giovanni Forte", technique: "Traditional edge burnishing", timeToMake: "8 hours", origin: "Milan, Italy" },
    customization: { available: true, options: ["Exact length", "Buckle selection", "Leather type", "Color choice", "Edge finishing"] },
    images: [
      { url: "https://shoptoxyfree.com/products/timeless-handcrafted-leather-belt-with-solid-bronze-buckle-crafted-from-vegetable-tanned-chemical-free-leather", alt: "Bespoke Leather Belt", isPrimary: true }
    ],
    stock: 20,
    sku: "PREM-BLT-003"
  },
  {
    name: "Artisan Hand-Tooled Journal",
    description: "A true masterpiece for the discerning writer. This journal cover is hand-tooled with intricate patterns by a master artisan, making each one a unique collector's item.",
    price: 299.99,
    category: "artisan-accessories",
    leatherType: "full-grain",
    craftmanship: { artisan: "Sofia Moretti", technique: "Traditional Sheridan-style tooling", timeToMake: "35 hours", origin: "Rome, Italy" },
    customization: { available: true, options: ["Custom tooled pattern", "Initials integration", "Choice of leather"] },
    images: [
      { url: "https://theleatherguy.org/blogs/how-to/how-to-make-a-simple-leather-journal", alt: "Artisan Hand-Tooled Journal", isPrimary: true }
    ],
    stock: 7,
    sku: "PREM-ACC-004"
  },
  {
    name: "Heritage Duffle Bag",
    description: "The pinnacle of travel bags, the Heritage Duffle is built by a single artisan from a single hide of premium Horween leather. It's a statement piece designed to be passed down through generations.",
    price: 950.00,
    category: "premium-bags",
    leatherType: "full-grain",
    craftmanship: { artisan: "Luca Gallo", technique: "Single-hide construction", timeToMake: "60 hours", origin: "Chicago, USA" },
    customization: { available: true, options: ["Brass nameplate engraving", "Custom interior lining", "Hardware material (Brass/Nickel)"] },
    images: [
      { url: "https://coronadoleather.com/products/cxl-duffel-205-8", alt: "Heritage Duffle Bag", isPrimary: true }
    ],
    stock: 5,
    sku: "PREM-BAG-005"
  }
];

async function seedProducts() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;

    if (!MONGODB_URI) {
      console.error('❌ MONGODB_URI not found in environment variables');
      process.exit(1);
    }

    console.log('🔌 Connecting to vachetta-db...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to database');

    // Clear existing products
    console.log('🧹 Clearing existing products...');
    await Product.deleteMany({});
    await LeatherProduct.deleteMany({});
    console.log('✅ Existing products cleared');

    // Insert sample products
    console.log('📦 Inserting standard products...');
    const insertedProducts = await Product.insertMany(sampleProducts);
    console.log(`✅ Inserted ${insertedProducts.length} standard products`);

    // Insert premium products
    console.log('👑 Inserting premium leather products...');
    const insertedPremiumProducts = await LeatherProduct.insertMany(premiumProducts);
    console.log(`✅ Inserted ${insertedPremiumProducts.length} premium products`);

    console.log('\n🎉 Product seeding completed successfully!');
    console.log('\n📊 Database Summary:');
    console.log(`   📦 Standard Products: ${insertedProducts.length}`);
    console.log(`   👑 Premium Products: ${insertedPremiumProducts.length}`);
    console.log(`   ✨ Total Products: ${insertedProducts.length + insertedPremiumProducts.length}`);
    console.log(`   💾 Database: vachetta-db`);
    console.log(`   🏪 Categories: bags, wallets, belts, jackets, accessories`);

    console.log('\n🛍️  Featured Products:');
    const featuredProducts = insertedProducts.filter(p => p.isFeatured);
    featuredProducts.forEach(product => {
      console.log(`   • ${product.name} - $${product.price}`);
    });

  } catch (error) {
    console.error('❌ Error seeding products:', error);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
    process.exit(0);
  }
}

// Run the seeding function
seedProducts();