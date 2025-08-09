/**
 * Vachetta Products Seeding Script
 * Creates product collections and sample leather goods
 * 
 * Usage: node scripts/seed-products.js
 */

const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

// Product Schema
const ProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  originalPrice: {
    type: Number,
  },
  category: {
    type: String,
    required: true,
    enum: ['bags', 'wallets', 'belts', 'accessories', 'jackets']
  },
  subcategory: {
    type: String,
  },
  images: [{
    url: String,
    alt: String,
    isPrimary: {
      type: Boolean,
      default: false
    }
  }],
  stock: {
    type: Number,
    default: 0,
  },
  sku: {
    type: String,
    unique: true,
  },
  material: {
    type: String,
    default: 'Premium Leather'
  },
  color: {
    type: String,
  },
  size: {
    type: String,
  },
  weight: {
    type: String,
  },
  dimensions: {
    length: String,
    width: String,
    height: String
  },
  features: [String],
  care: [String],
  isActive: {
    type: Boolean,
    default: true,
  },
  isFeatured: {
    type: Boolean,
    default: false,
  },
  rating: {
    average: {
      type: Number,
      default: 0,
    },
    count: {
      type: Number,
      default: 0,
    }
  },
  tags: [String],
  seo: {
    title: String,
    description: String,
    keywords: [String]
  }
}, {
  timestamps: true,
});

// Leather Product Schema (Premium Collection)
const LeatherProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['premium-bags', 'luxury-wallets', 'custom-belts', 'artisan-accessories']
  },
  leatherType: {
    type: String,
    enum: ['full-grain', 'top-grain', 'vachetta', 'patent', 'suede'],
    default: 'vachetta'
  },
  craftmanship: {
    artisan: String,
    technique: String,
    timeToMake: String,
    origin: String
  },
  customization: {
    available: {
      type: Boolean,
      default: true
    },
    options: [String]
  },
  images: [{
    url: String,
    alt: String,
    isPrimary: Boolean
  }],
  stock: {
    type: Number,
    default: 5,
  },
  sku: {
    type: String,
    unique: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  }
}, {
  timestamps: true,
});

const Product = mongoose.model('Product', ProductSchema);
const LeatherProduct = mongoose.model('LeatherProduct', LeatherProductSchema);

// Sample Products Data
const sampleProducts = [
  {
    name: "Classic Vachetta Tote Bag",
    description: "Handcrafted from premium vachetta leather, this timeless tote bag develops a beautiful patina over time. Perfect for daily use with its spacious interior and elegant design.",
    price: 289.99,
    originalPrice: 349.99,
    category: "bags",
    subcategory: "tote",
    images: [
      {
        url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=600&fit=crop",
        alt: "Classic Vachetta Tote Bag - Front View",
        isPrimary: true
      },
      {
        url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&h=600&fit=crop",
        alt: "Classic Vachetta Tote Bag - Interior View",
        isPrimary: false
      }
    ],
    stock: 25,
    sku: "VTB-001",
    material: "Premium Vachetta Leather",
    color: "Natural Tan",
    dimensions: {
      length: "16 inches",
      width: "12 inches",
      height: "6 inches"
    },
    features: [
      "Genuine vachetta leather",
      "Cotton canvas lining",
      "Interior zip pocket",
      "Magnetic snap closure",
      "Develops beautiful patina"
    ],
    care: [
      "Clean with soft, dry cloth",
      "Apply leather conditioner monthly",
      "Avoid prolonged exposure to water",
      "Store in dust bag when not in use"
    ],
    isFeatured: true,
    rating: {
      average: 4.8,
      count: 127
    },
    tags: ["vachetta", "tote", "handmade", "premium", "leather"],
    seo: {
      title: "Classic Vachetta Tote Bag - Handcrafted Leather | Vachetta",
      description: "Premium handcrafted vachetta leather tote bag. Develops beautiful patina over time. Free shipping on orders over $200.",
      keywords: ["vachetta leather", "tote bag", "handcrafted", "premium leather goods"]
    }
  },
  {
    name: "Artisan Leather Wallet",
    description: "Meticulously crafted bi-fold wallet featuring premium leather construction. Multiple card slots and bill compartments provide optimal organization for the modern professional.",
    price: 89.99,
    originalPrice: 119.99,
    category: "wallets",
    subcategory: "bi-fold",
    images: [
      {
        url: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&h=600&fit=crop",
        alt: "Artisan Leather Wallet - Closed",
        isPrimary: true
      },
      {
        url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=600&fit=crop",
        alt: "Artisan Leather Wallet - Open View",
        isPrimary: false
      }
    ],
    stock: 45,
    sku: "ALW-002",
    material: "Full-Grain Leather",
    color: "Rich Brown",
    dimensions: {
      length: "4.5 inches",
      width: "3.5 inches",
      height: "0.5 inches"
    },
    features: [
      "8 card slots",
      "2 bill compartments",
      "ID window",
      "RFID blocking",
      "Hand-stitched edges"
    ],
    care: [
      "Wipe with damp cloth",
      "Apply leather cream quarterly",
      "Keep away from extreme heat"
    ],
    isFeatured: true,
    rating: {
      average: 4.7,
      count: 89
    },
    tags: ["wallet", "leather", "artisan", "rfid", "brown"],
    seo: {
      title: "Artisan Leather Wallet - RFID Blocking | Vachetta",
      description: "Premium full-grain leather wallet with RFID protection. Hand-stitched construction for lasting durability.",
      keywords: ["leather wallet", "rfid blocking", "artisan", "full grain leather"]
    }
  },
  {
    name: "Vintage Messenger Bag",
    description: "Inspired by classic messenger designs, this vintage-style bag combines functionality with timeless appeal. Perfect for work, travel, or everyday adventures.",
    price: 199.99,
    category: "bags",
    subcategory: "messenger",
    images: [
      {
        url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=600&fit=crop",
        alt: "Vintage Messenger Bag - Side View",
        isPrimary: true
      },
      {
        url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&h=600&fit=crop",
        alt: "Vintage Messenger Bag - Open",
        isPrimary: false
      }
    ],
    stock: 18,
    sku: "VMB-003",
    material: "Distressed Leather",
    color: "Vintage Brown",
    dimensions: {
      length: "15 inches",
      width: "11 inches",
      height: "4 inches"
    },
    features: [
      "Adjustable shoulder strap",
      "Multiple interior pockets",
      "Laptop compartment (fits 13-inch)",
      "Antique brass hardware",
      "Weathered finish"
    ],
    care: [
      "Brush off dirt with soft brush",
      "Condition every 3 months",
      "Protect from excessive moisture"
    ],
    isFeatured: false,
    rating: {
      average: 4.6,
      count: 64
    },
    tags: ["messenger", "vintage", "laptop", "distressed", "brown"],
    seo: {
      title: "Vintage Messenger Bag - Distressed Leather | Vachetta",
      description: "Classic messenger bag in distressed leather. Perfect for work and travel with laptop compartment.",
      keywords: ["messenger bag", "vintage leather", "laptop bag", "distressed leather"]
    }
  },
  {
    name: "Premium Leather Belt",
    description: "Handcrafted full-grain leather belt with solid brass buckle. A wardrobe essential that pairs perfectly with both casual and formal attire.",
    price: 69.99,
    category: "belts",
    subcategory: "dress",
    images: [
      {
        url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=600&fit=crop",
        alt: "Premium Leather Belt - Full Length",
        isPrimary: true
      }
    ],
    stock: 35,
    sku: "PLB-004",
    material: "Full-Grain Leather",
    color: "Black",
    size: "Available in 32-42 inches",
    features: [
      "Solid brass buckle",
      "Full-grain leather construction",
      "Hand-finished edges",
      "Available in multiple sizes",
      "Reversible design"
    ],
    care: [
      "Clean with leather cleaner",
      "Condition monthly",
      "Store flat or hanging"
    ],
    isFeatured: false,
    rating: {
      average: 4.5,
      count: 52
    },
    tags: ["belt", "leather", "brass", "dress", "formal"],
    seo: {
      title: "Premium Leather Belt - Full-Grain Construction | Vachetta",
      description: "Handcrafted full-grain leather belt with brass buckle. Perfect for dress and casual wear.",
      keywords: ["leather belt", "full grain", "brass buckle", "handcrafted"]
    }
  },
  {
    name: "Leather Card Holder",
    description: "Minimalist card holder designed for the essentials. Slim profile fits comfortably in any pocket while keeping your cards secure and organized.",
    price: 39.99,
    category: "wallets",
    subcategory: "card-holder",
    images: [
      {
        url: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&h=600&fit=crop",
        alt: "Leather Card Holder - Front",
        isPrimary: true
      }
    ],
    stock: 60,
    sku: "LCH-005",
    material: "Italian Leather",
    color: "Cognac",
    dimensions: {
      length: "4 inches",
      width: "2.75 inches",
      height: "0.25 inches"
    },
    features: [
      "Holds 4-6 cards",
      "Ultra-slim design",
      "Italian leather",
      "Hand-stitched",
      "RFID protection available"
    ],
    care: [
      "Wipe gently with soft cloth",
      "Avoid overstuffing",
      "Keep away from sharp objects"
    ],
    isFeatured: false,
    rating: {
      average: 4.4,
      count: 73
    },
    tags: ["card holder", "minimalist", "italian leather", "slim", "cognac"],
    seo: {
      title: "Minimalist Leather Card Holder - Italian Leather | Vachetta",
      description: "Ultra-slim leather card holder crafted from premium Italian leather. Perfect for minimalist carry.",
      keywords: ["card holder", "minimalist wallet", "italian leather", "slim wallet"]
    }
  },
  {
    name: "Executive Briefcase",
    description: "Professional briefcase crafted from premium leather. Features multiple compartments and laptop protection for the modern executive.",
    price: 449.99,
    category: "bags",
    subcategory: "briefcase",
    images: [
      {
        url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=600&fit=crop",
        alt: "Executive Briefcase - Professional View",
        isPrimary: true
      },
      {
        url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&h=600&fit=crop",
        alt: "Executive Briefcase - Interior",
        isPrimary: false
      }
    ],
    stock: 12,
    sku: "EBC-006",
    material: "Premium Leather",
    color: "Deep Black",
    dimensions: {
      length: "17 inches",
      width: "12 inches",
      height: "5 inches"
    },
    features: [
      "Laptop compartment (fits 15-inch)",
      "Multiple file organizers",
      "Combination lock",
      "Removable shoulder strap",
      "Premium hardware"
    ],
    care: [
      "Clean with leather cleaner",
      "Condition every 2 months",
      "Store in dust bag",
      "Keep clasps lubricated"
    ],
    isFeatured: true,
    rating: {
      average: 4.9,
      count: 31
    },
    tags: ["briefcase", "executive", "laptop", "professional", "premium"],
    seo: {
      title: "Executive Leather Briefcase - Premium Business Bag | Vachetta",
      description: "Professional leather briefcase with laptop compartment. Perfect for executives and business professionals.",
      keywords: ["leather briefcase", "executive bag", "laptop briefcase", "business bag"]
    }
  }
];

// Premium Leather Products Data
const premiumProducts = [
  {
    name: "Handcrafted Vachetta Satchel",
    description: "Artisan-crafted satchel made from the finest vachetta leather. Each piece is unique and develops a distinctive patina that tells your story over time.",
    price: 599.99,
    category: "premium-bags",
    leatherType: "vachetta",
    craftmanship: {
      artisan: "Marco Rossi",
      technique: "Traditional Italian Hand-stitching",
      timeToMake: "48 hours",
      origin: "Florence, Italy"
    },
    customization: {
      available: true,
      options: ["Monogram embossing", "Custom color", "Size adjustments", "Hardware selection"]
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=600&fit=crop",
        alt: "Handcrafted Vachetta Satchel - Artisan Quality",
        isPrimary: true
      },
      {
        url: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&h=600&fit=crop",
        alt: "Vachetta Satchel - Detail Shot",
        isPrimary: false
      }
    ],
    stock: 8,
    sku: "HVS-P001"
  },
  {
    name: "Master Craftsman Wallet",
    description: "Exceptional wallet created by master artisans using centuries-old techniques. Features hand-selected leather and meticulous attention to detail.",
    price: 189.99,
    category: "luxury-wallets",
    leatherType: "full-grain",
    craftmanship: {
      artisan: "Elena Bianchi",
      technique: "Hand-saddle stitching",
      timeToMake: "12 hours",
      origin: "Tuscany, Italy"
    },
    customization: {
      available: true,
      options: ["Personal monogram", "Interior layout", "Thread color", "Edge paint"]
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&h=600&fit=crop",
        alt: "Master Craftsman Wallet - Luxury Detail",
        isPrimary: true
      }
    ],
    stock: 15,
    sku: "MCW-P002"
  },
  {
    name: "Bespoke Leather Belt",
    description: "Custom-made belt crafted to your exact specifications. Choose from premium leather selections and hardware options for a truly personalized accessory.",
    price: 149.99,
    category: "custom-belts",
    leatherType: "top-grain",
    craftmanship: {
      artisan: "Giovanni Forte",
      technique: "Traditional edge finishing",
      timeToMake: "8 hours",
      origin: "Milan, Italy"
    },
    customization: {
      available: true,
      options: ["Length customization", "Buckle selection", "Leather type", "Color options", "Edge finishing"]
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&h=600&fit=crop",
        alt: "Bespoke Leather Belt - Custom Crafted",
        isPrimary: true
      }
    ],
    stock: 20,
    sku: "BLB-P003"
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
    console.log('📦 Inserting sample products...');
    const insertedProducts = await Product.insertMany(sampleProducts);
    console.log(`✅ Inserted ${insertedProducts.length} regular products`);

    // Insert premium products
    console.log('👑 Inserting premium leather products...');
    const insertedPremiumProducts = await LeatherProduct.insertMany(premiumProducts);
    console.log(`✅ Inserted ${insertedPremiumProducts.length} premium products`);

    console.log('\n🎉 Product seeding completed successfully!');
    console.log('\n📊 Database Summary:');
    console.log(`   📦 Regular Products: ${insertedProducts.length}`);
    console.log(`   👑 Premium Products: ${insertedPremiumProducts.length}`);
    console.log(`   💾 Database: vachetta-db`);
    console.log(`   🏪 Categories: bags, wallets, belts, accessories`);
    
    console.log('\n🛍️  Featured Products:');
    const featuredProducts = insertedProducts.filter(p => p.isFeatured);
    featuredProducts.forEach(product => {
      console.log(`   • ${product.name} - $${product.price}`);
    });

  } catch (error) {
    console.error('❌ Error seeding products:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
}

// Run the seeding function
seedProducts();
