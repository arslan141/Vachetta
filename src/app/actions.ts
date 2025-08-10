"use server";
import { connectDB } from "@/libs/mongodb";
import { Product } from "@/models/Products";
import LeatherProduct from "@/models/LeatherProduct";
import { EnrichedProducts, SerializedProduct } from "@/types/types";
import { cache } from 'react';
import { vachettaProducts } from "@/data/vachetta-products";

// Cache database connection
const getCachedConnection = cache(async () => {
  return await connectDB();
});

// Convert vachetta products to SerializedProduct format (lightweight client-friendly)
const convertVachettaToSerializedProducts = (products: typeof vachettaProducts): SerializedProduct[] => {
  return products.map(product => ({
    _id: product._id?.toString() || '',
    name: product.name || 'Leather Product',
    description: product.description || '',
    price: product.basePrice || 0,
    category: product.category || 'leather',
    image: [product.images?.[0]?.url || "/main-image.webp"] as [string],
    variants: [],
    // sizes intentionally omitted (no size data in vachetta seed objects)
    quantity: 0,
    purchased: false,
    productId: product._id?.toString() || ''
  }));
};

// Helper: convert SerializedProduct[] to EnrichedProducts[] by adding required legacy/cart fields
const serializedToEnriched = (items: SerializedProduct[]): EnrichedProducts[] => {
  return items.map((p): EnrichedProducts => ({
    name: p.name,
    category: p.category,
    image: (Array.isArray(p.image) ? [Array.isArray(p.image) && typeof p.image[0] === 'string' ? p.image[0] as string : '/main-image.webp'] : ['/main-image.webp']) as [string],
    price: p.price,
    purchased: Boolean(p.purchased),
    color: 'default',
    size: 'default',
    quantity: p.quantity ?? 1,
    productId: p._id as any,
    _id: p._id as any,
    variantId: 'default'
  }));
};


async function getProductsFromCollection(model: any, query: object, limit?: number): Promise<any[]> {
  const isConnected = await getCachedConnection();
  
  // If database is not connected, return vachetta products
  if (!isConnected) {
    console.log("Database not available, using Vachetta products");
    const filtered = query && (query as any).category 
      ? vachettaProducts.filter(p => p.category === (query as any).category)
      : vachettaProducts;
    const result = limit ? filtered.slice(0, limit) : filtered;
    // Convert to basic product format for compatibility
    return result.map(product => ({
      _id: product._id?.toString() || '',
      name: product.name || 'Leather Product',
      description: product.description || '',
      price: product.basePrice || 0,
      category: product.category || 'leather',
      image: product.images?.[0]?.url || "/main-image.webp",
      variants: []
    }));
  }

  try {
    // Use select to only fetch needed fields for better performance
    const queryBuilder = model.find(query, {
      name: 1,
      description: 1,
      price: 1,
      category: 1,
      image: 1,
      images: 1,
      variants: 1,
      _id: 1
    }).lean();
    
    if (limit) {
      queryBuilder.limit(limit);
    }
    
    const products = await queryBuilder;
    
    return products.map((product: any) => {
      // Normalize image data into both image (string[]) and images (object[]) forms
      let imagesObjects: { url: string }[] = [];
      if (Array.isArray(product.images) && product.images.length && product.images[0]?.url) {
        imagesObjects = product.images.map((o: any) => ({ url: o.url }));
      } else if (Array.isArray(product.image)) {
        imagesObjects = product.image.map((u: string) => ({ url: u }));
      } else if (typeof product.image === 'string') {
        imagesObjects = [{ url: product.image }];
      }
      const imageStrings = imagesObjects.map(o => o.url);
      const normalizedVariants = product.variants && product.variants.length > 0
        ? product.variants.map((variant: any) => ({
            ...variant,
            _id: variant._id ? variant._id.toString() : variant._id,
          }))
        : [];
      return {
        ...product,
        _id: product._id.toString(),
        image: imageStrings,
        images: imagesObjects,
        variants: normalizedVariants,
      };
    });
  } catch (error) {
    console.error("Database query failed:", error);
    console.log("Falling back to Vachetta products");
    const filtered = query && (query as any).category 
      ? vachettaProducts.filter(p => p.category === (query as any).category)
      : vachettaProducts;
    const result = limit ? filtered.slice(0, limit) : filtered;
    return result.map(product => ({
      _id: product._id?.toString() || '',
      name: product.name || 'Leather Product',
      description: product.description || '',
      price: product.basePrice || 0,
      category: product.category || 'leather',
      image: product.images?.[0]?.url || "/main-image.webp",
      variants: [
        {
          priceId: `${product._id?.toString() || 'fallback'}-default`,
          color: 'Natural',
          images: [product.images?.[0]?.url || "/main-image.webp"]
        }
      ]
    }));
  }
}

// Cached functions for better performance
export const getAllProducts = cache(async () => {
  const [products, leatherProducts] = await Promise.all([
    getProductsFromCollection(Product, {}),
    getProductsFromCollection(LeatherProduct, {})
  ]);
  return [...products, ...leatherProducts];
});

export const getCategoryProducts = cache(async (category: string) => {
  const [products, leatherProducts] = await Promise.all([
    getProductsFromCollection(Product, { category }),
    getProductsFromCollection(LeatherProduct, { category })
  ]);
  return [...products, ...leatherProducts];
});

export const getProduct = cache(async (id: string) => {
  const isConnected = await getCachedConnection();
  
  // If database is not connected, return vachetta product if ID matches
  if (!isConnected) {
    console.log("Database not available, checking Vachetta products for ID:", id);
    const vachettaProduct = vachettaProducts.find(p => p._id?.toString() === id);
    if (vachettaProduct) {
      return {
        _id: vachettaProduct._id?.toString() || '',
        name: vachettaProduct.name || 'Leather Product',
        description: vachettaProduct.description || '',
        price: vachettaProduct.basePrice || 0,
        category: vachettaProduct.category || 'leather',
        image: vachettaProduct.images?.[0]?.url || "/main-image.webp",
        variants: []
      };
    }
    return null;
  }

  try {
  let product: any = await Product.findById(id).lean();
    if (!product) {
      product = await LeatherProduct.findById(id).lean();
    }
    if (!product) {
      return null;
    }
    // Normalize images (both forms)
    let imagesObjects: { url: string }[] = [];
    if (Array.isArray(product.images) && product.images.length && product.images[0]?.url) {
      imagesObjects = product.images.map((o: any) => ({ url: o.url }));
    } else if (Array.isArray(product.image)) {
      imagesObjects = product.image.map((u: string) => ({ url: u }));
    } else if (typeof product.image === 'string') {
      imagesObjects = [{ url: product.image }];
    }
    const imageStrings = imagesObjects.map(o => o.url);
    const normalizedVariants = product.variants && product.variants.length > 0
      ? product.variants.map((variant: any) => ({
          ...variant,
          _id: variant._id ? variant._id.toString() : variant._id,
        }))
      : [];
    return {
      ...product,
      _id: product._id.toString(),
      image: imageStrings,
      images: imagesObjects,
      variants: normalizedVariants,
    };
  } catch (error) {
    console.error("Database query failed:", error);
    console.log("Falling back to vachetta products for ID:", id);
    const vachetta = vachettaProducts.find(p => p._id?.toString() === id);
    if (vachetta) {
      return {
        _id: vachetta._id?.toString() || '',
        name: vachetta.name || 'Leather Product',
        description: vachetta.description || '',
        price: vachetta.basePrice || 0,
        category: vachetta.category || 'leather',
        image: vachetta.images?.[0]?.url || "/main-image.webp",
        variants: []
      };
    }
    return null;
  }
});

// New function for lightweight product listings
export const getProductsLightweight = cache(async (limit = 20): Promise<SerializedProduct[]> => {
  const [products, leatherProducts] = await Promise.all([
    getProductsFromCollection(Product, {}, limit),
    getProductsFromCollection(LeatherProduct, {}, limit)
  ]);
  const allProducts = [...products, ...leatherProducts].slice(0, limit);
  
  // Ensure all fields are properly serialized for client components
  return allProducts.map(product => ({
    _id: product._id.toString(),
    name: product.name,
    description: product.description || '',
    price: product.price,
    category: product.category,
    image: [Array.isArray(product.image) ? (product.image[0] || "/main-image.webp") : (product.image || "/main-image.webp")] as [string],
    variants: product.variants || [],
    sizes: product.sizes || [],
    quantity: product.quantity || 0,
    purchased: product.purchased || false,
    productId: product._id.toString() // For cart compatibility
  }));
});

// Get random products excluding the current product ID
export const getRandomProducts = cache(async (excludeId: string, limit = 6): Promise<EnrichedProducts[]> => {
  const isConnected = await getCachedConnection();
  
  // If database is not connected, return vachetta products excluding the specified ID
  if (!isConnected) {
    console.log("Database not available, using Vachetta products for random selection");
  const converted = convertVachettaToSerializedProducts(vachettaProducts);
  const filtered = converted.filter((p) => p._id.toString() !== excludeId);
  return serializedToEnriched(filtered).slice(0, limit);
  }

  try {
    // Convert string ID to ObjectId for MongoDB query
    const { ObjectId } = require('mongodb');
    let excludeObjectId;
    try {
      excludeObjectId = new ObjectId(excludeId);
    } catch (error) {
      console.error('Invalid ObjectId:', excludeId);
      excludeObjectId = null;
    }
    
    // Get random products from both collections
    const [products, leatherProducts] = await Promise.all([
      Product.aggregate([
        { $match: excludeObjectId ? { _id: { $ne: excludeObjectId } } : {} },
        { $sample: { size: Math.ceil(limit / 2) } },
        { $project: {
          name: 1,
          description: 1,
          price: 1,
          category: 1,
          image: 1,
          images: 1,
          variants: 1,
          _id: 1
        }}
      ]),
      LeatherProduct.aggregate([
        { $match: excludeObjectId ? { _id: { $ne: excludeObjectId } } : {} },
        { $sample: { size: Math.ceil(limit / 2) } },
        { $project: {
          name: 1,
          description: 1,
          price: 1,
          category: 1,
          image: 1,
          images: 1,
          variants: 1,
          _id: 1
        }}
      ])
    ]);

    const allProducts = [...products, ...leatherProducts]
      .slice(0, limit)
      .map((product: any) => {
        // Handle image extraction - prioritize images array, then image array, then fallback
        let imageUrl = '/main-image.webp'; // default fallback
        
        if (product.images && Array.isArray(product.images) && product.images.length > 0) {
          // Find primary image first, or use first image
          const primaryImage = product.images.find((img: any) => img.isPrimary);
          imageUrl = primaryImage ? primaryImage.url : product.images[0].url;
        } else if (product.image && Array.isArray(product.image) && product.image.length > 0) {
          imageUrl = product.image[0];
        } else if (typeof product.image === 'string') {
          imageUrl = product.image;
        }

        return {
          ...product,
          _id: product._id.toString(),
          productId: product._id.toString(), // Add productId for EnrichedProducts compatibility
          variantId: 'default', // Add default variantId
          purchased: false, // Add default purchased status
          color: 'default', // Add default color
          size: 'default', // Add default size  
          quantity: 1, // Add default quantity
          image: [imageUrl], // Ensure tuple format with extracted image
          variants: product.variants ? product.variants.map((variant: any) => ({
            ...variant,
            _id: variant._id ? variant._id.toString() : variant._id,
          })) : [],
        };
      });

    return allProducts;
  } catch (error) {
    console.error("Database query failed:", error);
  console.log("Falling back to vachetta products for random selection");
  const converted = convertVachettaToSerializedProducts(vachettaProducts);
  const filtered = converted.filter((p) => p._id.toString() !== excludeId);
  return serializedToEnriched(filtered).slice(0, limit);
  }
});
