"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { tokensToCSSProperties } from "@/lib/theme/token-map";
import { SPACING_MAP } from "@/components/library/spacing";
import type { ContentComparisonProps, ComparisonRow } from "./content-comparison.types";

/**
 * Renders a boolean or string cell value.
 * `true` → green check, `false` → muted x, string → text.
 */
function CellValue({ value }: { value: string | boolean }): React.ReactElement {
  if (typeof value === "boolean") {
    return value ? (
      <span
        className="inline-flex h-6 w-6 items-center justify-center"
        style={{
          color: "var(--color-primary)",
        }}
      >
        <Check size={18} strokeWidth={2.5} />
      </span>
    ) : (
      <span
        className="inline-flex h-6 w-6 items-center justify-center"
        style={{
          color: "var(--color-text-secondary)",
          opacity: 0.4,
        }}
      >
        <X size={18} strokeWidth={2} />
      </span>
    );
  }

  return (
    <span
      style={{
        fontFamily: "var(--font-body)",
        fontSize: "var(--text-sm)",
        fontWeight: "var(--weight-medium)",
        color: "var(--color-text)",
      }}
    >
      {value}
    </span>
  );
}

/* ──────────────────────────────────────────────
 * TABLE VARIANT
 * ────────────────────────────────────────────── */

function TableVariant({
  columns,
  rows,
  animate,
  isInView,
}: {
  columns: ContentComparisonProps["columns"];
  rows: ComparisonRow[];
  animate: boolean;
  isInView: boolean;
}): React.ReactElement {
  return (
    <motion.div
      className="-mx-6 overflow-x-auto px-6 md:mx-0 md:px-0"
      initial={animate ? { opacity: 0, y: 24 } : false}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
    >
      <table
        className="w-full border-collapse"
        style={{
          minWidth: `${(columns.length + 1) * 140}px`,
        }}
      >
        {/* Header row */}
        <thead>
          <tr>
            {/* Empty corner cell for the feature column */}
            <th
              className="sticky left-0 z-10 p-3 text-left md:p-4"
              style={{
                backgroundColor: "var(--color-background)",
                borderBottom: "2px solid var(--color-border)",
              }}
            />
            {columns.map((col, ci) => (
              <th
                key={ci}
                className="p-3 text-center md:p-4"
                style={{
                  fontFamily: "var(--font-heading)",
                  fontSize: "var(--text-base)",
                  fontWeight: "var(--weight-bold)",
                  letterSpacing: "var(--tracking-tight)",
                  color: col.highlighted ? "var(--color-text-on-primary)" : "var(--color-text)",
                  backgroundColor: col.highlighted
                    ? "var(--color-primary)"
                    : "var(--color-surface)",
                  borderBottom: "2px solid var(--color-border)",
                  borderTopLeftRadius: ci === 0 ? "var(--radius-lg)" : "0",
                  borderTopRightRadius: ci === columns.length - 1 ? "var(--radius-lg)" : "0",
                }}
              >
                {col.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, ri) => (
            <tr
              key={ri}
              style={{
                backgroundColor: ri % 2 === 0 ? "var(--color-background)" : "var(--color-surface)",
              }}
            >
              {/* Feature name — sticky on mobile */}
              <td
                className="sticky left-0 z-10 p-3 md:p-4"
                style={{
                  fontFamily: "var(--font-body)",
                  fontSize: "var(--text-sm)",
                  fontWeight: "var(--weight-medium)",
                  color: "var(--color-text)",
                  backgroundColor:
                    ri % 2 === 0 ? "var(--color-background)" : "var(--color-surface)",
                  borderBottom: "1px solid var(--color-border-light)",
                  whiteSpace: "nowrap",
                }}
              >
                {row.feature}
              </td>
              {/* Values */}
              {row.values.map((val, vi) => (
                <td
                  key={vi}
                  className="p-3 text-center md:p-4"
                  style={{
                    borderBottom: "1px solid var(--color-border-light)",
                    backgroundColor: columns[vi]?.highlighted
                      ? "color-mix(in srgb, var(--color-primary) 6%, transparent)"
                      : undefined,
                  }}
                >
                  <CellValue value={val} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </motion.div>
  );
}

/* ──────────────────────────────────────────────
 * SIDE-BY-SIDE VARIANT
 * ────────────────────────────────────────────── */

function SideBySideVariant({
  columns,
  rows,
  animate,
  isInView,
}: {
  columns: ContentComparisonProps["columns"];
  rows: ComparisonRow[];
  animate: boolean;
  isInView: boolean;
}): React.ReactElement {
  const gridCols =
    columns.length <= 2
      ? "md:grid-cols-2"
      : columns.length === 3
        ? "md:grid-cols-3"
        : "md:grid-cols-2 lg:grid-cols-4";

  return (
    <div className={cn("grid gap-4 md:gap-8", gridCols)}>
      {columns.map((col, ci) => (
        <motion.div
          key={ci}
          className="relative flex flex-col overflow-hidden transition-all"
          style={{
            backgroundColor: col.highlighted
              ? "var(--color-surface-elevated)"
              : "var(--color-surface)",
            borderRadius: "var(--radius-xl)",
            border: col.highlighted
              ? "2px solid var(--color-primary)"
              : "1px solid var(--color-border-light)",
            boxShadow: col.highlighted ? "var(--shadow-lg)" : "var(--shadow-sm)",
            transitionProperty: "transform, box-shadow, border-color",
            transitionDuration: "var(--transition-base)",
            transitionTimingFunction: "var(--ease-default)",
          }}
          initial={animate ? { opacity: 0, y: 24 } : false}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
          transition={{
            duration: 0.5,
            delay: ci * 0.1 + 0.15,
            ease: [0.22, 1, 0.36, 1],
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-4px)";
            e.currentTarget.style.boxShadow = "var(--shadow-lg)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = col.highlighted
              ? "var(--shadow-lg)"
              : "var(--shadow-sm)";
          }}
        >
          {/* Column header */}
          <div
            className="px-5 py-4 md:px-8 md:py-5"
            style={{
              backgroundColor: col.highlighted
                ? "var(--color-primary)"
                : "var(--color-surface-elevated)",
              borderBottom: "1px solid var(--color-border-light)",
            }}
          >
            <h3
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "var(--text-xl)",
                fontWeight: "var(--weight-bold)",
                lineHeight: "var(--leading-tight)",
                color: col.highlighted ? "var(--color-text-on-primary)" : "var(--color-text)",
              }}
            >
              {col.name}
            </h3>
          </div>

          {/* Feature list */}
          <ul className="flex flex-1 flex-col px-5 py-4 md:px-8 md:py-6">
            {rows.map((row, ri) => {
              const val = row.values[ci];
              const included =
                typeof val === "boolean" ? val : typeof val === "string" && val.length > 0;

              return (
                <li
                  key={ri}
                  className="flex items-center gap-3 py-2.5"
                  style={{
                    borderBottom:
                      ri < rows.length - 1 ? "1px solid var(--color-border-light)" : "none",
                  }}
                >
                  {typeof val === "boolean" ? (
                    val ? (
                      <span
                        className="flex h-5 w-5 shrink-0 items-center justify-center"
                        style={{ color: "var(--color-primary)" }}
                      >
                        <Check size={16} strokeWidth={2.5} />
                      </span>
                    ) : (
                      <span
                        className="flex h-5 w-5 shrink-0 items-center justify-center"
                        style={{
                          color: "var(--color-text-secondary)",
                          opacity: 0.35,
                        }}
                      >
                        <X size={16} strokeWidth={2} />
                      </span>
                    )
                  ) : (
                    <span
                      className="flex h-5 w-5 shrink-0 items-center justify-center"
                      style={{ color: "var(--color-primary)" }}
                    >
                      <Check size={16} strokeWidth={2.5} />
                    </span>
                  )}

                  <span
                    style={{
                      fontFamily: "var(--font-body)",
                      fontSize: "var(--text-sm)",
                      lineHeight: "var(--leading-normal)",
                      color: included ? "var(--color-text)" : "var(--color-text-secondary)",
                      opacity: included ? 1 : 0.5,
                      textDecoration: included ? "none" : "line-through",
                    }}
                  >
                    {typeof val === "string" && val.length > 0
                      ? `${row.feature} — ${val}`
                      : row.feature}
                  </span>
                </li>
              );
            })}
          </ul>
        </motion.div>
      ))}
    </div>
  );
}

/* ──────────────────────────────────────────────
 * CHECKMARK MATRIX VARIANT
 * ────────────────────────────────────────────── */

function CheckmarkMatrixVariant({
  columns,
  rows,
  animate,
  isInView,
}: {
  columns: ContentComparisonProps["columns"];
  rows: ComparisonRow[];
  animate: boolean;
  isInView: boolean;
}): React.ReactElement {
  return (
    <motion.div
      className="overflow-hidden"
      style={{
        borderRadius: "var(--radius-xl)",
        border: "1px solid var(--color-border-light)",
        boxShadow: "var(--shadow-sm)",
      }}
      initial={animate ? { opacity: 0, y: 24 } : false}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 24 }}
      transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Header row */}
      <div
        className="grid items-end gap-0"
        style={{
          gridTemplateColumns: `minmax(140px, 2fr) repeat(${columns.length}, minmax(80px, 1fr))`,
          backgroundColor: "var(--color-surface-elevated)",
          borderBottom: "2px solid var(--color-border)",
        }}
      >
        {/* Empty corner */}
        <div className="p-3 md:p-4" />

        {columns.map((col, ci) => (
          <div
            key={ci}
            className="flex flex-col items-center justify-end p-3 text-center md:p-4"
            style={{
              backgroundColor: col.highlighted ? "var(--color-primary)" : undefined,
              borderTopLeftRadius: ci === 0 ? "0" : "0",
              borderTopRightRadius: ci === columns.length - 1 ? "0" : "0",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-heading)",
                fontSize: "var(--text-sm)",
                fontWeight: "var(--weight-bold)",
                letterSpacing: "var(--tracking-tight)",
                color: col.highlighted ? "var(--color-text-on-primary)" : "var(--color-text)",
                textTransform: "uppercase",
              }}
            >
              {col.name}
            </span>
          </div>
        ))}
      </div>

      {/* Data rows */}
      {rows.map((row, ri) => (
        <motion.div
          key={ri}
          className="grid items-center gap-0"
          style={{
            gridTemplateColumns: `minmax(140px, 2fr) repeat(${columns.length}, minmax(80px, 1fr))`,
            backgroundColor: ri % 2 === 0 ? "var(--color-background)" : "var(--color-surface)",
            borderBottom: ri < rows.length - 1 ? "1px solid var(--color-border-light)" : "none",
          }}
          initial={animate ? { opacity: 0 } : false}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{
            duration: 0.3,
            delay: ri * 0.04 + 0.2,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          {/* Feature name */}
          <div
            className="p-3 md:p-4"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: "var(--text-sm)",
              fontWeight: "var(--weight-medium)",
              color: "var(--color-text)",
            }}
          >
            {row.feature}
          </div>

          {/* Values */}
          {row.values.map((val, vi) => (
            <div
              key={vi}
              className="flex items-center justify-center p-3 md:p-4"
              style={{
                backgroundColor: columns[vi]?.highlighted
                  ? "color-mix(in srgb, var(--color-primary) 5%, transparent)"
                  : undefined,
              }}
            >
              <CellValue value={val} />
            </div>
          ))}
        </motion.div>
      ))}
    </motion.div>
  );
}

/* ──────────────────────────────────────────────
 * MAIN COMPONENT
 * ────────────────────────────────────────────── */

/**
 * ContentComparison — side-by-side feature or plan comparison.
 *
 * Variants:
 *  - "table"             — HTML table with sticky first column, alternating rows
 *  - "side-by-side"      — Card columns listing features with check/x marks
 *  - "checkmark-matrix"  — CSS grid feature matrix with check/x/text values
 */
export function ContentComparison({
  id,
  className,
  theme,
  animate = true,
  spacing = "lg",
  headline,
  subheadline,
  columns,
  rows,
  variant = "table",
}: ContentComparisonProps): React.ReactElement {
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
      aria-label={headline ?? "Comparison"}
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
                  maxWidth: "var(--container-narrow)",
                }}
              >
                {subheadline}
              </p>
            )}
          </motion.div>
        )}

        {/* Variant rendering */}
        {variant === "table" && (
          <TableVariant columns={columns} rows={rows} animate={animate} isInView={isInView} />
        )}

        {variant === "side-by-side" && (
          <SideBySideVariant columns={columns} rows={rows} animate={animate} isInView={isInView} />
        )}

        {variant === "checkmark-matrix" && (
          <CheckmarkMatrixVariant
            columns={columns}
            rows={rows}
            animate={animate}
            isInView={isInView}
          />
        )}
      </div>
    </section>
  );
}
