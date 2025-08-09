import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";
import { connectDB } from "@/libs/mongodb";
import { Orders } from "@/models/Orders";

export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    
    const order = await Orders.findOne({
      _id: params.orderId,
      userId: session.user._id
    }).populate('products.productId');

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Generate invoice HTML
    const invoiceHTML = generateInvoiceHTML(order, session.user);

    return new NextResponse(invoiceHTML, {
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Disposition': `inline; filename="invoice-${order.orderNumber}.html"`
      }
    });

  } catch (error) {
    console.error("Invoice generation error:", error);
    return NextResponse.json({ error: "Failed to generate invoice" }, { status: 500 });
  }
}

function generateInvoiceHTML(order: any, user: any) {
  const currentDate = new Date().toLocaleDateString();
  const orderDate = new Date(order.createdAt).toLocaleDateString();
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="utf-8">
        <title>Invoice ${order.orderNumber}</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            .header { border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
            .company-name { font-size: 24px; font-weight: bold; color: #333; }
            .invoice-details { display: flex; justify-content: space-between; margin-bottom: 30px; }
            .customer-details { margin-bottom: 30px; }
            .items-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            .items-table th, .items-table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
            .items-table th { background-color: #f5f5f5; }
            .total-section { text-align: right; }
            .total-row { font-weight: bold; font-size: 18px; }
            .print-button { background: #333; color: white; padding: 10px 20px; border: none; cursor: pointer; margin-bottom: 20px; }
            @media print { .print-button { display: none; } }
        </style>
    </head>
    <body>
        <button class="print-button" onclick="window.print()">Print Invoice</button>
        
        <div class="header">
            <div class="company-name">Vachetta Leather Goods</div>
            <div>Premium Handcrafted Leather Products</div>
        </div>

        <div class="invoice-details">
            <div>
                <h3>Invoice Details</h3>
                <p><strong>Invoice Number:</strong> INV-${order.orderNumber}</p>
                <p><strong>Order Number:</strong> ${order.orderNumber}</p>
                <p><strong>Order Date:</strong> ${orderDate}</p>
                <p><strong>Invoice Date:</strong> ${currentDate}</p>
            </div>
            <div>
                <h3>Order Status</h3>
                <p><strong>Status:</strong> ${order.status}</p>
                <p><strong>Payment Status:</strong> ${order.paymentStatus}</p>
                ${order.expectedDeliveryDate ? `<p><strong>Expected Delivery:</strong> ${new Date(order.expectedDeliveryDate).toLocaleDateString()}</p>` : ''}
            </div>
        </div>

        <div class="customer-details">
            <h3>Bill To:</h3>
            <p><strong>${user.name || user.email}</strong></p>
            <p>${user.email}</p>
            ${order.shippingAddress ? `
                <p>${order.shippingAddress.line1}</p>
                ${order.shippingAddress.line2 ? `<p>${order.shippingAddress.line2}</p>` : ''}
                <p>${order.shippingAddress.city}, ${order.shippingAddress.postal_code}</p>
                <p>${order.shippingAddress.country}</p>
            ` : ''}
        </div>

        <table class="items-table">
            <thead>
                <tr>
                    <th>Item</th>
                    <th>Color</th>
                    <th>Size</th>
                    <th>Quantity</th>
                    <th>Unit Price</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                ${order.products.map((item: any) => `
                    <tr>
                        <td>${item.productId?.name || 'Product'}</td>
                        <td>${item.color || 'N/A'}</td>
                        <td>${item.size}</td>
                        <td>${item.quantity}</td>
                        <td>₹${(order.totalPrice / order.products.reduce((sum: number, p: any) => sum + p.quantity, 0)).toFixed(2)}</td>
                        <td>₹${((order.totalPrice / order.products.reduce((sum: number, p: any) => sum + p.quantity, 0)) * item.quantity).toFixed(2)}</td>
                    </tr>
                `).join('')}
            </tbody>
        </table>

        <div class="total-section">
            <table style="margin-left: auto;">
                <tr><td><strong>Subtotal:</strong></td><td>₹${(order.totalPrice * 0.9).toFixed(2)}</td></tr>
                <tr><td><strong>Tax (10%):</strong></td><td>₹${(order.totalPrice * 0.1).toFixed(2)}</td></tr>
                <tr class="total-row"><td><strong>Total:</strong></td><td><strong>₹${order.totalPrice.toFixed(2)}</strong></td></tr>
            </table>
        </div>

        <div style="margin-top: 40px; font-size: 12px; color: #666;">
            <p>Thank you for your business!</p>
            <p>For any questions regarding this invoice, please contact us at support@vachetta.com</p>
        </div>
    </body>
    </html>
  `;
}
