import Link from "next/link";
import { format } from "date-fns";
import { OrderDocument, OrdersDocument } from "@/types/types";
import { getUserOrders } from "./action";
import { Loader } from "@/components/common/Loader";
import { Session, getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";

export async function generateMetadata() {
  return {
    title: `Orders | Ecommerce Template`,
  };
}

const UserOrders = async () => {
  const session: Session | null = await getServerSession(authOptions);

  if (session?.user) {
    return <Orders />;
  }

  return (
    <div className="flex flex-col items-center justify-center h-[calc(100vh-91px)] gap-2 px-4">
      <h2 className="mb-6 text-4xl font-bold">NO ORDERS YET</h2>
      <p className="mb-4 text-lg">To view your orders you must be logged in.</p>
      <Link
        className="flex font-medium	 items-center bg-[#0C0C0C] justify-center text-sm min-w-[160px] max-w-[160px] h-[40px] px-[10px] rounded-md border border-solid border-[#2E2E2E] transition-all hover:bg-[#1F1F1F] hover:border-[#454545]"
        href="/login"
      >
        Login
      </Link>
    </div>
  );
};

const statusIcon = (status: string) => {
  switch (status) {
    case 'paid': return '✅';
    case 'mock': return '🧪';
    case 'pending':
    default: return '⏳';
  }
};

const Orders = async ({ searchParams }: any) => {
  const filter = (searchParams?.status || '').toLowerCase();
  const orders: OrdersDocument | undefined | null = await getUserOrders();

  if (orders === undefined || orders === null) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-[80vh] gap-2 px-4">
        <h2 className="mb-6 text-4xl font-bold">NO ORDERS YET</h2>
        <p className="mb-4 text-lg">
          To create an order add a product to the cart and buy it!
        </p>
        <Link
          className="flex font-medium	 items-center bg-[#0C0C0C] justify-center text-sm min-w-[160px] max-w-[160px] h-[40px] px-[10px] rounded-md border border-solid border-[#2E2E2E] transition-all hover:bg-[#1F1F1F] hover:border-[#454545]"
          href="/"
        >
          Start
        </Link>
      </div>
    );
  }

  const filtered = filter ? orders.orders.filter((o: any) => (o.status || 'pending').toLowerCase() === filter) : orders.orders;
  return (
    <div className="pt-12">
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <a href="/orders" className={`text-xs px-3 py-1 rounded border ${!filter ? 'bg-white text-black' : 'border-border-primary hover:bg-color-secondary'}`}>All</a>
        <a href="/orders?status=paid" className={`text-xs px-3 py-1 rounded border ${filter==='paid' ? 'bg-white text-black' : 'border-border-primary hover:bg-color-secondary'}`}>Paid</a>
        <a href="/orders?status=mock" className={`text-xs px-3 py-1 rounded border ${filter==='mock' ? 'bg-white text-black' : 'border-border-primary hover:bg-color-secondary'}`}>Mock</a>
        <a href="/orders?status=pending" className={`text-xs px-3 py-1 rounded border ${filter==='pending' ? 'bg-white text-black' : 'border-border-primary hover:bg-color-secondary'}`}>Pending</a>
      </div>
      <div className="grid items-center justify-between grid-cols-auto-fill-350 gap-7">
      {filtered.map((order: any, index: number) => (
        <div
          key={index}
          className="w-full transition duration-150 border border-solid rounded border-border-primary bg-background-secondary hover:bg-color-secondary"
        >
          <div className="flex flex-col justify-between h-full gap-2 px-4 py-5">
            <Link
              href={`/orders/${order._id}?items=${order.products.length}`}
              className="flex flex-col gap-2"
            >
              {(() => {
                // Better price handling - check if it's already in proper format
                let amount = order.total_price || 0;
                if (amount > 10000) {
                  amount = amount / 100; // Convert from cents
                }
                
                const itemsCount = Array.isArray(order.products) && order.products.length > 0 
                  ? order.products.reduce((total: number, product: any) => total + (product?.quantity || 1), 0) 
                  : 0;
                
                return (
                  <div>
                    <h4 className="font-semibold">{`${format(order.purchaseDate, "dd LLL yyyy")} | ₹${amount.toFixed(2)} | Items: ${itemsCount}`}</h4>
                    {itemsCount === 0 && (
                      <p className="text-xs text-red-500 mt-1">No items found in this order</p>
                    )}
                  </div>
                );
              })()}
              <p className="text-sm">Order number: {order.orderNumber}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-[10px] uppercase tracking-wide px-2 py-0.5 rounded bg-gray-600 text-white ${order.status === 'paid' ? 'bg-green-600' : order.status === 'mock' ? 'bg-amber-600' : 'bg-gray-600'}`}>{statusIcon(order.status || 'pending')} {order.status || 'pending'}</span>
                {(order.invoiceUrl || order.localInvoicePath) && (
                  <a 
                    href={order.localInvoicePath ? `/api/invoices/${order.localInvoicePath}` : order.invoiceUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-[10px] underline text-blue-400 hover:text-blue-300"
                  >
                    📄 Invoice PDF
                  </a>
                )}
              </div>
            </Link>
            
            <div className="flex gap-2 mt-2">
              <Link
                href={`/orders/${order._id}?items=${order.products.length}`}
                className="flex-1 bg-gray-600 text-white px-3 py-2 rounded text-center text-sm hover:bg-gray-700 transition-colors"
              >
                View Details
              </Link>
              {(order.invoiceUrl || order.localInvoicePath) && (
                <a
                  href={order.localInvoicePath ? `/api/invoices/${order.localInvoicePath}` : order.invoiceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-amber-600 text-white px-3 py-2 rounded text-sm hover:bg-amber-700 transition-colors"
                >
                  📄 Invoice
                </a>
              )}
            </div>
          </div>
        </div>
      ))}
      </div>
    </div>
  );
};

export default UserOrders;
