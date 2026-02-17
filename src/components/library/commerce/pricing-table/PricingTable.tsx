"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { tokensToCSSProperties } from "@/lib/theme/token-map";
import type { PricingTableProps, PricingPlan, PricingFeature } from "./pricing-table.types";
import { SPACING_MAP } from "@/components/library/spacing";

/* ------------------------------------------------------------------ */
/*  Shared CTA button                                                  */
/* ------------------------------------------------------------------ */

function PlanCTA({
  plan,
  isFeatured,
}: {
  plan: PricingPlan;
  isFeatured: boolean;
}): React.ReactElement | null {
  if (!plan.cta) return null;

  const variant = plan.cta.variant ?? "primary";
  const isPrimary = variant === "primary";
  const isOutline = variant === "outline";
  const isGhost = variant === "ghost";

  return (
    <a
      href={plan.cta.href}
      target={plan.cta.external ? "_blank" : undefined}
      rel={plan.cta.external ? "noopener noreferrer" : undefined}
      className="mt-6 inline-flex w-full items-center justify-center px-5 py-3 text-center transition-all md:px-7 md:py-3.5"
      style={{
        fontFamily: "var(--font-body)",
        fontSize: "var(--text-base)",
        fontWeight: "var(--weight-semibold)",
        borderRadius: "var(--radius-lg)",
        transitionDuration: "var(--transition-base)",
        transitionTimingFunction: "var(--ease-default)",
        ...(isFeatured
          ? {
              backgroundColor: "var(--color-background)",
              color: "var(--color-primary)",
              border: "2px solid var(--color-background)",
            }
          : isPrimary
            ? {
                backgroundColor: "var(--color-primary)",
                color: "var(--color-text-on-primary)",
                border: "2px solid var(--color-primary)",
              }
            : isOutline
              ? {
                  backgroundColor: "transparent",
                  color: "var(--color-primary)",
                  border: "2px solid var(--color-primary)",
                }
              : isGhost
                ? {
                    backgroundColor: "transparent",
                    color: "var(--color-primary)",
                    border: "2px solid transparent",
                  }
                : {
                    backgroundColor: "var(--color-surface-elevated)",
                    color: "var(--color-text)",
                    border: "2px solid var(--color-border)",
                  }),
      }}
      onMouseEnter={(e) => {
        if (isFeatured) {
          e.currentTarget.style.opacity = "0.9";
        } else {
          e.currentTarget.style.opacity = "0.85";
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.opacity = "1";
      }}
    >
      {plan.cta.text}
    </a>
  );
}

/* ------------------------------------------------------------------ */
/*  Feature list item with check/x icon                                */
/* ------------------------------------------------------------------ */

function FeatureRow({
  feature,
  isFeatured,
}: {
  feature: PricingFeature;
  isFeatured: boolean;
}): React.ReactElement {
  return (
    <li className="flex items-start gap-3 py-1.5">
      <span
        className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center"
        style={{
          borderRadius: "var(--radius-full)",
          backgroundColor: feature.included
            ? isFeatured
              ? "rgba(255,255,255,0.2)"
              : "var(--color-primary-light)"
            : isFeatured
              ? "rgba(255,255,255,0.1)"
              : "var(--color-surface-elevated)",
        }}
      >
        {feature.included ? (
          <Check
            size={12}
            style={{
              color: isFeatured ? "var(--color-text-on-primary)" : "var(--color-primary)",
            }}
          />
        ) : (
          <X
            size={12}
            style={{
              color: isFeatured ? "rgba(255,255,255,0.4)" : "var(--color-text-secondary)",
              opacity: 0.6,
            }}
          />
        )}
      </span>
      <span
        style={{
          fontFamily: "var(--font-body)",
          fontSize: "var(--text-sm)",
          lineHeight: "var(--leading-relaxed)",
          color: feature.included
            ? isFeatured
              ? "var(--color-text-on-primary)"
              : "var(--color-text)"
            : isFeatured
              ? "rgba(255,255,255,0.4)"
              : "var(--color-text-secondary)",
          textDecoration: feature.included ? "none" : "line-through",
          opacity: feature.included ? 1 : 0.6,
        }}
      >
        {feature.text}
      </span>
    </li>
  );
}

/* ------------------------------------------------------------------ */
/*  Simple variant — equal-weight plan cards                           */
/* ------------------------------------------------------------------ */

function SimplePlanCard({
  plan,
  index,
  animate,
  isInView,
}: {
  plan: PricingPlan;
  index: number;
  animate: boolean;
  isInView: boolean;
}): React.ReactElement {
  return (
    <motion.div
      className="flex flex-col p-5 md:p-8"
      style={{
        backgroundColor: "var(--color-surface)",
        borderRadius: "var(--radius-xl)",
        border: "1px solid var(--color-border-light)",
        boxShadow: "var(--shadow-sm)",
        transitionProperty: "transform, box-shadow, border-color",
        transitionDuration: "var(--transition-base)",
        transitionTimingFunction: "var(--ease-default)",
      }}
      initial={animate ? { opacity: 0, y: 24 } : false}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "var(--shadow-lg)";
        e.currentTarget.style.borderColor = "var(--color-border)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = "var(--shadow-sm)";
        e.currentTarget.style.borderColor = "var(--color-border-light)";
      }}
    >
      {/* Plan name */}
      <h3
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: "var(--text-xl)",
          fontWeight: "var(--weight-semibold)",
          lineHeight: "var(--leading-tight)",
          color: "var(--color-text)",
        }}
      >
        {plan.name}
      </h3>

      {/* Description */}
      {plan.description && (
        <p
          className="mt-2"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-sm)",
            lineHeight: "var(--leading-relaxed)",
            color: "var(--color-text-secondary)",
          }}
        >
          {plan.description}
        </p>
      )}

      {/* Price */}
      <div className="mt-4 flex items-baseline gap-1">
        <span
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(var(--text-2xl), 5vw, var(--text-4xl))",
            fontWeight: "var(--weight-bold)",
            lineHeight: "var(--leading-tight)",
            letterSpacing: "var(--tracking-tight)",
            color: "var(--color-text)",
          }}
        >
          {plan.price}
        </span>
        {plan.period && (
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-base)",
              color: "var(--color-text-secondary)",
            }}
          >
            {plan.period}
          </span>
        )}
      </div>

      {/* Divider */}
      <div
        className="my-5"
        style={{
          height: "1px",
          backgroundColor: "var(--color-border-light)",
        }}
      />

      {/* Features */}
      <ul className="flex flex-1 flex-col gap-0.5">
        {plan.features.map((feature, i) => (
          <FeatureRow key={i} feature={feature} isFeatured={false} />
        ))}
      </ul>

      {/* CTA */}
      <PlanCTA plan={plan} isFeatured={false} />
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Featured variant — one plan elevated with primary bg               */
/* ------------------------------------------------------------------ */

function FeaturedPlanCard({
  plan,
  index,
  animate,
  isInView,
}: {
  plan: PricingPlan;
  index: number;
  animate: boolean;
  isInView: boolean;
}): React.ReactElement {
  const isFeatured = plan.featured ?? false;

  return (
    <motion.div
      className={cn("relative flex flex-col p-5 md:p-8", isFeatured && "z-10 md:-my-4 md:py-12")}
      style={{
        backgroundColor: isFeatured ? "var(--color-primary)" : "var(--color-surface)",
        borderRadius: "var(--radius-xl)",
        border: isFeatured
          ? "2px solid var(--color-primary-dark)"
          : "1px solid var(--color-border-light)",
        boxShadow: isFeatured ? "var(--shadow-lg)" : "var(--shadow-sm)",
        transitionProperty: "transform, box-shadow",
        transitionDuration: "var(--transition-base)",
        transitionTimingFunction: "var(--ease-default)",
      }}
      initial={animate ? { opacity: 0, y: 24 } : false}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
        e.currentTarget.style.boxShadow = "var(--shadow-lg)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow = isFeatured ? "var(--shadow-lg)" : "var(--shadow-sm)";
      }}
    >
      {/* "Most Popular" badge */}
      {isFeatured && (
        <span
          className="absolute left-1/2 -translate-x-1/2"
          style={{
            top: "-12px",
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-xs)",
            fontWeight: "var(--weight-semibold)",
            color: "var(--color-primary)",
            backgroundColor: "var(--color-background)",
            borderRadius: "var(--radius-full)",
            padding: "4px 16px",
            boxShadow: "var(--shadow-md)",
            letterSpacing: "0.05em",
            textTransform: "uppercase",
            whiteSpace: "nowrap",
          }}
        >
          Most Popular
        </span>
      )}

      {/* Plan name */}
      <h3
        style={{
          fontFamily: "var(--font-heading)",
          fontSize: "var(--text-xl)",
          fontWeight: "var(--weight-semibold)",
          lineHeight: "var(--leading-tight)",
          color: isFeatured ? "var(--color-text-on-primary)" : "var(--color-text)",
        }}
      >
        {plan.name}
      </h3>

      {/* Description */}
      {plan.description && (
        <p
          className="mt-2"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: "var(--text-sm)",
            lineHeight: "var(--leading-relaxed)",
            color: isFeatured ? "rgba(255,255,255,0.8)" : "var(--color-text-secondary)",
          }}
        >
          {plan.description}
        </p>
      )}

      {/* Price */}
      <div className="mt-4 flex items-baseline gap-1">
        <span
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "clamp(var(--text-2xl), 5vw, var(--text-4xl))",
            fontWeight: "var(--weight-bold)",
            lineHeight: "var(--leading-tight)",
            letterSpacing: "var(--tracking-tight)",
            color: isFeatured ? "var(--color-text-on-primary)" : "var(--color-text)",
          }}
        >
          {plan.price}
        </span>
        {plan.period && (
          <span
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-base)",
              color: isFeatured ? "rgba(255,255,255,0.7)" : "var(--color-text-secondary)",
            }}
          >
            {plan.period}
          </span>
        )}
      </div>

      {/* Divider */}
      <div
        className="my-5"
        style={{
          height: "1px",
          backgroundColor: isFeatured ? "rgba(255,255,255,0.2)" : "var(--color-border-light)",
        }}
      />

      {/* Features */}
      <ul className="flex flex-1 flex-col gap-0.5">
        {plan.features.map((feature, i) => (
          <FeatureRow key={i} feature={feature} isFeatured={isFeatured} />
        ))}
      </ul>

      {/* CTA */}
      <PlanCTA plan={plan} isFeatured={isFeatured} />
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Comparison variant — table layout                                  */
/* ------------------------------------------------------------------ */

function ComparisonTable({
  plans,
  animate,
  isInView,
}: {
  plans: PricingPlan[];
  animate: boolean;
  isInView: boolean;
}): React.ReactElement {
  /* Collect all unique feature texts across all plans */
  const allFeatureTexts: string[] = [];
  for (const plan of plans) {
    for (const feature of plan.features) {
      if (!allFeatureTexts.includes(feature.text)) {
        allFeatureTexts.push(feature.text);
      }
    }
  }

  /* For each plan, build a lookup: featureText → included */
  function isFeatureIncluded(plan: PricingPlan, featureText: string): boolean {
    const found = plan.features.find((f) => f.text === featureText);
    return found ? found.included : false;
  }

  return (
    <motion.div
      className="w-full overflow-x-auto"
      initial={animate ? { opacity: 0, y: 24 } : false}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      <table
        className="w-full border-collapse"
        style={{
          fontFamily: "var(--font-body)",
          minWidth: plans.length > 3 ? "640px" : undefined,
        }}
      >
        {/* Header row: empty cell + plan names */}
        <thead>
          <tr>
            <th
              className="p-3 text-left md:p-4"
              style={{
                borderBottom: "2px solid var(--color-border)",
                width: "40%",
              }}
            />
            {plans.map((plan, i) => (
              <th
                key={i}
                className="p-3 text-center md:p-4"
                style={{
                  borderBottom: "2px solid var(--color-border)",
                  backgroundColor: plan.featured ? "var(--color-primary)" : "transparent",
                  borderRadius: plan.featured
                    ? i === 0
                      ? "var(--radius-lg) 0 0 0"
                      : i === plans.length - 1
                        ? "0 var(--radius-lg) 0 0"
                        : "0"
                    : "0",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "var(--text-lg)",
                    fontWeight: "var(--weight-bold)",
                    color: plan.featured ? "var(--color-text-on-primary)" : "var(--color-text)",
                  }}
                >
                  {plan.name}
                </div>
                <div
                  className="mt-1 flex items-baseline justify-center gap-1"
                  style={{
                    fontFamily: "var(--font-heading)",
                    fontSize: "var(--text-2xl)",
                    fontWeight: "var(--weight-bold)",
                    color: plan.featured ? "var(--color-text-on-primary)" : "var(--color-text)",
                  }}
                >
                  {plan.price}
                  {plan.period && (
                    <span
                      style={{
                        fontSize: "var(--text-sm)",
                        fontWeight: "var(--weight-medium)",
                        color: plan.featured
                          ? "rgba(255,255,255,0.7)"
                          : "var(--color-text-secondary)",
                      }}
                    >
                      {plan.period}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        {/* Feature rows */}
        <tbody>
          {allFeatureTexts.map((featureText, rowIdx) => (
            <tr
              key={rowIdx}
              style={{
                backgroundColor: rowIdx % 2 === 0 ? "transparent" : "var(--color-surface)",
              }}
            >
              <td
                className="p-3 md:p-4"
                style={{
                  fontSize: "var(--text-sm)",
                  color: "var(--color-text)",
                  borderBottom: "1px solid var(--color-border-light)",
                }}
              >
                {featureText}
              </td>
              {plans.map((plan, colIdx) => {
                const included = isFeatureIncluded(plan, featureText);
                return (
                  <td
                    key={colIdx}
                    className="p-3 text-center md:p-4"
                    style={{
                      borderBottom: "1px solid var(--color-border-light)",
                      backgroundColor: plan.featured ? "var(--color-primary-light)" : "transparent",
                    }}
                  >
                    {included ? (
                      <Check
                        size={18}
                        className="mx-auto"
                        style={{ color: "var(--color-primary)" }}
                      />
                    ) : (
                      <X
                        size={18}
                        className="mx-auto"
                        style={{ color: "var(--color-text-secondary)", opacity: 0.4 }}
                      />
                    )}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>

        {/* CTA row */}
        <tfoot>
          <tr>
            <td className="p-3 md:p-4" />
            {plans.map((plan, i) => (
              <td key={i} className="p-3 text-center md:p-4">
                {plan.cta && (
                  <a
                    href={plan.cta.href}
                    target={plan.cta.external ? "_blank" : undefined}
                    rel={plan.cta.external ? "noopener noreferrer" : undefined}
                    className="inline-flex items-center justify-center px-5 py-2.5 transition-all"
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "var(--text-sm)",
                      fontWeight: "var(--weight-semibold)",
                      borderRadius: "var(--radius-lg)",
                      transitionDuration: "var(--transition-base)",
                      transitionTimingFunction: "var(--ease-default)",
                      backgroundColor: plan.featured
                        ? "var(--color-primary)"
                        : "var(--color-surface-elevated)",
                      color: plan.featured ? "var(--color-text-on-primary)" : "var(--color-text)",
                      border: plan.featured
                        ? "2px solid var(--color-primary)"
                        : "2px solid var(--color-border)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.opacity = "0.85";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.opacity = "1";
                    }}
                  >
                    {plan.cta.text}
                  </a>
                )}
              </td>
            ))}
          </tr>
        </tfoot>
      </table>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Columns map for responsive grid                                    */
/* ------------------------------------------------------------------ */

function getGridClass(planCount: number): string {
  if (planCount <= 1) return "grid-cols-1";
  if (planCount === 2) return "grid-cols-1 md:grid-cols-2";
  if (planCount === 3) return "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";
  return "grid-cols-1 md:grid-cols-2 lg:grid-cols-4";
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

/**
 * PricingTable — display pricing plans with features, comparison, and CTAs.
 *
 * Variants:
 *  - "simple"      Clean card grid, all plans equal weight
 *  - "featured"    One plan (featured: true) is visually elevated with primary color
 *  - "comparison"  Table layout comparing features across plans with checkmarks
 */
export function PricingTable({
  id,
  className,
  theme,
  animate = true,
  spacing = "lg",
  headline,
  subheadline,
  plans,
  variant = "simple",
}: PricingTableProps): React.ReactElement {
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
      aria-label={headline ?? "Pricing"}
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

        {/* Simple variant */}
        {variant === "simple" && (
          <div className={cn("grid items-stretch gap-4 md:gap-8", getGridClass(plans.length))}>
            {plans.map((plan, i) => (
              <SimplePlanCard key={i} plan={plan} index={i} animate={animate} isInView={isInView} />
            ))}
          </div>
        )}

        {/* Featured variant */}
        {variant === "featured" && (
          <div className={cn("grid items-center gap-4 md:gap-8", getGridClass(plans.length))}>
            {plans.map((plan, i) => (
              <FeaturedPlanCard
                key={i}
                plan={plan}
                index={i}
                animate={animate}
                isInView={isInView}
              />
            ))}
          </div>
        )}

        {/* Comparison variant */}
        {variant === "comparison" && (
          <div
            className="overflow-hidden"
            style={{
              borderRadius: "var(--radius-xl)",
              border: "1px solid var(--color-border-light)",
              boxShadow: "var(--shadow-sm)",
              backgroundColor: "var(--color-background)",
            }}
          >
            <ComparisonTable plans={plans} animate={animate} isInView={isInView} />
          </div>
        )}
      </div>
    </section>
  );
}
