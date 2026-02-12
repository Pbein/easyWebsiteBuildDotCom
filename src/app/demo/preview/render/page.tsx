"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";
import { useQuery } from "convex/react";
import { api } from "../../../../../convex/_generated/api";
import { AssemblyRenderer } from "@/lib/assembly";
import type { SiteIntentDocument } from "@/lib/assembly";
import { capturePreviewScreenshot } from "@/lib/screenshot";
import type { ThemeTokens } from "@/lib/theme";
import { Loader2 } from "lucide-react";

/**
 * PostMessage types for parent ↔ iframe communication.
 * All messages use `ewb:` prefix to avoid collisions.
 */
interface SetThemeMessage {
  type: "ewb:set-theme";
  theme: ThemeTokens;
}

interface SetPageMessage {
  type: "ewb:set-page";
  activePage: string;
}

interface RequestScreenshotMessage {
  type: "ewb:request-screenshot";
  requestId: string;
}

type ParentMessage = SetThemeMessage | SetPageMessage | RequestScreenshotMessage;

function isParentMessage(data: unknown): data is ParentMessage {
  return (
    typeof data === "object" &&
    data !== null &&
    "type" in data &&
    typeof (data as { type: unknown }).type === "string" &&
    (data as { type: string }).type.startsWith("ewb:")
  );
}

function RenderContent(): React.ReactElement {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session");

  const [activePage, setActivePage] = useState("/");
  const [themeOverride, setThemeOverride] = useState<ThemeTokens | undefined>(undefined);
  const renderRef = useRef<HTMLDivElement>(null);
  const readySentRef = useRef(false);

  const rawSpec = useQuery(api.siteSpecs.getSiteSpec, sessionId ? { sessionId } : "skip");

  // Map Convex doc to SiteIntentDocument
  const spec: SiteIntentDocument | null =
    rawSpec != null
      ? {
          sessionId: rawSpec.sessionId,
          siteType: rawSpec.siteType,
          conversionGoal: rawSpec.conversionGoal,
          personalityVector: rawSpec.personalityVector,
          businessName: rawSpec.businessName,
          tagline: rawSpec.tagline ?? "",
          pages: rawSpec.pages as SiteIntentDocument["pages"],
          metadata: (rawSpec.metadata as SiteIntentDocument["metadata"]) ?? {
            generatedAt: rawSpec.createdAt,
            method: "deterministic" as const,
          },
          emotionalGoals: rawSpec.emotionalGoals as string[] | undefined,
          voiceProfile: rawSpec.voiceProfile as string | undefined,
          brandArchetype: rawSpec.brandArchetype as string | undefined,
          antiReferences: rawSpec.antiReferences as string[] | undefined,
          narrativePrompts: rawSpec.narrativePrompts as Record<string, string> | undefined,
        }
      : null;

  // Send render-ready signal once spec is loaded
  useEffect(() => {
    if (spec && !readySentRef.current) {
      readySentRef.current = true;
      window.parent.postMessage({ type: "ewb:render-ready" }, "*");
    }
  }, [spec]);

  // Handle screenshot capture
  const handleScreenshotRequest = useCallback(async (requestId: string): Promise<void> => {
    const element = renderRef.current;
    if (!element) {
      window.parent.postMessage(
        { type: "ewb:screenshot-error", requestId, error: "Render element not found" },
        "*"
      );
      return;
    }

    try {
      const result = await capturePreviewScreenshot(element);
      window.parent.postMessage({ type: "ewb:screenshot-result", requestId, result }, "*");
    } catch (err) {
      window.parent.postMessage(
        {
          type: "ewb:screenshot-error",
          requestId,
          error: err instanceof Error ? err.message : "Screenshot capture failed",
        },
        "*"
      );
    }
  }, []);

  // Listen for messages from parent
  useEffect(() => {
    function handleMessage(event: MessageEvent): void {
      // Only accept messages from same origin (parent preview page)
      if (event.origin !== window.location.origin) return;

      const data = event.data;
      if (!isParentMessage(data)) return;

      switch (data.type) {
        case "ewb:set-theme":
          setThemeOverride(data.theme);
          break;
        case "ewb:set-page":
          setActivePage(data.activePage);
          break;
        case "ewb:request-screenshot":
          void handleScreenshotRequest(data.requestId);
          break;
      }
    }

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [handleScreenshotRequest]);

  // Loading
  if (rawSpec === undefined || !spec) {
    return (
      <div className="flex h-screen items-center justify-center" style={{ background: "#fff" }}>
        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
      </div>
    );
  }

  // Not found
  if (rawSpec === null) {
    return (
      <div className="flex h-screen items-center justify-center" style={{ background: "#fff" }}>
        <p className="text-sm text-gray-500">Preview not found</p>
      </div>
    );
  }

  return (
    <div ref={renderRef}>
      <AssemblyRenderer
        spec={spec}
        activePage={activePage}
        previewMode
        themeOverride={themeOverride}
      />
    </div>
  );
}

const RenderContentNoSSR = dynamic(() => Promise.resolve({ default: RenderContent }), {
  ssr: false,
  loading: () => (
    <div className="flex h-screen items-center justify-center" style={{ background: "#fff" }}>
      <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
    </div>
  ),
});

export default function PreviewRenderPage(): React.ReactElement {
  return <RenderContentNoSSR />;
}
