"use client";

import { useState } from "react";

/**
 * "Built with EasyWebsiteBuild" badge — fixed bottom-right overlay.
 * Uses inline styles so it works in any context (share page, HTML export).
 */
export function BuiltWithBadge(): React.ReactElement {
  const [hovered, setHovered] = useState(false);

  return (
    <a
      href="https://easywebsitebuild.com?utm_source=shared_preview&utm_medium=badge&utm_campaign=viral"
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "fixed",
        bottom: "16px",
        right: "16px",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        gap: "8px",
        padding: "8px 14px",
        backgroundColor: "rgba(13, 14, 20, 0.85)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderRadius: "10px",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        textDecoration: "none",
        transition: "all 0.2s ease",
        boxShadow: hovered ? "0 4px 20px rgba(232, 168, 73, 0.2)" : "0 2px 12px rgba(0, 0, 0, 0.3)",
        transform: hovered ? "translateY(-1px)" : "none",
      }}
    >
      {/* "E" gradient logo mark */}
      <span
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "22px",
          height: "22px",
          borderRadius: "6px",
          background: "linear-gradient(135deg, #e8a849, #3ecfb4)",
          fontWeight: 800,
          fontSize: "13px",
          color: "#0a0b0f",
          lineHeight: 1,
          flexShrink: 0,
        }}
      >
        E
      </span>
      <span
        style={{
          fontSize: "12px",
          fontWeight: 500,
          color: hovered ? "#e8a849" : "rgba(255, 255, 255, 0.7)",
          whiteSpace: "nowrap",
          transition: "color 0.2s ease",
        }}
      >
        Built with EasyWebsiteBuild
      </span>
    </a>
  );
}
