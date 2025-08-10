import { NextRequest, NextResponse } from 'next/server';
import { INVOICES_DIR } from '@/libs/invoices';
import fs from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const filename = params.filename;
    
    // Security check - only allow PDF files and prevent directory traversal
    if (!filename.endsWith('.pdf') || filename.includes('..') || filename.includes('/')) {
      return NextResponse.json(
        { error: 'Invalid filename' },
        { status: 400 }
      );
    }

    const filePath = path.join(INVOICES_DIR, filename);
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: 'Invoice not found' },
        { status: 404 }
      );
    }

    const file = fs.readFileSync(filePath);
    
    return new NextResponse(file, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error('Error serving invoice:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
