"use client";

import Image from "next/image";
import type { ImageSource } from "@/components/library/base.types";

interface WithBgImageProps {
  backgroundImage: ImageSource;
  overlayOpacity: number;
}

export function WithBgImage({
  backgroundImage,
  overlayOpacity,
}: WithBgImageProps): React.ReactElement {
  return (
    <>
      <Image
        src={backgroundImage.src}
        alt={backgroundImage.alt}
        fill
        className="object-cover"
        priority
        sizes="100vw"
      />
      <div
        className="absolute inset-0"
        style={{
          background: `linear-gradient(to bottom, rgba(0,0,0,${overlayOpacity * 0.6}) 0%, rgba(0,0,0,${overlayOpacity}) 60%, rgba(0,0,0,${overlayOpacity * 1.2 > 1 ? 1 : overlayOpacity * 1.2}) 100%)`,
        }}
      />
    </>
  );
}
