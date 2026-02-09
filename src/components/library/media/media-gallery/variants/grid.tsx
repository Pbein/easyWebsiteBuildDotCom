"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { GalleryImage } from "../media-gallery.types";
import { COLUMNS_MAP } from "../shared";

export function GridLayout({
  images,
  columns,
  showCaptions,
  animate,
  isInView,
  isLightbox,
  onClickImage,
}: {
  images: GalleryImage[];
  columns: 2 | 3 | 4;
  showCaptions: boolean;
  animate: boolean;
  isInView: boolean;
  isLightbox: boolean;
  onClickImage: (index: number) => void;
}): React.ReactElement {
  return (
    <div className={cn("grid gap-4", COLUMNS_MAP[columns])}>
      {images.map((image, i) => (
        <motion.div
          key={`${image.src}-${i}`}
          className="group relative overflow-hidden"
          style={{
            borderRadius: "var(--radius-lg)",
            cursor: isLightbox ? "pointer" : "default",
          }}
          initial={animate ? { opacity: 0, y: 24 } : false}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
          layout
          onClick={() => onClickImage(i)}
        >
          <div className="aspect-square overflow-hidden">
            <img
              src={image.src}
              alt={image.alt}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
          {showCaptions && image.caption && (
            <div
              className="absolute inset-x-0 bottom-0 p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{
                background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-sm)",
                  color: "#ffffff",
                }}
              >
                {image.caption}
              </p>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
}
