import fs from 'fs';
import path from 'path';

export const INVOICES_DIR = path.join(process.cwd(), 'invoices');

export function ensureInvoicesDir() {
  if (!fs.existsSync(INVOICES_DIR)) fs.mkdirSync(INVOICES_DIR, { recursive: true });
}

export function writeInvoiceFile(fileName: string, data: Buffer) {
  ensureInvoicesDir();
  const fullPath = path.join(INVOICES_DIR, fileName);
  fs.writeFileSync(fullPath, data as any); // Buffer compatibility fix
  return fullPath;
}

export function invoicePublicPath(fileName: string) {
  return `/invoices/${fileName}`;
}
