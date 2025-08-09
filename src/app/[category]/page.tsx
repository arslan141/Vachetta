import { Products } from "@/components/products/Products";
import { getCategoryProducts } from "../actions";
import ProductSkeleton from "@/components/skeletons/ProductSkeleton";
import { Suspense } from "react";
import { cache } from 'react';

type Props = {
  params: {
    category: string;
  };
};

export async function generateMetadata({ params }: Props) {
  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const capitalizedCategory = capitalizeFirstLetter(params.category);

  const categoryDescriptions: Record<string, string> = {
    bags: "Premium handcrafted leather bags including briefcases, messenger bags, and totes",
    wallets: "Elegant leather wallets and card holders with customization options",
    belts: "Durable full-grain leather belts with premium hardware",
    accessories: "Artisanal leather accessories including watch straps and journal covers"
  };

  return {
    title: `${capitalizedCategory} | Vachetta - Artisanal Leather Goods`,
    description: categoryDescriptions[params.category] || `${capitalizedCategory} collection at Vachetta - handcrafted leather goods with customization options`,
  };
}

const CategoryPage = async ({ params }: Props) => {
  const capitalizeFirstLetter = (string: string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const categoryInfo: Record<string, { title: string; description: string }> = {
    bags: {
      title: "Handcrafted Leather Bags",
      description: "Premium briefcases, messenger bags, and totes crafted from the finest Italian leather"
    },
    wallets: {
      title: "Artisan Leather Wallets",
      description: "Elegant bi-fold wallets and minimalist card holders with personalization options"
    },
    belts: {
      title: "Premium Leather Belts",
      description: "Durable full-grain leather belts with hand-stitched edges and quality hardware"
    },
    accessories: {
      title: "Leather Accessories",
      description: "Watch straps, journal covers, and other fine leather accessories"
    }
  };

  const info = categoryInfo[params.category] || {
    title: capitalizeFirstLetter(params.category),
    description: "Premium handcrafted leather goods"
  };

  return (
    <div>
      {/* Category Hero */}
      <section className="bg-gray-900 text-white py-16 px-6">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {info.title}
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            {info.description}
          </p>
        </div>
      </section>

      {/* Products Grid */}
      <section className="pt-14 pb-20">
        <div className="max-w-6xl mx-auto px-6">
          <Suspense
            fallback={<ProductSkeleton extraClassname="" numberProducts={6} />}
          >
            <CategoryProducts category={params.category} />
          </Suspense>
        </div>
      </section>
    </div>
  );
};

const CategoryProducts = async ({ category }: { category: string }) => {
  const products = await getCategoryProducts(category);

  return <Products products={products} extraClassname="" />;
};

export default CategoryPage;
