"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { type ReactNode, useState } from "react";

function getConvexClient(): ConvexReactClient | null {
  if (typeof window === "undefined") return null;
  const url = process.env.NEXT_PUBLIC_CONVEX_URL;
  if (!url) return null;
  return new ConvexReactClient(url);
}

export function ConvexClientProvider({ children }: { children: ReactNode }): React.ReactElement {
  const [client] = useState(getConvexClient);

  if (!client) {
    return <>{children}</>;
  }

  return <ConvexProvider client={client}>{children}</ConvexProvider>;
}
