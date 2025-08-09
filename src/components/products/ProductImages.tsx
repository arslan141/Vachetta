"use client";

import { Skeleton } from "../ui/skeleton";
import { VariantsDocument } from "@/types/types";
import Image from "next/image";
import { useState } from "react";

interface ProductImageItem {
  url: string;
}

interface ProductImages {
  name: string;
  selectedVariant: VariantsDocument | undefined;
  im: ProductImageItem[];
}

export const ProductImages = ({ name, selectedVariant, im }: ProductImages) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Show skeleton only if no images are provided via im prop
  if (!im || im.length === 0) {
    return (
      <Skeleton className="w-full aspect-[3/4] max-w-[500px] mx-auto rounded-md" />
    );
  }

  const selectedImage = im[selectedImageIndex] || im[0];

  return (
    <div className="flex flex-col gap-8">
      {/* Main Image */}
      <div className="w-full aspect-[3/4] max-w-[500px] mx-auto rounded-md overflow-hidden bg-gray-50">
        <Image
          src={selectedImage.url}
          alt={`${name} - Image ${selectedImageIndex + 1}`}
          width={500}
          height={667}
          priority={true}
          className="w-full h-full object-cover"
          sizes="(max-width: 768px) 90vw, (max-width: 1024px) 50vw, 500px"
        />
      </div>

      {/* Thumbnail Navigation - Only show if multiple images */}
      {im.length > 1 && (
        <div className="flex gap-4 justify-center overflow-x-auto pb-6 px-4 pt-2">
          {im.map((image: ProductImageItem, index: number) => (
            <button
              key={index}
              onClick={() => setSelectedImageIndex(index)}
              className={`flex-shrink-0 w-24 h-24 rounded-lg overflow-hidden transition-all duration-300 relative ${
                selectedImageIndex === index
                  ? "ring-3 ring-black ring-offset-2 shadow-2xl z-10 opacity-100"
                  : "border-3 border-gray-300 hover:border-gray-500 hover:shadow-lg hover:scale-105 opacity-80 hover:opacity-95"
              }`}
              style={{
                backgroundColor: '#f8f9fa',
                transform: selectedImageIndex === index ? 'translateY(-4px)' : 'translateY(0)'
              }}
            >
              <Image
                src={image.url}
                alt={`${name} - Thumbnail ${index + 1}`}
                width={96}
                height={96}
                className="w-full h-full object-cover"
              />
              {/* Selected indicator overlay */}
              {selectedImageIndex === index && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
              )}
              {/* Thumbnail number indicator */}
              <div className={`absolute top-1 right-1 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center ${
                selectedImageIndex === index 
                  ? "bg-black text-white" 
                  : "bg-white/80 text-gray-600"
              }`}>
                {index + 1}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
