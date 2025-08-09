"use client";

import { Skeleton } from "../ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { Images } from "./Images";
import { VariantsDocument } from "@/types/types";
import Image from "next/image";

interface ProductImageItem {
  url: string;
}

interface ProductImages {
  name: string;
  selectedVariant: VariantsDocument | undefined;
  im: ProductImageItem[];
}

export const ProductImages = ({ name, selectedVariant,im }: ProductImages) => {
  if (!selectedVariant || !selectedVariant.images) {
    return (
      <Skeleton className="w-full rounded-b-none aspect-[2/3] min-w-[250px] lg:aspect-[4/6] lg:min-w-[560px]" />
    );
  }

  return (
    <>
      <div className="flex lg:hidden">
        <Carousel
          className="w-full min-w-[250px] rounded-md overflow-hidden"
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent>
            {im.map((image: ProductImageItem, index: number) => (
              
              <CarouselItem key={index} className="pl-0">
                <Image
                  src={image.url}
                  alt={`${name} - Image ${index + 1}`}
                  width={384}
                  height={576}
                  priority={index === 0 ? true : false}
                  sizes="(max-width: 994px) 100vw,
                  (max-width: 1304px) 50vw,
                  (max-width: 1500px) 25vw,
                  33vw"
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>

      <div className="lg:grid hidden grid-cols-2 gap-0.5 min-w-grid-img">
        {im.map((image: ProductImageItem, index: number) => (
          <div
            className="inline-block w-full max-w-2xl mx-auto overflow-hidden rounded"
            key={index}
          >
            <Image
                  src={image.url}
                  alt={`${name} - Image ${index + 1}`}
                  width={384}
                  height={576}
                  priority={index === 0 ? true : false}
                  sizes="(max-width: 994px) 100vw,
                  (max-width: 1304px) 50vw,
                  (max-width: 1500px) 25vw,
                  33vw"
                />
          </div>
        ))}
      </div>
    </>
  );
};
