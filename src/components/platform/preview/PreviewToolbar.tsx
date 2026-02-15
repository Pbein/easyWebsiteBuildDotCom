"use client";

import { useState, useRef, useEffect } from "react";
import {
  Monitor,
  Tablet,
  Smartphone,
  Download,
  Shuffle,
  Camera,
  Share2,
  Check,
  X,
} from "lucide-react";
import posthog from "posthog-js";

interface PreviewToolbarProps {
  businessName: string;
  viewport: "desktop" | "tablet" | "mobile";
  onViewportChange: (viewport: "desktop" | "tablet" | "mobile") => void;
  onExport?: () => void;
  isExporting?: boolean;
  onScreenshot?: () => void;
  isCapturing?: boolean;
  activeVariant?: "A" | "B";
  onVariantChange?: (variant: "A" | "B") => void;
  activePresetName?: string | null;
  onShare?: () => void;
  isGeneratingShareLink?: boolean;
  shareUrl?: string | null;
  onShareModalClose?: () => void;
}

const viewportOptions: {
  id: "desktop" | "tablet" | "mobile";
  icon: typeof Monitor;
  label: string;
}[] = [
  { id: "desktop", icon: Monitor, label: "Desktop" },
  { id: "tablet", icon: Tablet, label: "Tablet" },
  { id: "mobile", icon: Smartphone, label: "Mobile" },
];

export function PreviewToolbar({
  businessName,
  viewport,
  onViewportChange,
  onExport,
  isExporting = false,
  onScreenshot,
  isCapturing = false,
  activeVariant,
  onVariantChange,
  activePresetName,
  onShare,
  isGeneratingShareLink = false,
  shareUrl,
  onShareModalClose,
}: PreviewToolbarProps): React.ReactElement {
  const [copied, setCopied] = useState(false);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Close popover on outside click
  useEffect(() => {
    if (!shareUrl) return;
    function handleClickOutside(e: MouseEvent): void {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        onShareModalClose?.();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [shareUrl, onShareModalClose]);

  const handleCopy = async (): Promise<void> => {
    if (!shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      posthog.capture("share_link_copied", { share_url: shareUrl });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const input = document.createElement("input");
      input.value = shareUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
      setCopied(true);
      posthog.capture("share_link_copied", { share_url: shareUrl });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="flex h-12 shrink-0 items-center justify-between border-b border-[rgba(255,255,255,0.06)] bg-[#0d0e14] px-4">
      {/* Business name */}
      <div className="flex items-center gap-3">
        <span
          className="text-sm font-semibold text-white"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          {businessName}
        </span>
        <span className="rounded-full bg-[#3ecfb4]/10 px-2 py-0.5 text-[10px] font-medium text-[#3ecfb4]">
          Preview
        </span>
        {activePresetName && (
          <span className="rounded-full bg-[#e8a849]/10 px-2 py-0.5 text-[10px] font-medium text-[#e8a849]">
            {activePresetName}
          </span>
        )}
      </div>

      {/* Viewport toggles */}
      <div className="flex items-center gap-1 rounded-lg bg-[rgba(255,255,255,0.04)] p-0.5">
        {viewportOptions.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => {
              if (viewport !== id) {
                posthog.capture("viewport_switched", {
                  from_viewport: viewport,
                  to_viewport: id,
                });
              }
              onViewportChange(id);
            }}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:ring-[#e8a849] focus-visible:outline-none ${
              viewport === id
                ? "bg-[rgba(255,255,255,0.08)] text-white"
                : "text-[#9496a8] hover:text-white"
            }`}
            title={label}
          >
            <Icon className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">{label}</span>
          </button>
        ))}
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-2">
        {activeVariant && onVariantChange && (
          <div className="flex items-center gap-1 rounded-lg bg-[rgba(255,255,255,0.04)] p-0.5">
            <Shuffle className="mx-1.5 h-3.5 w-3.5 text-[#6b6d80]" />
            {(["A", "B"] as const).map((v) => (
              <button
                key={v}
                onClick={() => onVariantChange(v)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:ring-[#e8a849] focus-visible:outline-none ${
                  activeVariant === v
                    ? "bg-[rgba(232,168,73,0.15)] text-[#e8a849]"
                    : "text-[#9496a8] hover:text-white"
                }`}
                title={`Theme Variant ${v}`}
              >
                {v}
              </button>
            ))}
          </div>
        )}
        <button
          onClick={onScreenshot}
          disabled={!onScreenshot || isCapturing}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:ring-[#e8a849] focus-visible:outline-none ${
            onScreenshot && !isCapturing
              ? "cursor-pointer text-[#3ecfb4] hover:bg-[rgba(62,207,180,0.1)]"
              : "cursor-not-allowed text-[#9496a8] opacity-50"
          }`}
          title={isCapturing ? "Capturing..." : "Take Screenshot"}
        >
          <Camera className={`h-3.5 w-3.5 ${isCapturing ? "animate-pulse" : ""}`} />
          <span className="hidden sm:inline">{isCapturing ? "Capturing..." : "Screenshot"}</span>
        </button>

        {/* Share button + popover */}
        <div className="relative">
          <button
            onClick={onShare}
            disabled={!onShare || isGeneratingShareLink}
            className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:ring-[#e8a849] focus-visible:outline-none ${
              onShare && !isGeneratingShareLink
                ? "cursor-pointer text-[#e8a849] hover:bg-[rgba(232,168,73,0.1)]"
                : "cursor-not-allowed text-[#9496a8] opacity-50"
            }`}
            title={isGeneratingShareLink ? "Generating link..." : "Share Preview"}
          >
            <Share2 className={`h-3.5 w-3.5 ${isGeneratingShareLink ? "animate-pulse" : ""}`} />
            <span className="hidden sm:inline">
              {isGeneratingShareLink ? "Sharing..." : "Share"}
            </span>
          </button>

          {/* Share popover */}
          {shareUrl && (
            <div
              ref={popoverRef}
              className="absolute top-full right-0 z-50 mt-2 w-80 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#12131a] p-4 shadow-2xl"
            >
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs font-semibold text-white">Share Link</span>
                <button
                  onClick={onShareModalClose}
                  className="p-0.5 text-[#6b6d80] transition-colors hover:text-white"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={shareUrl}
                  className="flex-1 rounded-lg border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.04)] px-3 py-2 font-mono text-xs text-[#c0c1cc] outline-none"
                  onFocus={(e) => e.target.select()}
                />
                <button
                  onClick={() => void handleCopy()}
                  className={`flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition-all ${
                    copied
                      ? "bg-[#3ecfb4]/15 text-[#3ecfb4]"
                      : "bg-[#e8a849]/15 text-[#e8a849] hover:bg-[#e8a849]/25"
                  }`}
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      Copied!
                    </>
                  ) : (
                    "Copy"
                  )}
                </button>
              </div>
              <p className="mt-2.5 text-[10px] text-[#6b6d80]">
                Anyone with this link can view your customized preview.
              </p>
            </div>
          )}
        </div>

        <button
          onClick={onExport}
          disabled={!onExport || isExporting}
          className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:ring-[#e8a849] focus-visible:outline-none ${
            onExport && !isExporting
              ? "cursor-pointer text-[#3ecfb4] hover:bg-[rgba(62,207,180,0.1)]"
              : "cursor-not-allowed text-[#9496a8] opacity-50"
          }`}
          title={isExporting ? "Exporting..." : "Download as ZIP"}
        >
          <Download className={`h-3.5 w-3.5 ${isExporting ? "animate-pulse" : ""}`} />
          <span className="hidden sm:inline">{isExporting ? "Exporting..." : "Export"}</span>
        </button>
      </div>
    </div>
  );
}
