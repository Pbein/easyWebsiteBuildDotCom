"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useInView } from "framer-motion";
import { cn } from "@/lib/utils";
import { tokensToCSSProperties } from "@/lib/theme/token-map";
import type { MediaGalleryProps } from "./media-gallery.types";
import { SPACING_MAP } from "@/components/library/spacing";
import { SectionHeader, FilterTabs } from "./shared";
import { GridLayout } from "./variants/grid";
import { MasonryLayout } from "./variants/masonry";
import { LightboxOverlay } from "./variants/lightbox-overlay";

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
  const [masonryColumns, setMasonryColumns] = useState<number>(columns);

  // Responsive masonry columns
  useEffect(() => {
    function updateColumns(): void {
      const w = window.innerWidth;
      if (w < 640) setMasonryColumns(1);
      else if (w < 1024) setMasonryColumns(Math.min(columns, 2));
      else setMasonryColumns(columns);
    }
    updateColumns();
    window.addEventListener("resize", updateColumns);
    return () => window.removeEventListener("resize", updateColumns);
  }, [columns]);

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
        <SectionHeader
          headline={headline}
          subheadline={subheadline}
          animate={animate}
          isInView={isInView}
        />

        {enableFilter && (
          <FilterTabs
            categories={categories}
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
        )}

        {/* Grid / Lightbox variant */}
        {(variant === "grid" || variant === "lightbox") && (
          <GridLayout
            images={filteredImages}
            columns={columns}
            showCaptions={showCaptions}
            animate={animate}
            isInView={isInView}
            isLightbox={variant === "lightbox"}
            onClickImage={openLightbox}
          />
        )}

        {/* Masonry variant */}
        {variant === "masonry" && (
          <MasonryLayout
            images={filteredImages}
            masonryColumns={masonryColumns}
            showCaptions={showCaptions}
            animate={animate}
            isInView={isInView}
          />
        )}
      </div>

      {/* Lightbox overlay */}
      <LightboxOverlay
        images={filteredImages}
        lightboxIndex={lightboxIndex}
        onClose={() => setLightboxIndex(null)}
        onPrev={() =>
          setLightboxIndex((prev) =>
            prev !== null ? (prev - 1 + filteredImages.length) % filteredImages.length : null
          )
        }
        onNext={() =>
          setLightboxIndex((prev) => (prev !== null ? (prev + 1) % filteredImages.length : null))
        }
      />
    </section>
  );
}
