import { fetchCheckoutData, sendEmail } from "@/helpers/checkoutFunctions";
import { saveOrder } from "../orders/action";
import dynamic from 'next/dynamic';

const InvoiceStatus = dynamic(() => import('@/components/result/InvoiceStatus'), { ssr: false });

export async function generateMetadata() {
  return {
    title: "Purchase Result | Ecommerce Template",
    description:
      "Result of the purchase in the test ecommerce created by Marcos Cámara",
  };
}

const CheckoutSuccess = async ({
  searchParams,
}: {
  searchParams: { [session_id: string]: string };
}) => {
  const response = await fetchCheckoutData(searchParams.session_id);

  const isMock = !!(response as any)?.mock;
  if (response && response.metadata && !isMock) {
    await saveOrder(response as any);
    await sendEmail(response as any);
  }

  return (
    <section className="pt-12">
      <div className="flex flex-col gap-4">
        {response && response.customer_details ? (
          <>
            <h1 className="mb-1 text-xl font-bold sm:text-2xl">
              {isMock ? 'Mock Checkout Result' : 'Checkout Payment Result'}
            </h1>
            <h3 className="text-lg font-semibold">Successful payment</h3>
            {isMock ? (
              <p>This was a mock transaction. No real payment was processed.</p>
            ) : (
              <p>{`An email has been sent to you at: ${response.customer_details.email}`}</p>
            )}
            {!isMock && (
              <InvoiceStatus sessionId={response.id} />
            )}
          </>
        ) : (
          <h1>An error has occurred.</h1>
        )}
      </div>
    </section>
  );
};

export default CheckoutSuccess;

// InvoiceStatus client component moved to separate file
