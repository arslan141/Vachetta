require('dotenv').config({ path: '.env.local' });
const mongoose = require('mongoose');

async function updateProductImages() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to database');

    const updates = [
      {
        name: 'Artisan Leather Wallet',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&h=600&fit=crop',
            alt: 'Artisan Leather Wallet - Closed',
            isPrimary: true
          }
        ]
      },
      {
        name: 'Vintage Messenger Bag',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1581605405669-fcdf81165afa?w=800&h=600&fit=crop',
            alt: 'Vintage Messenger Bag - Side View',
            isPrimary: true
          }
        ]
      },
      {
        name: 'Premium Leather Belt',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=800&h=600&fit=crop',
            alt: 'Premium Leather Belt - Full Length',
            isPrimary: true
          }
        ]
      },
      {
        name: 'Leather Card Holder',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1581518404286-ce299b5a7dc6?w=800&h=600&fit=crop',
            alt: 'Leather Card Holder - Front',
            isPrimary: true
          }
        ]
      },
      {
        name: 'Executive Briefcase',
        images: [
          {
            url: 'https://images.unsplash.com/photo-1584464491033-06628f3a6b7b?w=800&h=600&fit=crop',
            alt: 'Executive Briefcase - Professional View',
            isPrimary: true
          }
        ]
      }
    ];

    for (const update of updates) {
      await mongoose.connection.db.collection('products').updateOne(
        { name: update.name },
        { $set: { images: update.images } }
      );
      console.log(`✅ Updated images for ${update.name}`);
    }

    console.log('🎉 All product images updated successfully!');
    
  } catch (error) {
    console.error('❌ Error updating images:', error);
  } finally {
    await mongoose.connection.close();
    process.exit(0);
  }
}

updateProductImages();
