# Cart Functionality Guide

## How the Cart System Works

The cart system in this e-commerce application uses the following components:

### Server Actions (`src/app/(carts)/cart/action.ts`)
- `addItem()` - Adds products to the cart
- `getItems()` - Retrieves cart items for display
- `getTotalItems()` - Gets total item count for navbar
- `delItem()` - Removes entire item from cart
- `delOneItem()` - Decreases quantity by 1
- `emptyCart()` - Clears all items from cart

### Storage
- Uses KV store (Vercel KV in production, mock KV in development)
- Cart data is stored per user ID
- Data persists across sessions

### Components
- `AddToCart` - Full add to cart form with size/color selection
- `QuickAddToCart` - Simple one-click add to cart button
- `ProductCartInfo` - Quantity controls in cart view
- `DeleteButton` - Remove item from cart
- Cart page displays all items with total price

### Cart Display
1. **Navbar**: Shows cart count badge
2. **Cart Page**: Shows all items with quantities, prices, and total
3. **Product Pages**: Add to cart functionality

## Testing Cart Functionality

### Manual Testing
1. Log in to the application
2. Navigate to any product page
3. Select size and color (if required)
4. Click "Add to Cart"
5. Check navbar for updated cart count
6. Go to `/cart` to see items
7. Test quantity changes and item removal

### Debug Testing
- Visit `/test-cart` page for debugging tools
- Use `/api/debug-cart` API endpoint to inspect cart data
- Use `/api/test-cart` to create test cart items

## Common Issues and Solutions

### Cart Count Not Updating
- The system now uses `router.refresh()` to update server components
- Cart operations trigger page refresh automatically

### Items Not Appearing in Cart
1. Ensure user is logged in
2. Check browser console for errors
3. Verify KV store is working (check debug endpoints)
4. Check product has valid variants and pricing

### Cart Persistence
- Cart items are stored in KV store by user ID
- Items persist across browser sessions
- Cart is only visible to logged-in users

## Key Features

✅ Add items to cart from product pages  
✅ Update quantities in cart  
✅ Remove items from cart  
✅ Persistent cart storage  
✅ Real-time cart count in navbar  
✅ Cart page with total calculation  
✅ Works with product variants and sizes  
✅ User authentication integration  

The cart system is now fully functional and will properly display items when users add products to their cart.
