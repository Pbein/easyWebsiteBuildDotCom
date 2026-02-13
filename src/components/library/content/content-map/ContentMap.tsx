"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { tokensToCSSProperties } from "@/lib/theme/token-map";
import type { ContentMapProps, ContactInfo } from "./content-map.types";

const SPACING_MAP = {
  none: "0",
  sm: "var(--space-tight)",
  md: "var(--space-component)",
  lg: "var(--space-section)",
  xl: "calc(var(--space-section) * 1.5)",
} as const;

/* ------------------------------------------------------------------ */
/*  Map placeholder (stylized area when no embed URL provided)         */
/* ------------------------------------------------------------------ */

function MapPlaceholder({
  address,
  height = "400px",
  borderRadius = "0px",
}: {
  address?: string;
  height?: string;
  borderRadius?: string;
}): React.ReactElement {
  return (
    <div
      className="relative flex w-full flex-col items-center justify-center overflow-hidden"
      style={{
        height,
        borderRadius,
        background: `
          radial-gradient(circle at 30% 40%, var(--color-surface-elevated) 0%, transparent 50%),
          radial-gradient(circle at 70% 60%, var(--color-surface-elevated) 0%, transparent 50%),
          linear-gradient(180deg, var(--color-surface) 0%, var(--color-background) 100%)
        `,
      }}
    >
      {/* Grid pattern overlay */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(var(--color-border-light) 1px, transparent 1px),
            linear-gradient(90deg, var(--color-border-light) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
          opacity: 0.5,
        }}
      />

      {/* Decorative road lines */}
      <div
        className="pointer-events-none absolute"
        style={{
          width: "60%",
          height: "2px",
          backgroundColor: "var(--color-border)",
          opacity: 0.3,
          top: "45%",
          left: "20%",
          transform: "rotate(-8deg)",
        }}
      />
      <div
        className="pointer-events-none absolute"
        style={{
          width: "40%",
          height: "2px",
          backgroundColor: "var(--color-border)",
          opacity: 0.3,
          top: "55%",
          left: "10%",
          transform: "rotate(5deg)",
        }}
      />
      <div
        className="pointer-events-none absolute"
        style={{
          width: "2px",
          height: "50%",
          backgroundColor: "var(--color-border)",
          opacity: 0.25,
          top: "25%",
          left: "55%",
          transform: "rotate(3deg)",
        }}
      />

      {/* Pin icon + address */}
      <div className="relative z-10 flex flex-col items-center gap-3">
        <div
          className="flex items-center justify-center"
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "var(--radius-full)",
            backgroundColor: "var(--color-primary)",
            color: "var(--color-background)",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
          }}
        >
          <MapPin size={26} />
        </div>
        {address && (
          <p
            className="max-w-xs text-center"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-sm)",
              fontWeight: "var(--weight-medium)",
              color: "var(--color-text-secondary)",
              lineHeight: "var(--leading-normal)",
            }}
          >
            {address}
          </p>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Map embed (iframe or placeholder)                                  */
/* ------------------------------------------------------------------ */

function MapArea({
  mapEmbedUrl,
  address,
  height = "400px",
  borderRadius = "0px",
}: {
  mapEmbedUrl?: string;
  address?: string;
  height?: string;
  borderRadius?: string;
}): React.ReactElement {
  if (mapEmbedUrl) {
    return (
      <div className="relative w-full overflow-hidden" style={{ height, borderRadius }}>
        <iframe
          src={mapEmbedUrl}
          title="Location map"
          className="h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          allowFullScreen
        />
      </div>
    );
  }

  return <MapPlaceholder address={address} height={height} borderRadius={borderRadius} />;
}

/* ------------------------------------------------------------------ */
/*  Contact info card                                                  */
/* ------------------------------------------------------------------ */

function ContactInfoCard({
  contactInfo,
  animate,
  isInView,
  delay = 0,
  showCard = true,
}: {
  contactInfo: ContactInfo;
  animate: boolean;
  isInView: boolean;
  delay?: number;
  showCard?: boolean;
}): React.ReactElement {
  const hasAny =
    contactInfo.address ||
    contactInfo.phone ||
    contactInfo.email ||
    (contactInfo.hours && contactInfo.hours.length > 0);

  if (!hasAny) return <></>;

  return (
    <motion.div
      className={cn("flex flex-col gap-5", showCard && "p-5 md:p-8")}
      style={
        showCard
          ? {
              backgroundColor: "var(--color-surface)",
              borderRadius: "var(--radius-xl)",
              border: "1px solid var(--color-border-light)",
              boxShadow: "var(--shadow-md)",
            }
          : undefined
      }
      initial={animate ? { opacity: 0, y: 20 } : false}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {/* Address */}
      {contactInfo.address && (
        <div className="flex items-start gap-4">
          <div
            className="flex flex-shrink-0 items-center justify-center"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "var(--radius-lg)",
              backgroundColor: "var(--color-surface-elevated)",
              color: "var(--color-primary)",
            }}
          >
            <MapPin size={20} />
          </div>
          <div className="min-w-0">
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-sm)",
                fontWeight: "var(--weight-semibold)",
                color: "var(--color-text)",
                marginBottom: "2px",
              }}
            >
              Address
            </p>
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-base)",
                lineHeight: "var(--leading-relaxed)",
                color: "var(--color-text-secondary)",
              }}
            >
              {contactInfo.address}
            </p>
          </div>
        </div>
      )}

      {/* Phone */}
      {contactInfo.phone && (
        <div className="flex items-start gap-4">
          <div
            className="flex flex-shrink-0 items-center justify-center"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "var(--radius-lg)",
              backgroundColor: "var(--color-surface-elevated)",
              color: "var(--color-primary)",
            }}
          >
            <Phone size={20} />
          </div>
          <div className="min-w-0">
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-sm)",
                fontWeight: "var(--weight-semibold)",
                color: "var(--color-text)",
                marginBottom: "2px",
              }}
            >
              Phone
            </p>
            <a
              href={`tel:${contactInfo.phone.replace(/[^\d+]/g, "")}`}
              className="transition-colors"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-base)",
                lineHeight: "var(--leading-relaxed)",
                color: "var(--color-primary)",
                textDecoration: "none",
                transitionDuration: "var(--transition-fast)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--color-primary-light)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--color-primary)";
              }}
            >
              {contactInfo.phone}
            </a>
          </div>
        </div>
      )}

      {/* Email */}
      {contactInfo.email && (
        <div className="flex items-start gap-4">
          <div
            className="flex flex-shrink-0 items-center justify-center"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "var(--radius-lg)",
              backgroundColor: "var(--color-surface-elevated)",
              color: "var(--color-primary)",
            }}
          >
            <Mail size={20} />
          </div>
          <div className="min-w-0">
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-sm)",
                fontWeight: "var(--weight-semibold)",
                color: "var(--color-text)",
                marginBottom: "2px",
              }}
            >
              Email
            </p>
            <a
              href={`mailto:${contactInfo.email}`}
              className="transition-colors"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-base)",
                lineHeight: "var(--leading-relaxed)",
                color: "var(--color-primary)",
                textDecoration: "none",
                transitionDuration: "var(--transition-fast)",
                wordBreak: "break-all",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--color-primary-light)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--color-primary)";
              }}
            >
              {contactInfo.email}
            </a>
          </div>
        </div>
      )}

      {/* Hours */}
      {contactInfo.hours && contactInfo.hours.length > 0 && (
        <div className="flex items-start gap-4">
          <div
            className="flex flex-shrink-0 items-center justify-center"
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "var(--radius-lg)",
              backgroundColor: "var(--color-surface-elevated)",
              color: "var(--color-primary)",
            }}
          >
            <Clock size={20} />
          </div>
          <div className="min-w-0">
            <p
              style={{
                fontFamily: "var(--font-body)",
                fontSize: "var(--text-sm)",
                fontWeight: "var(--weight-semibold)",
                color: "var(--color-text)",
                marginBottom: "2px",
              }}
            >
              Hours
            </p>
            <div className="flex flex-col gap-0.5">
              {contactInfo.hours.map((line, i) => (
                <p
                  key={i}
                  style={{
                    fontFamily: "var(--font-body)",
                    fontSize: "var(--text-base)",
                    lineHeight: "var(--leading-relaxed)",
                    color: "var(--color-text-secondary)",
                  }}
                >
                  {line}
                </p>
              ))}
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  CTA Button                                                         */
/* ------------------------------------------------------------------ */

function CtaButton({
  cta,
  animate,
  isInView,
  delay = 0,
}: {
  cta: ContentMapProps["cta"];
  animate: boolean;
  isInView: boolean;
  delay?: number;
}): React.ReactElement | null {
  if (!cta) return null;

  const isPrimary = !cta.variant || cta.variant === "primary";
  const isOutline = cta.variant === "outline";

  return (
    <motion.div
      initial={animate ? { opacity: 0, y: 16 } : false}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
      transition={{ duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      <a
        href={cta.href}
        target={cta.external ? "_blank" : "_self"}
        rel={cta.external ? "noopener noreferrer" : undefined}
        className="inline-flex items-center gap-2 transition-all"
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "var(--text-base)",
          fontWeight: "var(--weight-semibold)",
          padding: "12px 28px",
          borderRadius: "var(--radius-lg)",
          backgroundColor: isPrimary
            ? "var(--color-primary)"
            : isOutline
              ? "transparent"
              : "var(--color-surface-elevated)",
          color: isPrimary ? "var(--color-background)" : "var(--color-primary)",
          border: isOutline
            ? "2px solid var(--color-primary)"
            : isPrimary
              ? "none"
              : "1px solid var(--color-border-light)",
          textDecoration: "none",
          transitionProperty: "transform, box-shadow, opacity",
          transitionDuration: "var(--transition-fast)",
          transitionTimingFunction: "var(--ease-default)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = "var(--shadow-md)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "none";
        }}
      >
        <MapPin size={16} />
        {cta.text}
      </a>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Full-width variant                                                 */
/* ------------------------------------------------------------------ */

function FullWidthVariant({
  mapEmbedUrl,
  contactInfo,
  cta,
  animate,
  isInView,
}: {
  mapEmbedUrl?: string;
  contactInfo?: ContactInfo;
  cta?: ContentMapProps["cta"];
  animate: boolean;
  isInView: boolean;
}): React.ReactElement {
  return (
    <div className="relative">
      {/* Map area */}
      <motion.div
        initial={animate ? { opacity: 0, scale: 0.98 } : false}
        animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.98 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <MapArea
          mapEmbedUrl={mapEmbedUrl}
          address={contactInfo?.address}
          height="450px"
          borderRadius="var(--radius-xl)"
        />
      </motion.div>

      {/* Contact info overlay card */}
      {contactInfo && (
        <div className="relative -mt-16 px-4 md:absolute md:-bottom-6 md:left-6 md:mt-0 md:max-w-sm md:px-0 lg:left-8">
          <ContactInfoCard
            contactInfo={contactInfo}
            animate={animate}
            isInView={isInView}
            delay={0.2}
            showCard={true}
          />
        </div>
      )}

      {/* CTA positioned below overlay card on mobile, top-right on desktop */}
      {cta && (
        <div className="mt-5 px-4 md:absolute md:right-6 md:bottom-6 md:mt-0 md:px-0 lg:right-8">
          <CtaButton cta={cta} animate={animate} isInView={isInView} delay={0.3} />
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Split-with-info variant                                            */
/* ------------------------------------------------------------------ */

function SplitWithInfoVariant({
  mapEmbedUrl,
  contactInfo,
  cta,
  animate,
  isInView,
}: {
  mapEmbedUrl?: string;
  contactInfo?: ContactInfo;
  cta?: ContentMapProps["cta"];
  animate: boolean;
  isInView: boolean;
}): React.ReactElement {
  return (
    <div className="grid items-stretch gap-6 md:grid-cols-2 md:gap-10">
      {/* Map side */}
      <motion.div
        initial={animate ? { opacity: 0, x: -24 } : false}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -24 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      >
        <MapArea
          mapEmbedUrl={mapEmbedUrl}
          address={contactInfo?.address}
          height="100%"
          borderRadius="var(--radius-xl)"
        />
      </motion.div>

      {/* Info side */}
      <motion.div
        className="flex flex-col justify-center"
        initial={animate ? { opacity: 0, x: 24 } : false}
        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 24 }}
        transition={{
          duration: 0.6,
          delay: 0.1,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {contactInfo && (
          <ContactInfoCard
            contactInfo={contactInfo}
            animate={animate}
            isInView={isInView}
            delay={0.2}
            showCard={false}
          />
        )}
        {cta && (
          <div className="mt-6">
            <CtaButton cta={cta} animate={animate} isInView={isInView} delay={0.35} />
          </div>
        )}
      </motion.div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Embedded variant                                                   */
/* ------------------------------------------------------------------ */

function EmbeddedVariant({
  mapEmbedUrl,
  contactInfo,
  cta,
  animate,
  isInView,
}: {
  mapEmbedUrl?: string;
  contactInfo?: ContactInfo;
  cta?: ContentMapProps["cta"];
  animate: boolean;
  isInView: boolean;
}): React.ReactElement {
  return (
    <div
      className="overflow-hidden"
      style={{
        borderRadius: "var(--radius-xl)",
        border: "1px solid var(--color-border-light)",
        boxShadow: "var(--shadow-sm)",
      }}
    >
      {/* Map */}
      <motion.div
        initial={animate ? { opacity: 0 } : false}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <MapArea
          mapEmbedUrl={mapEmbedUrl}
          address={contactInfo?.address}
          height="300px"
          borderRadius="0px"
        />
      </motion.div>

      {/* Compact info bar */}
      {contactInfo && (
        <motion.div
          className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between md:gap-6 md:p-6"
          style={{
            backgroundColor: "var(--color-surface)",
          }}
          initial={animate ? { opacity: 0, y: 12 } : false}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{
            duration: 0.4,
            delay: 0.15,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <div className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center md:gap-6">
            {/* Address */}
            {contactInfo.address && (
              <span
                className="inline-flex items-center gap-2"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-sm)",
                  color: "var(--color-text-secondary)",
                }}
              >
                <MapPin size={15} style={{ color: "var(--color-primary)", flexShrink: 0 }} />
                {contactInfo.address}
              </span>
            )}

            {/* Phone */}
            {contactInfo.phone && (
              <a
                href={`tel:${contactInfo.phone.replace(/[^\d+]/g, "")}`}
                className="inline-flex items-center gap-2 transition-colors"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-sm)",
                  color: "var(--color-text-secondary)",
                  textDecoration: "none",
                  transitionDuration: "var(--transition-fast)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--color-primary)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--color-text-secondary)";
                }}
              >
                <Phone size={15} style={{ color: "var(--color-primary)", flexShrink: 0 }} />
                {contactInfo.phone}
              </a>
            )}

            {/* Email */}
            {contactInfo.email && (
              <a
                href={`mailto:${contactInfo.email}`}
                className="inline-flex items-center gap-2 transition-colors"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-sm)",
                  color: "var(--color-text-secondary)",
                  textDecoration: "none",
                  transitionDuration: "var(--transition-fast)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--color-primary)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--color-text-secondary)";
                }}
              >
                <Mail size={15} style={{ color: "var(--color-primary)", flexShrink: 0 }} />
                {contactInfo.email}
              </a>
            )}

            {/* Hours (first line only in compact mode) */}
            {contactInfo.hours && contactInfo.hours.length > 0 && (
              <span
                className="inline-flex items-center gap-2"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-sm)",
                  color: "var(--color-text-secondary)",
                }}
              >
                <Clock size={15} style={{ color: "var(--color-primary)", flexShrink: 0 }} />
                {contactInfo.hours[0]}
                {contactInfo.hours.length > 1 && (
                  <span
                    style={{
                      color: "var(--color-text-secondary)",
                      opacity: 0.6,
                    }}
                  >
                    (+{contactInfo.hours.length - 1} more)
                  </span>
                )}
              </span>
            )}
          </div>

          {/* CTA in compact bar */}
          {cta && (
            <div className="flex-shrink-0">
              <a
                href={cta.href}
                target={cta.external ? "_blank" : "_self"}
                rel={cta.external ? "noopener noreferrer" : undefined}
                className="inline-flex items-center gap-2 transition-all"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-sm)",
                  fontWeight: "var(--weight-semibold)",
                  padding: "8px 20px",
                  borderRadius: "var(--radius-md)",
                  backgroundColor: "var(--color-primary)",
                  color: "var(--color-background)",
                  textDecoration: "none",
                  whiteSpace: "nowrap",
                  transitionProperty: "transform, box-shadow",
                  transitionDuration: "var(--transition-fast)",
                  transitionTimingFunction: "var(--ease-default)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-1px)";
                  e.currentTarget.style.boxShadow = "var(--shadow-sm)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                <MapPin size={14} />
                {cta.text}
              </a>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

/**
 * ContentMap — display a location map with contact information.
 *
 * Variants:
 *  - "full-width"      — full-width map with contact info overlay card
 *  - "split-with-info" — side-by-side map + contact info, stacks on mobile
 *  - "embedded"        — compact embedded map with info bar below
 */
export function ContentMap({
  id,
  className,
  theme,
  animate = true,
  spacing = "lg",
  headline,
  subheadline,
  contactInfo,
  cta,
  mapEmbedUrl,
  variant = "split-with-info",
}: ContentMapProps): React.ReactElement {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const themeStyle = theme ? (tokensToCSSProperties(theme) as React.CSSProperties) : undefined;

  const paddingY = SPACING_MAP[spacing];

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
      aria-label={headline ?? "Location"}
    >
      <div className="mx-auto px-6" style={{ maxWidth: "var(--container-max)" }}>
        {/* Section header */}
        {(headline || subheadline) && (
          <motion.div
            className="mb-8 text-center md:mb-16"
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
                  maxWidth: "640px",
                }}
              >
                {subheadline}
              </p>
            )}
          </motion.div>
        )}

        {/* Variant rendering */}
        {variant === "full-width" && (
          <FullWidthVariant
            mapEmbedUrl={mapEmbedUrl}
            contactInfo={contactInfo}
            cta={cta}
            animate={animate}
            isInView={isInView}
          />
        )}

        {variant === "split-with-info" && (
          <SplitWithInfoVariant
            mapEmbedUrl={mapEmbedUrl}
            contactInfo={contactInfo}
            cta={cta}
            animate={animate}
            isInView={isInView}
          />
        )}

        {variant === "embedded" && (
          <EmbeddedVariant
            mapEmbedUrl={mapEmbedUrl}
            contactInfo={contactInfo}
            cta={cta}
            animate={animate}
            isInView={isInView}
          />
        )}
      </div>
    </section>
  );
}
