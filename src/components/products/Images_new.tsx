"use client";

import React, { useState } from "react";
import Image, { ImageLoader } from "next/image";
import { Skeleton } from "../ui/skeleton";

const cloudinaryLoader: ImageLoader = ({ src, width, quality }) => {
  const params = [
    "f_auto",
    "c_limit",
    "w_" + width,
    "q_" + (quality || "auto"),
  ];
  const normalizeSrc = (src: string) => (src[0] === "/" ? src.slice(1) : src);

  return `https://res.cloudinary.com/${
    process.env.CLOUDINARY_CLOUD_NAME
  }/image/upload/${params.join(",")}/${normalizeSrc(src)}`;
};

export const Images = ({
  image,
  name,
  width,
  height,
  priority,
  sizes,
}: {
  image: [string] | Array<{url: string; alt?: string}>;
  name: string;
  width: number;
  height: number;
  priority?: boolean;
  sizes?: string;
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoadComplete = () => {
    setImageLoaded(true);
  };

  // Handle both old format (array of strings) and new format (array of objects)
  const getImageSrc = () => {
    if (!image || image.length === 0) return '';
    
    const firstImage = image[0];
    if (typeof firstImage === 'string') {
      return firstImage;
    } else if (firstImage && typeof firstImage === 'object' && 'url' in firstImage) {
      return firstImage.url;
    }
    return '';
  };

  const imageSrc = getImageSrc();

  if (!imageSrc) {
    return <Skeleton className="w-full max-w-img aspect-[2/3]" />;
  }

  return (
    <div className={!imageLoaded ? "relative" : ""}>
      <Image
        loader={cloudinaryLoader}
        width={width}
        height={height}
        src={imageSrc}
        alt={name}
        priority={priority}
        sizes={sizes}
        onLoadingComplete={handleImageLoadComplete}
        className="object-cover w-full h-full"
      />
      {!imageLoaded && (
        <div className="absolute inset-0">
          <Skeleton className="w-full h-full" />
        </div>
      )}
    </div>
  );
};
