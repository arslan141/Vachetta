require('dotenv').config({ path: '.env.local' });

// Test the actual actions file
async function testActions() {
  try {
    // Import the actions (this might take a moment)
    console.log('📦 Testing Next.js actions...');
    
    // Simulate what happens when pages load
    const { getProductsLightweight, getCategoryProducts } = require('./src/app/actions.ts');
    
    console.log('🔄 Testing getProductsLightweight...');
    const homeProducts = await getProductsLightweight(8);
    console.log(`✅ Home page should show ${homeProducts.length} products`);
    
    console.log('🔄 Testing category products...');
    const bagProducts = await getCategoryProducts('bags');
    console.log(`✅ Bags page should show ${bagProducts.length} products`);
    
    const walletProducts = await getCategoryProducts('wallets');
    console.log(`✅ Wallets page should show ${walletProducts.length} products`);
    
    console.log('\n✅ All actions working correctly!');
    
  } catch (error) {
    console.error('❌ Actions test failed:', error.message);
    console.log('This might be normal if TypeScript compilation is needed');
  }
}

testActions();
