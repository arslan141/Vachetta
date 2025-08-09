import Link from "next/link";
import { Images } from "./Images";
import { SerializedProduct, EnrichedProducts } from "@/types/types";
import dynamic from "next/dynamic";
import { Skeleton } from "../ui/skeleton";
import { Wishlists, getTotalWishlist } from "@/app/(carts)/wishlist/action";
import { Session, getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";

const WishlistButton = dynamic(() => import("../cart/WishlistButton"), {
  loading: () => <Skeleton className="w-5 h-5" />,
});

const DeleteButton = dynamic(() => import("../cart/DeleteButton"), {
  loading: () => <Skeleton className="w-5 h-5" />,
});

const ProductCartInfo = dynamic(() => import("../cart/ProductCartInfo"), {
  loading: () => <Skeleton className="w-24 h-8" />,
});

const QuickAddToCart = dynamic(() => import("../cart/QuickAddToCart"), {
  loading: () => <Skeleton className="w-full h-8" />,
});

type ProductInput = SerializedProduct | EnrichedProducts;

// Normalize any product-like item into a SerializedProduct for display components
const toSerialized = (p: ProductInput): SerializedProduct => {
  if ((p as SerializedProduct).description !== undefined) {
    return p as SerializedProduct;
  }
  const ep = p as EnrichedProducts;
  return {
    _id: ep._id.toString(),
    name: ep.name,
    description: "", // EnrichedProducts has no description
    price: ep.price,
    category: ep.category,
    image: ep.image,
    variants: [],
    quantity: ep.quantity,
    purchased: ep.purchased,
    productId: ep.productId.toString(),
  };
};

export const Products = async ({
  products,
  extraClassname = "",
}: {
  products: ProductInput[];
  extraClassname: string;
}) => {
  const session: Session | null = await getServerSession(authOptions);
  const hasMissingQuantity = products.some((product: any) => !product.quantity);
  const wishlist =
    session?.user?.email && !hasMissingQuantity
      ? await getTotalWishlist()
      : [];

  const wishlistString = JSON.stringify(wishlist);

  // Type guard to check if product has cart-specific fields for rendering cart components
  const isCartItem = (product: SerializedProduct): boolean => {
    return product.quantity !== undefined && product.quantity > 0;
  };

  return (
    <div
      className={`grid gap-x-3.5 gap-y-6 sm:gap-y-9 ${
        extraClassname === "colums-mobile" ? "grid-cols-auto-fill-110" : ""
      }
        ${extraClassname === "cart-ord-mobile" ? "grid-cols-1" : ""} sm:grid-cols-auto-fill-250`}
    >
      {products.map((product, index) => {
        const serialized = toSerialized(product);
        const { _id, name, image, price, category, productId, quantity } = serialized as SerializedProduct & { quantity?: number };
        
        return (
          <div
            key={_id}
            className={`flex justify-between border border-solid border-border-primary rounded-md overflow-hidden 
            ${extraClassname === "cart-ord-mobile" ? "flex-row sm:flex-col" : "flex-col"}`}
          >
            <div className="w-full basis-3/5 grow-0 sm:basis-auto">
              <Link href={`/${category}/${_id}`}>
                <Images
                  image={image}
                  name={name}
                  width={250}
                  height={375}
                  priority={index < 4}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                />
              </Link>
            </div>

            <div className="flex justify-between flex-col gap-2.5 p-3.5 w-full basis-2/5 sm:basis-auto">
              <div className="flex justify-between">
                <div>
                  <Link href={`/${category}/${_id}`}>
                    <h3 className="hover:underline font-medium">{name}</h3>
                  </Link>
                  <span className="text-sm text-gray-600">₹{price}</span>
                </div>

                {/* Only show cart-specific components for cart items */}
                {isCartItem(product as any) ? (
                  <DeleteButton product={product as any} />
                ) : (
                  <WishlistButton
                    session={session}
                    productId={JSON.stringify(productId || _id)}
                    wishlistString={wishlistString}
                  />
                )}
              </div>

              <div className="flex items-center justify-between">
                {/* Only show ProductCartInfo for cart items */}
                {isCartItem(product as any) ? (
                  <ProductCartInfo product={product as any} />
                ) : (
                  <QuickAddToCart product={serialized} session={session} />
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
