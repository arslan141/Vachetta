"use client";

import { ProductImages } from "@/components/products/ProductImages";
import { ProductDocument, VariantsDocument } from "@/types/types";
import { Session } from "next-auth";
import { useState, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import AddToCart from "../cart/AddToCart";
interface SingleProduct {
  pr : any;
  product: string;
  session: Session | null;
}

export const SingleProduct = ({ pr,product, session }: SingleProduct) => {
  const productPlainObject: ProductDocument = JSON.parse(product);
  console.log("🧩 SingleProduct received product:", productPlainObject.name);
  console.log("🧩 Product variants:", productPlainObject.variants);
  
  // Ensure variants exist with fallback
  const variants = productPlainObject.variants || [];
  const defaultVariant = variants[0] || {
    id: `${productPlainObject._id}-default-natural`,
    color: 'Natural',
    size: 'One Size', 
    priceId: `${productPlainObject._id}-default-natural`,
    quantity: 0,
    images: [productPlainObject.image?.[0] || ""]
  };
  
  const [selectedVariant, setSelectedVariant] = useState<VariantsDocument>(defaultVariant);

  // Auto-select first variant on mount to ensure color is selected
  useEffect(() => {
    if (productPlainObject.variants && productPlainObject.variants.length > 0 && !selectedVariant) {
      setSelectedVariant(productPlainObject.variants[0]);
    }
  }, [productPlainObject.variants, selectedVariant]);

  if (!product) {
    return <div>Product not found</div>;
  }

  return (
    <div className="flex flex-wrap justify-between gap-8">
      <div className="grow-999 basis-0">
        <ProductImages
          name={productPlainObject.name}
          selectedVariant={selectedVariant}
          im={pr.images || []}
        />
      </div>

      <div className="sticky flex flex-col items-center justify-center w-full h-full gap-5 grow basis-600 top-8">
        <div className="w-full border border-solid rounded border-border-primary bg-background-secondary">
          <div className="flex flex-col justify-between gap-3 p-5 border-b border-solid border-border-primary">
            <h1 className="text-base font-semibold">
              {productPlainObject.name}
            </h1>
            <span className="text-sm">₹{productPlainObject.price}</span>
            <p className="text-sm">{productPlainObject.description}</p>
          </div>

          <AddToCart
            session={session}
            product={productPlainObject}
            selectedVariant={selectedVariant}
            setSelectedVariant={setSelectedVariant}
          />
        </div>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-sm">COMPOSITION</AccordionTrigger>
            <AccordionContent>
              <p>
                We work with monitoring programmes to ensure compliance with our
                social, environmental and health and safety standards for our
                products. To assess compliance, we have developed a programme of
                audits and continuous improvement plans.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger className="text-sm">CARE</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-2">
              <p> Caring for your clothes is caring for the environment.</p>
              <p>
                Lower temperature washes and delicate spin cycles are gentler on
                garments and help to protect the colour, shape and structure of
                the fabric. Furthermore, they reduce the amount of energy used
                in care processes.
              </p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger className="text-sm">ORIGIN</AccordionTrigger>
            <AccordionContent className="flex flex-col gap-2">
              <p>
                We work with our suppliers, workers, unions and international
                organisations to develop a supply chain in which human rights
                are respected and promoted, contributing to the United Nations
                Sustainable Development Goals.
              </p>
              <p>
                Thanks to the collaboration with our suppliers, we work to know
                the facilities and processes used to manufacture our products in
                order to understand their traceability.
              </p>
              <p>Made in Portugal</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};
