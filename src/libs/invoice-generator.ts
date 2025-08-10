import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { writeInvoiceFile } from './invoices';

export interface InvoiceData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerAddress: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
  };
  products: Array<{
    name: string;
    quantity: number;
    price: number;
    total: number;
  }>;
  subtotal: number;
  tax: number;
  total: number;
  currency: string;
  paymentMethod: string;
  date: Date;
}

export function generateInvoicePDF(invoiceData: InvoiceData): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 50 });
      const fileName = `invoice-${invoiceData.orderId}.pdf`;
      const chunks: Buffer[] = [];

      // Collect PDF data
      doc.on('data', (chunk: Buffer) => chunks.push(chunk));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(chunks);
        const filePath = writeInvoiceFile(fileName, pdfBuffer);
        resolve(fileName);
      });

      // Header
      doc.fontSize(20).text('VACHETTA', 50, 50);
      doc.fontSize(12).text('Premium Leather Goods', 50, 75);
      doc.fontSize(10).text('handcrafted@vachetta.com | +91-XXXX-XXXX', 50, 90);

      // Invoice Title
      doc.fontSize(18).text('INVOICE', 400, 50);
      doc.fontSize(12).text(`Invoice #: ${invoiceData.orderId}`, 400, 75);
      doc.text(`Date: ${invoiceData.date.toLocaleDateString('en-IN')}`, 400, 90);

      // Customer Details
      doc.fontSize(14).text('Bill To:', 50, 150);
      doc.fontSize(12).text(invoiceData.customerName, 50, 170);
      doc.text(invoiceData.customerEmail, 50, 185);
      doc.text(invoiceData.customerAddress.line1, 50, 200);
      if (invoiceData.customerAddress.line2) {
        doc.text(invoiceData.customerAddress.line2, 50, 215);
      }
      doc.text(`${invoiceData.customerAddress.city}, ${invoiceData.customerAddress.state}`, 50, 230);
      doc.text(`${invoiceData.customerAddress.postal_code}, ${invoiceData.customerAddress.country}`, 50, 245);

      // Table Header
      const tableTop = 300;
      doc.fontSize(12);
      doc.text('Product', 50, tableTop);
      doc.text('Qty', 300, tableTop);
      doc.text('Price', 350, tableTop);
      doc.text('Total', 450, tableTop);

      // Table Line
      doc.moveTo(50, tableTop + 15)
         .lineTo(550, tableTop + 15)
         .stroke();

      // Products
      let currentY = tableTop + 30;
      invoiceData.products.forEach((product) => {
        doc.text(product.name, 50, currentY);
        doc.text(product.quantity.toString(), 300, currentY);
        doc.text(`₹${product.price}`, 350, currentY);
        doc.text(`₹${product.total}`, 450, currentY);
        currentY += 20;
      });

      // Totals
      const totalsY = currentY + 30;
      doc.moveTo(350, totalsY - 10)
         .lineTo(550, totalsY - 10)
         .stroke();

      doc.text('Subtotal:', 350, totalsY);
      doc.text(`₹${invoiceData.subtotal}`, 450, totalsY);

      if (invoiceData.tax > 0) {
        doc.text('Tax:', 350, totalsY + 20);
        doc.text(`₹${invoiceData.tax}`, 450, totalsY + 20);
      }

      doc.fontSize(14);
      doc.text('Total:', 350, totalsY + 40);
      doc.text(`₹${invoiceData.total}`, 450, totalsY + 40);

      // Payment Method
      doc.fontSize(10);
      doc.text(`Payment Method: ${invoiceData.paymentMethod}`, 50, totalsY + 80);
      doc.text('Payment Status: Paid', 50, totalsY + 95);

      // Footer
      doc.text('Thank you for your business!', 50, totalsY + 130);
      doc.text('For any queries, contact us at support@vachetta.com', 50, totalsY + 145);

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}
