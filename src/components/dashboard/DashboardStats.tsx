import { Session } from "next-auth";
import Link from "next/link";
import { getTotalItems } from "@/app/(carts)/cart/action";
import { getTotalWishlist } from "@/app/(carts)/wishlist/action";
import { getUserOrders } from "@/app/(user)/orders/action";

interface DashboardStatsProps {
  session: Session;
}

export const DashboardStats = async ({ session }: DashboardStatsProps) => {
  // Fetch user's data in parallel
  const [cartItems, wishlistData, ordersData] = await Promise.all([
    getTotalItems(session),
    getTotalWishlist(),
    getUserOrders(),
  ]);

  const totalCartItems = cartItems || 0;
  const totalWishlistItems = wishlistData?.items?.length || 0;
  const totalOrders = ordersData?.orders?.length || 0;
  
  // Calculate total spending from orders
  const totalSpent = ordersData?.orders?.reduce((total, order) => {
    return total + (order.total_price / 100); // Convert from cents
  }, 0) || 0;

  const stats = [
    {
      title: "Cart Items",
      value: totalCartItems,
      icon: "🛒",
      link: "/cart",
      description: "Items ready for checkout",
      color: "bg-blue-50 text-blue-700 border-blue-200",
    },
    {
      title: "Wishlist",
      value: totalWishlistItems,
      icon: "❤️",
      link: "/wishlist",
      description: "Saved for later",
      color: "bg-red-50 text-red-700 border-red-200",
    },
    {
      title: "Orders",
      value: totalOrders,
      icon: "📦",
      link: "/orders",
      description: "Total purchases",
      color: "bg-green-50 text-green-700 border-green-200",
    },
    {
      title: "Total Spent",
      value: `₹${totalSpent.toFixed(2)}`,
      icon: "💰",
      link: "/orders",
      description: "Lifetime purchases",
      color: "bg-amber-50 text-amber-700 border-amber-200",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {stats.map((stat, index) => (
        <Link
          key={index}
          href={stat.link}
          className="group"
        >
          <div className={`${stat.color} border rounded-lg p-6 hover:shadow-md transition-all duration-200 hover:scale-105`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium opacity-80">{stat.title}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
                <p className="text-xs opacity-70 mt-1">{stat.description}</p>
              </div>
              <div className="text-3xl group-hover:scale-110 transition-transform">
                {stat.icon}
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};
