import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";
import CartTestComponent from "@/components/debug/CartTestComponent";
import { redirect } from "next/navigation";

export default async function CartTestPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Cart Functionality Test</h1>
      <p className="mb-4">Use this page to test cart functionality.</p>
      
      <CartTestComponent />
      
      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h2 className="font-bold mb-2">Instructions:</h2>
        <ol className="list-decimal list-inside space-y-1">
          <li>Click &quot;Add Test Item to Cart&quot; to add a test product</li>
          <li>Check the cart icon in the navbar for updated count</li>
          <li>Go to /cart to see if the item appears</li>
          <li>Use &quot;Debug Cart&quot; to see raw cart data</li>
        </ol>
      </div>
    </div>
  );
}
