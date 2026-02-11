"use client";

import { Monitor, Tablet, Smartphone, Download, Shuffle, Camera } from "lucide-react";

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
}: PreviewToolbarProps): React.ReactElement {
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
      </div>

      {/* Viewport toggles */}
      <div className="flex items-center gap-1 rounded-lg bg-[rgba(255,255,255,0.04)] p-0.5">
        {viewportOptions.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => onViewportChange(id)}
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
