"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { tokensToCSSProperties } from "@/lib/theme/token-map";
import type { MediaGalleryProps } from "./media-gallery.types";

const SPACING_MAP = {
  none: "0",
  sm: "var(--space-tight)",
  md: "var(--space-component)",
  lg: "var(--space-section)",
  xl: "calc(var(--space-section) * 1.5)",
} as const;

const COLUMNS_MAP = {
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
} as const;

export function MediaGallery({
  id,
  className,
  theme,
  animate = true,
  spacing = "lg",
  headline,
  subheadline,
  images,
  variant = "grid",
  columns = 3,
  showCaptions = false,
  enableFilter = false,
}: MediaGalleryProps): React.ReactElement {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const [activeFilter, setActiveFilter] = useState("All");
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const themeStyle = theme ? (tokensToCSSProperties(theme) as React.CSSProperties) : undefined;
  const paddingY = SPACING_MAP[spacing];

  // Extract unique categories
  const categories = enableFilter
    ? ["All", ...Array.from(new Set(images.map((img) => img.category).filter(Boolean) as string[]))]
    : [];

  const filteredImages =
    enableFilter && activeFilter !== "All"
      ? images.filter((img) => img.category === activeFilter)
      : images;

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (lightboxIndex === null) return;

    function handleKeyDown(e: KeyboardEvent): void {
      if (e.key === "Escape") setLightboxIndex(null);
      if (e.key === "ArrowRight")
        setLightboxIndex((prev) => (prev !== null ? (prev + 1) % filteredImages.length : null));
      if (e.key === "ArrowLeft")
        setLightboxIndex((prev) =>
          prev !== null ? (prev - 1 + filteredImages.length) % filteredImages.length : null
        );
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxIndex, filteredImages.length]);

  const openLightbox = useCallback(
    (index: number): void => {
      if (variant === "lightbox") setLightboxIndex(index);
    },
    [variant]
  );

  return (
    <section
      ref={ref}
      id={id}
      className={cn("relative w-full", className)}
      style={{
        ...themeStyle,
        backgroundColor: "var(--color-background)",
        paddingTop: paddingY,
        paddingBottom: paddingY,
      }}
      aria-label={headline ?? "Gallery"}
    >
      <div className="mx-auto px-6" style={{ maxWidth: "var(--container-max)" }}>
        {/* Section header */}
        {(headline || subheadline) && (
          <motion.div
            className="mb-16 text-center"
            initial={animate ? { opacity: 0, y: 20 } : false}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {headline && (
              <h2
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "clamp(var(--text-2xl), 3vw, var(--text-4xl))",
                  fontWeight: "var(--weight-bold)",
                  lineHeight: "var(--leading-tight)",
                  letterSpacing: "var(--tracking-tight)",
                  color: "var(--color-text)",
                }}
              >
                {headline}
              </h2>
            )}
            {subheadline && (
              <p
                className="mx-auto mt-4"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-lg)",
                  lineHeight: "var(--leading-relaxed)",
                  color: "var(--color-text-secondary)",
                  maxWidth: "var(--container-narrow)",
                }}
              >
                {subheadline}
              </p>
            )}
          </motion.div>
        )}

        {/* Filter tabs */}
        {enableFilter && categories.length > 1 && (
          <div className="mb-8 flex flex-wrap justify-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveFilter(cat)}
                className="px-4 py-2 text-sm font-medium transition-all"
                style={{
                  fontFamily: "var(--font-body)",
                  color:
                    activeFilter === cat ? "var(--color-primary)" : "var(--color-text-secondary)",
                  borderBottom:
                    activeFilter === cat
                      ? "2px solid var(--color-primary)"
                      : "2px solid transparent",
                  background: "none",
                  cursor: "pointer",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Grid variant */}
        {(variant === "grid" || variant === "lightbox") && (
          <div className={cn("grid gap-4", COLUMNS_MAP[columns])}>
            {filteredImages.map((image, i) => (
              <motion.div
                key={`${image.src}-${i}`}
                className="group relative overflow-hidden"
                style={{
                  borderRadius: "var(--radius-lg)",
                  cursor: variant === "lightbox" ? "pointer" : "default",
                }}
                initial={animate ? { opacity: 0, y: 24 } : false}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
                transition={{ duration: 0.5, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
                layout
                onClick={() => openLightbox(i)}
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
        )}

        {/* Masonry variant */}
        {variant === "masonry" && (
          <div
            style={{
              columns: columns,
              columnGap: "1rem",
            }}
          >
            {filteredImages.map((image, i) => (
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
        )}
      </div>

      {/* Lightbox overlay */}
      <AnimatePresence>
        {lightboxIndex !== null && filteredImages[lightboxIndex] && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            style={{ backgroundColor: "rgba(0,0,0,0.9)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightboxIndex(null)}
          >
            {/* Close button */}
            <button
              onClick={() => setLightboxIndex(null)}
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
                setLightboxIndex((prev) =>
                  prev !== null ? (prev - 1 + filteredImages.length) % filteredImages.length : null
                );
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
                setLightboxIndex((prev) =>
                  prev !== null ? (prev + 1) % filteredImages.length : null
                );
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
                src={filteredImages[lightboxIndex].src}
                alt={filteredImages[lightboxIndex].alt}
                className="max-h-[80vh] max-w-full object-contain"
                style={{ borderRadius: "var(--radius-md)" }}
              />
              {filteredImages[lightboxIndex].caption && (
                <p
                  className="mt-4 text-center"
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "var(--text-base)",
                    color: "rgba(255,255,255,0.8)",
                  }}
                >
                  {filteredImages[lightboxIndex].caption}
                </p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
