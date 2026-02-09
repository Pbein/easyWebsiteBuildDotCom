"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { tokensToCSSProperties } from "@/lib/theme/token-map";
import type { ProofTestimonialsProps, Testimonial } from "./proof-testimonials.types";

const SPACING_MAP = {
  none: "0",
  sm: "var(--space-tight)",
  md: "var(--space-component)",
  lg: "var(--space-section)",
  xl: "calc(var(--space-section) * 1.5)",
} as const;

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={16}
          fill={i < rating ? "var(--color-accent)" : "none"}
          stroke={i < rating ? "var(--color-accent)" : "var(--color-border)"}
        />
      ))}
    </div>
  );
}

function TestimonialCard({
  testimonial,
  showRating,
}: {
  testimonial: Testimonial;
  showRating: boolean;
}) {
  return (
    <div
      className="flex h-full flex-col p-5 md:p-8"
      style={{
        backgroundColor: "var(--color-surface)",
        borderRadius: "var(--radius-xl)",
        border: "1px solid var(--color-border-light)",
      }}
    >
      {showRating && testimonial.rating && (
        <div className="mb-4">
          <StarRating rating={testimonial.rating} />
        </div>
      )}

      <blockquote
        className="flex-1"
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "var(--text-lg)",
          lineHeight: "var(--leading-relaxed)",
          color: "var(--color-text)",
          fontStyle: "italic",
        }}
      >
        &ldquo;{testimonial.quote}&rdquo;
      </blockquote>

      <div className="mt-6 flex items-center gap-3">
        {testimonial.avatar ? (
          <Image
            src={testimonial.avatar.src}
            alt={testimonial.avatar.alt}
            width={44}
            height={44}
            className="h-11 w-11 object-cover"
            style={{ borderRadius: "var(--radius-full)" }}
          />
        ) : (
          <div
            className="flex h-11 w-11 items-center justify-center"
            style={{
              borderRadius: "var(--radius-full)",
              backgroundColor: "var(--color-primary)",
              color: "var(--color-text-on-primary, #fff)",
              fontFamily: "var(--font-heading)",
              fontSize: "var(--text-base)",
              fontWeight: "var(--weight-semibold)",
            }}
          >
            {testimonial.name.charAt(0)}
          </div>
        )}
        <div>
          <p
            style={{
              fontFamily: "var(--font-heading)",
              fontSize: "var(--text-base)",
              fontWeight: "var(--weight-semibold)",
              color: "var(--color-text)",
              lineHeight: "var(--leading-tight)",
            }}
          >
            {testimonial.name}
          </p>
          {(testimonial.role || testimonial.company) && (
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-sm)",
                color: "var(--color-text-secondary)",
                lineHeight: "var(--leading-normal)",
              }}
            >
              {[testimonial.role, testimonial.company].filter(Boolean).join(" at ")}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * ProofTestimonials — testimonial carousel.
 *
 * Shows 1 card on mobile, 2 on tablet, 3 on desktop.
 * Navigation arrows and dot indicators.
 */
export function ProofTestimonials({
  id,
  className,
  theme,
  animate = true,
  spacing = "lg",
  headline,
  testimonials,
  showRating = false,
}: ProofTestimonialsProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [page, setPage] = useState(0);
  const [direction, setDirection] = useState(0);
  const [perPage, setPerPage] = useState(3);

  // Responsive perPage: 1 on mobile, 2 on tablet, 3 on desktop
  useEffect(() => {
    function updatePerPage(): void {
      const w = window.innerWidth;
      let next: number;
      if (w < 768) next = 1;
      else if (w < 1024) next = 2;
      else next = 3;
      setPerPage((prev) => {
        if (prev !== next) setPage(0);
        return next;
      });
    }
    updatePerPage();
    window.addEventListener("resize", updatePerPage);
    return () => window.removeEventListener("resize", updatePerPage);
  }, []);

  const themeStyle = theme ? (tokensToCSSProperties(theme) as React.CSSProperties) : undefined;

  const paddingY = SPACING_MAP[spacing];

  const totalPages = Math.ceil(testimonials.length / perPage);

  const goTo = useCallback(
    (newPage: number) => {
      setDirection(newPage > page ? 1 : -1);
      setPage(newPage);
    },
    [page]
  );

  const prev = useCallback(() => {
    goTo(page > 0 ? page - 1 : totalPages - 1);
  }, [page, totalPages, goTo]);

  const next = useCallback(() => {
    goTo(page < totalPages - 1 ? page + 1 : 0);
  }, [page, totalPages, goTo]);

  const visibleTestimonials = testimonials.slice(page * perPage, page * perPage + perPage);

  const slideVariants = {
    enter: (d: number) => ({ x: d > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -300 : 300, opacity: 0 }),
  };

  return (
    <section
      ref={ref}
      id={id}
      className={cn("relative w-full overflow-hidden", className)}
      style={{
        ...themeStyle,
        backgroundColor: "var(--color-background)",
        paddingTop: paddingY,
        paddingBottom: paddingY,
      }}
      aria-label={headline ?? "Testimonials"}
    >
      <div className="mx-auto px-6" style={{ maxWidth: "var(--container-max)" }}>
        {/* Header + nav arrows */}
        <motion.div
          className="mb-6 flex items-end justify-between md:mb-12"
          initial={animate ? { opacity: 0, y: 20 } : false}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div>
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
          </div>

          {totalPages > 1 && (
            <div className="hidden items-center gap-2 md:flex">
              <button
                type="button"
                onClick={prev}
                className="flex h-10 w-10 items-center justify-center transition-colors"
                style={{
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--color-border)",
                  color: "var(--color-text-secondary)",
                  backgroundColor: "transparent",
                  cursor: "pointer",
                  transitionDuration: "var(--transition-fast)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--color-surface)";
                  e.currentTarget.style.color = "var(--color-text)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "var(--color-text-secondary)";
                }}
                aria-label="Previous testimonials"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                type="button"
                onClick={next}
                className="flex h-10 w-10 items-center justify-center transition-colors"
                style={{
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--color-border)",
                  color: "var(--color-text-secondary)",
                  backgroundColor: "transparent",
                  cursor: "pointer",
                  transitionDuration: "var(--transition-fast)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = "var(--color-surface)";
                  e.currentTarget.style.color = "var(--color-text)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = "transparent";
                  e.currentTarget.style.color = "var(--color-text-secondary)";
                }}
                aria-label="Next testimonials"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}
        </motion.div>

        {/* Carousel */}
        <div className="relative min-h-[200px] md:min-h-[280px]">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={page}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {visibleTestimonials.map((t, i) => (
                <TestimonialCard key={page * perPage + i} testimonial={t} showRating={showRating} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dot indicators */}
        {totalPages > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                className="h-2.5 transition-all"
                style={{
                  width: page === i ? "2rem" : "0.625rem",
                  borderRadius: "var(--radius-full)",
                  backgroundColor: page === i ? "var(--color-primary)" : "var(--color-border)",
                  border: "none",
                  cursor: "pointer",
                  transitionDuration: "var(--transition-base)",
                }}
                aria-label={`Go to page ${i + 1}`}
                aria-current={page === i ? "true" : undefined}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
