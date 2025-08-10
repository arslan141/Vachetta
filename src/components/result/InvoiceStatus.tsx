"use client";
import React from 'react';
import Link from 'next/link';

interface Props { sessionId: string }

const InvoiceStatus: React.FC<Props> = ({ sessionId }) => {
  const [ready, setReady] = React.useState(false);
  const [invoiceUrl, setInvoiceUrl] = React.useState<string | null>(null);
  const [attempts, setAttempts] = React.useState(0);

  React.useEffect(() => {
    let cancelled = false;
    const poll = async () => {
      try {
        const res = await fetch(`/api/stripe/invoice-status?session_id=${sessionId}`, { cache: 'no-store' });
        const data = await res.json();
        if (!cancelled) {
          if (data.ready && data.invoiceUrl) {
            setReady(true);
            setInvoiceUrl(data.invoiceUrl);
          } else if (attempts < 12) { // ~60s
            setAttempts(a => a + 1);
            setTimeout(poll, 5000);
          }
        }
      } catch {
        if (!cancelled && attempts < 12) {
          setAttempts(a => a + 1);
          setTimeout(poll, 5000);
        }
      }
    };
    poll();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (ready && invoiceUrl) {
    return (
      <div className="flex items-center gap-2 text-sm">
        <span className="text-green-600 font-medium">Invoice ready:</span>
        <Link href={invoiceUrl} target="_blank" className="underline text-blue-500">View PDF</Link>
      </div>
    );
  }
  return (
    <div className="text-sm text-gray-500">
      {attempts === 0 ? 'Generating invoice...' : attempts >= 12 ? 'Invoice still processing. Check your Orders later.' : `Waiting for invoice (attempt ${attempts + 1}/12)...`}
    </div>
  );
};

export default InvoiceStatus;
