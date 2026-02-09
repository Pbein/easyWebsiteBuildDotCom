"use client";

import { motion } from "framer-motion";
import type { GalleryImage } from "../media-gallery.types";

export function MasonryLayout({
  images,
  masonryColumns,
  showCaptions,
  animate,
  isInView,
}: {
  images: GalleryImage[];
  masonryColumns: number;
  showCaptions: boolean;
  animate: boolean;
  isInView: boolean;
}): React.ReactElement {
  return (
    <div
      style={{
        columns: masonryColumns,
        columnGap: "1rem",
      }}
    >
      {images.map((image, i) => (
        <motion.div
          key={`${image.src}-${i}`}
          className="group relative mb-4 overflow-hidden"
          style={{
            breakInside: "avoid",
            borderRadius: "var(--radius-lg)",
          }}
          initial={animate ? { opacity: 0, y: 24 } : false}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{ duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
        >
          <img
            src={image.src}
            alt={image.alt}
            className="h-auto w-full object-cover transition-transform duration-300 group-hover:scale-105"
            style={{ borderRadius: "var(--radius-lg)" }}
          />
          {showCaptions && image.caption && (
            <div
              className="absolute inset-x-0 bottom-0 p-3 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              style={{
                background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
                borderRadius: "0 0 var(--radius-lg) var(--radius-lg)",
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
