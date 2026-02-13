"use client";

import Link from "next/link";
import posthog from "posthog-js";
import type { ComponentProps } from "react";

interface TrackedLinkProps extends ComponentProps<typeof Link> {
  eventName?: string;
  eventProperties?: Record<string, unknown>;
}

/**
 * A Next.js Link component that tracks click events with PostHog.
 * Use for CTA buttons and important navigation links you want to track.
 */
export function TrackedLink({
  eventName = "link_clicked",
  eventProperties = {},
  onClick,
  children,
  ...props
}: TrackedLinkProps): React.ReactElement {
  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>): void => {
    posthog.capture(eventName, {
      href: typeof props.href === "string" ? props.href : props.href?.pathname,
      ...eventProperties,
    });

    // Call the original onClick if provided
    if (onClick) {
      onClick(e);
    }
  };

  return (
    <Link {...props} onClick={handleClick}>
      {children}
    </Link>
  );
}
