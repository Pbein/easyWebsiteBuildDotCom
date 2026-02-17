"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { useAuth } from "@clerk/nextjs";
import { type ReactNode, useState } from "react";

const hasClerk = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

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

  if (hasClerk) {
    return (
      <ConvexProviderWithClerk client={client} useAuth={useAuth}>
        {children}
      </ConvexProviderWithClerk>
    );
  }

  return <ConvexProvider client={client}>{children}</ConvexProvider>;
}
