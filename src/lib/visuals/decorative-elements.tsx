"use client";

/**
 * Decorative SVG elements for visual richness.
 *
 * These are purely visual accents positioned behind content.
 * All colors derived from CSS custom properties (theme tokens).
 */

interface DecorativeProps {
  className?: string;
  style?: React.CSSProperties;
  color?: string;
  opacity?: number;
}

/**
 * Organic blob shape — used for warm/organic brands.
 */
export function BlobAccent({
  className,
  style,
  color = "var(--color-primary)",
  opacity = 0.08,
}: DecorativeProps): React.ReactElement {
  return (
    <svg
      className={className}
      style={{ ...style, opacity }}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M45.3,-51.2C58.3,-41.5,68.5,-26.8,70.1,-11.2C71.6,4.4,64.5,20.8,54.1,33.5C43.7,46.2,30,55.2,14.5,59.5C-1,63.8,-18.3,63.5,-33.3,56.8C-48.3,50.1,-61.1,37.1,-66.2,21.3C-71.4,5.6,-69,-12.9,-60.3,-26.6C-51.6,-40.3,-36.7,-49.3,-21.7,-57.9C-6.8,-66.5,8.2,-74.8,22.1,-72C36,-69.1,32.3,-60.8,45.3,-51.2Z"
        transform="translate(100 100)"
        fill={color}
      />
    </svg>
  );
}

/**
 * Dot grid pattern — used for tech/modern brands.
 */
export function DotGrid({
  className,
  style,
  color = "var(--color-primary)",
  opacity = 0.06,
}: DecorativeProps): React.ReactElement {
  const dotElements: React.ReactElement[] = [];
  for (let row = 0; row < 6; row++) {
    for (let col = 0; col < 6; col++) {
      dotElements.push(
        <circle key={`${row}-${col}`} cx={col * 20 + 10} cy={row * 20 + 10} r="2" fill={color} />
      );
    }
  }

  return (
    <svg
      className={className}
      style={{ ...style, opacity }}
      viewBox="0 0 130 130"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {dotElements}
    </svg>
  );
}

/**
 * Geometric frame — used for professional/structured brands.
 */
export function GeometricFrame({
  className,
  style,
  color = "var(--color-primary)",
  opacity = 0.06,
}: DecorativeProps): React.ReactElement {
  return (
    <svg
      className={className}
      style={{ ...style, opacity }}
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="10" y="10" width="180" height="180" fill="none" stroke={color} strokeWidth="1" />
      <rect x="30" y="30" width="140" height="140" fill="none" stroke={color} strokeWidth="0.5" />
      <line x1="10" y1="10" x2="30" y2="30" stroke={color} strokeWidth="0.5" />
      <line x1="190" y1="10" x2="170" y2="30" stroke={color} strokeWidth="0.5" />
      <line x1="10" y1="190" x2="30" y2="170" stroke={color} strokeWidth="0.5" />
      <line x1="190" y1="190" x2="170" y2="170" stroke={color} strokeWidth="0.5" />
    </svg>
  );
}

/**
 * Diamond accent — used for bold/energetic brands.
 */
export function DiamondAccent({
  className,
  style,
  color = "var(--color-primary)",
  opacity = 0.08,
}: DecorativeProps): React.ReactElement {
  return (
    <svg
      className={className}
      style={{ ...style, opacity }}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <polygon points="50,5 95,50 50,95 5,50" fill="none" stroke={color} strokeWidth="1.5" />
      <polygon points="50,20 80,50 50,80 20,50" fill={color} fillOpacity="0.3" />
    </svg>
  );
}

/**
 * Circle accent — used for friendly/approachable brands.
 */
export function CircleAccent({
  className,
  style,
  color = "var(--color-primary)",
  opacity = 0.06,
}: DecorativeProps): React.ReactElement {
  return (
    <svg
      className={className}
      style={{ ...style, opacity }}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <circle cx="50" cy="50" r="45" fill="none" stroke={color} strokeWidth="1" />
      <circle cx="50" cy="50" r="30" fill="none" stroke={color} strokeWidth="0.5" />
      <circle cx="50" cy="50" r="15" fill={color} fillOpacity="0.15" />
    </svg>
  );
}
