import { NextResponse } from 'next/server';
import { generateInvoicePDF, type InvoiceData } from '@/libs/invoice-generator';

export async function GET() {
  try {
    // Test invoice data
    const testInvoiceData: InvoiceData = {
      orderId: 'test-order-' + Date.now(),
      customerName: 'John Doe',
      customerEmail: 'john.doe@example.com',
      customerAddress: {
        line1: '123 Leather Street',
        line2: 'Apt 4B',
        city: 'Mumbai',
        state: 'Maharashtra',
        postal_code: '400001',
        country: 'India'
      },
      products: [
        {
          name: 'Premium Leather Wallet',
          quantity: 1,
          price: 2500,
          total: 2500
        },
        {
          name: 'Leather Belt',
          quantity: 2,
          price: 1500,
          total: 3000
        }
      ],
      subtotal: 5500,
      tax: 0,
      total: 5500,
      currency: 'INR',
      paymentMethod: 'Card',
      date: new Date()
    };

    const pdfFileName = await generateInvoicePDF(testInvoiceData);
    
    return NextResponse.json({
      success: true,
      message: 'Test invoice generated successfully',
      fileName: pdfFileName,
      downloadUrl: `/api/invoices/${pdfFileName}`
    });
  } catch (error) {
    console.error('Test invoice generation failed:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
