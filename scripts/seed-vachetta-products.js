require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

// Product Schema (simplified version for seeding)
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: { type: String, required: true },
  image: [String],
  variants: [{
    color: String,
    size: String,
    price: Number,
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true }
  }],
  isActive: { type: Boolean, default: true },
  stock: { type: Number, default: 10 },
  createdAt: { type: Date, default: Date.now }
});

const Product = mongoose.model('Product', productSchema);

const vachettaProducts = [
  {
    name: "Artisanal Leather Briefcase",
    description: "A sophisticated handcrafted briefcase made from premium Italian leather. Perfect for professionals who appreciate timeless elegance and superior craftsmanship.",
    price: 450,
    category: "bags",
    image: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?ixlib=rb-4.0.3&w=500&h=500&fit=crop"
    ],
    variants: [
      { color: "Brown", size: "Standard", price: 450 },
      { color: "Black", size: "Standard", price: 475 }
    ],
    stock: 15
  },
  {
    name: "Classic Leather Wallet",
    description: "Handcrafted from premium full-grain leather, this wallet features multiple card slots and a timeless design that ages beautifully.",
    price: 89,
    category: "wallets",
    image: [
      "https://images.unsplash.com/photo-1627123424574-724758594e93?ixlib=rb-4.0.3&w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&w=500&h=500&fit=crop"
    ],
    variants: [
      { color: "Brown", size: "Bifold", price: 89 },
      { color: "Black", size: "Bifold", price: 89 },
      { color: "Tan", size: "Bifold", price: 95 }
    ],
    stock: 25
  },
  {
    name: "Premium Leather Handbag",
    description: "Elegant and spacious handbag crafted from the finest Italian leather. Features multiple compartments and a removable shoulder strap.",
    price: 320,
    category: "bags",
    image: [
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&w=500&h=500&fit=crop"
    ],
    variants: [
      { color: "Brown", size: "Medium", price: 320 },
      { color: "Black", size: "Medium", price: 320 },
      { color: "Burgundy", size: "Medium", price: 340 }
    ],
    stock: 12
  },
  {
    name: "Handcrafted Leather Belt",
    description: "Premium full-grain leather belt with solid brass buckle. Hand-stitched edges and available in multiple sizes.",
    price: 125,
    category: "belts",
    image: [
      "https://images.unsplash.com/photo-1624222247344-550fb60583dc?ixlib=rb-4.0.3&w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?ixlib=rb-4.0.3&w=500&h=500&fit=crop"
    ],
    variants: [
      { color: "Brown", size: "32", price: 125 },
      { color: "Brown", size: "34", price: 125 },
      { color: "Brown", size: "36", price: 125 },
      { color: "Black", size: "32", price: 125 },
      { color: "Black", size: "34", price: 125 },
      { color: "Black", size: "36", price: 125 }
    ],
    stock: 30
  },
  {
    name: "Luxury Leather Backpack",
    description: "Sophisticated leather backpack perfect for work or travel. Features laptop compartment and premium hardware.",
    price: 380,
    category: "bags",
    image: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1581605405669-fcdf81165afa?ixlib=rb-4.0.3&w=500&h=500&fit=crop"
    ],
    variants: [
      { color: "Brown", size: "Standard", price: 380 },
      { color: "Black", size: "Standard", price: 380 }
    ],
    stock: 8
  },
  {
    name: "Minimalist Card Holder",
    description: "Sleek and minimal card holder made from premium leather. Perfect for those who prefer to travel light.",
    price: 45,
    category: "wallets",
    image: [
      "https://images.unsplash.com/photo-1627123424574-724758594e93?ixlib=rb-4.0.3&w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1581518404286-ce299b5a7dc6?ixlib=rb-4.0.3&w=500&h=500&fit=crop"
    ],
    variants: [
      { color: "Brown", size: "Slim", price: 45 },
      { color: "Black", size: "Slim", price: 45 },
      { color: "Navy", size: "Slim", price: 50 }
    ],
    stock: 40
  },
  {
    name: "Artisan Leather Tote",
    description: "Spacious tote bag handcrafted from vegetable-tanned leather. Perfect for everyday use with a timeless design.",
    price: 280,
    category: "bags",
    image: [
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&w=500&h=500&fit=crop"
    ],
    variants: [
      { color: "Tan", size: "Large", price: 280 },
      { color: "Brown", size: "Large", price: 280 }
    ],
    stock: 10
  },
  {
    name: "Executive Leather Portfolio",
    description: "Professional leather portfolio with document organizer and tablet sleeve. Perfect for business meetings.",
    price: 195,
    category: "accessories",
    image: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?ixlib=rb-4.0.3&w=500&h=500&fit=crop"
    ],
    variants: [
      { color: "Brown", size: "A4", price: 195 },
      { color: "Black", size: "A4", price: 195 }
    ],
    stock: 18
  },
  {
    name: "Vintage Leather Messenger Bag",
    description: "Classic messenger bag with vintage appeal. Features adjustable strap and multiple pockets for organization.",
    price: 245,
    category: "bags",
    image: [
      "https://images.unsplash.com/photo-1581605405669-fcdf81165afa?ixlib=rb-4.0.3&w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?ixlib=rb-4.0.3&w=500&h=500&fit=crop"
    ],
    variants: [
      { color: "Brown", size: "Medium", price: 245 },
      { color: "Tan", size: "Medium", price: 245 }
    ],
    stock: 14
  },
  {
    name: "Premium Leather Watch Strap",
    description: "Handcrafted leather watch strap with premium buckle. Available in multiple sizes and colors.",
    price: 65,
    category: "accessories",
    image: [
      "https://images.unsplash.com/photo-1624222247344-550fb60583dc?ixlib=rb-4.0.3&w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?ixlib=rb-4.0.3&w=500&h=500&fit=crop"
    ],
    variants: [
      { color: "Brown", size: "20mm", price: 65 },
      { color: "Brown", size: "22mm", price: 65 },
      { color: "Black", size: "20mm", price: 65 },
      { color: "Black", size: "22mm", price: 65 }
    ],
    stock: 35
  },
  {
    name: "Handmade Leather Crossbody",
    description: "Compact crossbody bag perfect for daily essentials. Features adjustable strap and secure closure.",
    price: 165,
    category: "bags",
    image: [
      "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?ixlib=rb-4.0.3&w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?ixlib=rb-4.0.3&w=500&h=500&fit=crop"
    ],
    variants: [
      { color: "Brown", size: "Small", price: 165 },
      { color: "Black", size: "Small", price: 165 },
      { color: "Cognac", size: "Small", price: 175 }
    ],
    stock: 22
  },
  {
    name: "Long Leather Wallet",
    description: "Spacious long wallet with multiple card slots and bill compartments. Crafted from premium full-grain leather.",
    price: 125,
    category: "wallets",
    image: [
      "https://images.unsplash.com/photo-1627123424574-724758594e93?ixlib=rb-4.0.3&w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1581518404286-ce299b5a7dc6?ixlib=rb-4.0.3&w=500&h=500&fit=crop"
    ],
    variants: [
      { color: "Brown", size: "Long", price: 125 },
      { color: "Black", size: "Long", price: 125 },
      { color: "Burgundy", size: "Long", price: 135 }
    ],
    stock: 20
  }
];

async function seedProducts() {
  try {
    const MONGODB_URI = process.env.MONGODB_URI;
    
    if (!MONGODB_URI) {
      console.error('❌ MONGODB_URI not found in environment variables');
      process.exit(1);
    }

    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to vachetta-ecom database');

    // Clear existing products
    console.log('🧹 Clearing existing products...');
    await Product.deleteMany({});
    console.log('✅ Existing products cleared');

    // Insert Vachetta products
    console.log('📦 Inserting Vachetta leather products...');
    const insertedProducts = await Product.insertMany(vachettaProducts);
    console.log(`✅ Inserted ${insertedProducts.length} products`);

    console.log('\n🎉 Product seeding completed successfully!');
    console.log('\n📊 Products by category:');
    const categories = await Product.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    categories.forEach(cat => {
      console.log(`   ${cat._id}: ${cat.count} products`);
    });

  } catch (error) {
    console.error('❌ Error seeding products:', error.message);
  } finally {
    console.log('🔌 Database connection closed');
    await mongoose.connection.close();
  }
}

seedProducts();
