import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/libs/auth';
import { connectDB } from '@/libs/mongodb';
import { Orders } from '@/models/Orders';

export async function GET(_req: NextRequest, { params }: { params: { orderId: string } }) {
  try {
    console.log(`🔍 Invoice request for orderId: ${params.orderId}`);
    const session = await getServerSession(authOptions);
    if (!session?.user?._id) {
      console.log(`❌ No session found for invoice request`);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.log(`👤 User session found: ${session.user._id}`);
    
    await connectDB();
    
    // ENHANCED SENIOR ARCHITECT SOLUTION: Multi-strategy order lookup
    console.log('🔍 Executing multi-strategy order lookup...');
    
    let orderDoc: any = null;
    let order: any = null;
    let lookupStrategy = '';
    
    // Strategy 1: Find by user ID + order lookup (original method)
    console.log('📋 Strategy 1: User-scoped lookup');
    orderDoc = await Orders.findOne({ userId: session.user._id });
    if (orderDoc) {
      order = orderDoc.orders.find((o: any) => 
        o._id.toString() === params.orderId || 
        o.orderId === params.orderId
      );
      if (order) {
        lookupStrategy = 'user-scoped';
        console.log(`✅ Found order via user-scoped lookup`);
      }
    }
    
    // Strategy 2: Global order lookup with security validation (fallback)
    if (!order) {
      console.log('📋 Strategy 2: Global order lookup with validation');
      orderDoc = await Orders.findOne({
        $or: [
          { 'orders._id': params.orderId },
          { 'orders.orderId': params.orderId }
        ]
      });
      
      if (orderDoc) {
        order = orderDoc.orders.find((o: any) => 
          o._id.toString() === params.orderId || 
          o.orderId === params.orderId
        );
        
        // SECURITY: Verify user has access to this order
        if (order && orderDoc.userId === session.user._id) {
          lookupStrategy = 'global-validated';
          console.log(`✅ Found order via global lookup (user validated)`);
        } else if (order) {
          console.log(`❌ Security violation: User ${session.user._id} attempted to access order belonging to ${orderDoc.userId}`);
          return NextResponse.json({ error: 'Unauthorized access to order' }, { status: 403 });
        }
      }
    }
    
    // Strategy 3: Admin override (if user is admin)
    if (!order && session.user.role === 'admin') {
      console.log('📋 Strategy 3: Admin override lookup');
      orderDoc = await Orders.findOne({
        $or: [
          { 'orders._id': params.orderId },
          { 'orders.orderId': params.orderId }
        ]
      });
      
      if (orderDoc) {
        order = orderDoc.orders.find((o: any) => 
          o._id.toString() === params.orderId || 
          o.orderId === params.orderId
        );
        if (order) {
          lookupStrategy = 'admin-override';
          console.log(`✅ Found order via admin override`);
        }
      }
    }
    
    if (!orderDoc) {
      console.log(`❌ No orders document found for user: ${session.user._id}`);
      return NextResponse.json({ error: 'No orders' }, { status: 404 });
    }
    
    console.log(`📋 Found orders document with ${orderDoc.orders.length} orders (strategy: ${lookupStrategy})`);
    
    // Debug: Log available orders for troubleshooting
    console.log('📊 Available orders in document:');
    orderDoc.orders.forEach((o: any, index: number) => {
      console.log(`  ${index + 1}. _id=${o._id}, orderId=${o.orderId}, status=${o.status}`);
    });
    
    if (!order) {
      console.log(`❌ Order not found using any strategy. Looking for: ${params.orderId}`);
      return NextResponse.json({ 
        error: 'Order not found', 
        debug: {
          searchedFor: params.orderId,
          availableOrders: orderDoc.orders.map((o: any) => ({
            _id: o._id.toString(),
            orderId: o.orderId,
            status: o.status
          }))
        }
      }, { status: 404 });
    }
    
    console.log(`✅ Found order: ${order.orderId}, status: ${order.status}, strategy: ${lookupStrategy}`);
    
    if (!order.invoiceUrl && !order.localInvoicePath) {
      console.log(`❌ No invoice available for order: ${order.orderId}`);
      return NextResponse.json({ error: 'No invoice for this order' }, { status: 404 });
    }

    // Serve locally stored invoice if present
    if (order.localInvoicePath) {
      try {
        const { INVOICES_DIR } = await import('@/libs/invoices');
        const fs = await import('fs');
        const path = await import('path');
        const filePath = path.join(INVOICES_DIR, `invoice-${order.paymentIntentId || order.orderId}.pdf`);
        if (fs.existsSync(filePath)) {
          const fileBuf = fs.readFileSync(filePath);
          return new NextResponse(fileBuf as any, {
            status: 200,
            headers: {
              'Content-Type': 'application/pdf',
              'Content-Disposition': `inline; filename="invoice-${order.orderId}.pdf"`,
            }
          });
        }
      } catch (e) {
        console.log('⚠️ Local file access failed, falling back to remote');
      }
    }

    // Data URL case
    if (order.invoiceUrl.startsWith('data:application/pdf')) {
      const base64 = order.invoiceUrl.split(',')[1];
      const buf = Buffer.from(base64, 'base64');
      return new NextResponse(buf as any, { // cast for edge runtime
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `inline; filename="invoice-${order.orderId}.pdf"`,
        }
      });
    }

    // Remote hosted invoice URL (Stripe hosted_invoice_url or invoice_pdf)
    try {
      console.log(`📥 Fetching remote invoice: ${order.invoiceUrl}`);
      const resp = await fetch(order.invoiceUrl);
      if (!resp.ok) {
        console.log(`❌ Failed to fetch remote invoice: ${resp.status} ${resp.statusText}`);
        return NextResponse.json({ error: 'Failed to fetch invoice' }, { status: 502 });
      }
      const arrayBuf = await resp.arrayBuffer();
      return new NextResponse(Buffer.from(arrayBuf) as any, {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `inline; filename="invoice-${order.orderId}.pdf"`,
        }
      });
    } catch (e) {
      console.log(`❌ Invoice fetch error:`, e);
      return NextResponse.json({ error: 'Invoice fetch error' }, { status: 500 });
    }
  } catch (e) {
    console.log(`❌ Unexpected error:`, e);
    return NextResponse.json({ error: 'Unexpected error' }, { status: 500 });
  }
}
