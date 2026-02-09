"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { GalleryImage } from "../media-gallery.types";

export function LightboxOverlay({
  images,
  lightboxIndex,
  onClose,
  onPrev,
  onNext,
}: {
  images: GalleryImage[];
  lightboxIndex: number | null;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}): React.ReactElement {
  return (
    <AnimatePresence>
      {lightboxIndex !== null && images[lightboxIndex] && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center"
          style={{ backgroundColor: "rgba(0,0,0,0.9)" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-10 rounded-full p-2 transition-colors"
            style={{
              backgroundColor: "rgba(255,255,255,0.1)",
              color: "#ffffff",
              cursor: "pointer",
              border: "none",
            }}
            aria-label="Close lightbox"
          >
            <X size={24} />
          </button>

          {/* Previous button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onPrev();
            }}
            className="absolute left-4 z-10 rounded-full p-2 transition-colors"
            style={{
              backgroundColor: "rgba(255,255,255,0.1)",
              color: "#ffffff",
              cursor: "pointer",
              border: "none",
            }}
            aria-label="Previous image"
          >
            <ChevronLeft size={24} />
          </button>

          {/* Next button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onNext();
            }}
            className="absolute right-4 z-10 rounded-full p-2 transition-colors"
            style={{
              backgroundColor: "rgba(255,255,255,0.1)",
              color: "#ffffff",
              cursor: "pointer",
              border: "none",
            }}
            aria-label="Next image"
          >
            <ChevronRight size={24} />
          </button>

          {/* Image */}
          <motion.div
            className="flex max-h-[85vh] max-w-[90vw] flex-col items-center"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[lightboxIndex].src}
              alt={images[lightboxIndex].alt}
              className="max-h-[80vh] max-w-full object-contain"
              style={{ borderRadius: "var(--radius-md)" }}
            />
            {images[lightboxIndex].caption && (
              <p
                className="mt-4 text-center"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-base)",
                  color: "rgba(255,255,255,0.8)",
                }}
              >
                {images[lightboxIndex].caption}
              </p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
