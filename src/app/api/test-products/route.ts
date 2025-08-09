import { NextRequest, NextResponse } from 'next/server';
import { getAllProducts } from '@/app/actions';

export async function GET(request: NextRequest) {
  try {
    const products = await getAllProducts();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Products loaded successfully',
      count: products.length,
      products: products.slice(0, 3) // Return first 3 for testing
    });

  } catch (error) {
    console.error('Products test error:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to load products',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
