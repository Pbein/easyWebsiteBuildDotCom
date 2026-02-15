import { ImageResponse } from "next/og";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";

export const runtime = "edge";

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL!;

export async function GET(request: Request): Promise<Response> {
  const { searchParams } = new URL(request.url);
  const shareId = searchParams.get("id");

  let businessName = "EasyWebsiteBuild";
  let tagline = "AI-Powered Website Builder";
  let siteType = "";
  let primaryColor = "#e8a849";

  if (shareId) {
    try {
      const client = new ConvexHttpClient(CONVEX_URL);
      const preview = await client.query(api.sharedPreviews.getSharedPreview, {
        shareId,
      });
      if (preview) {
        businessName = preview.businessName;
        tagline = preview.tagline || "";
        siteType = preview.siteType;
        primaryColor = preview.primaryColor;
      }
    } catch {
      // Fall through to generic card
    }
  }

  return new ImageResponse(
    <div
      style={{
        width: "1200",
        height: "630",
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
        padding: "60px",
        background: "linear-gradient(145deg, #0a0b0f 0%, #141520 50%, #0d0e14 100%)",
        fontFamily: "system-ui, sans-serif",
      }}
    >
      {/* Accent bar at top */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "6px",
          background: `linear-gradient(90deg, ${primaryColor}, #3ecfb4)`,
        }}
      />

      {/* Decorative gradient orb */}
      <div
        style={{
          position: "absolute",
          top: "80px",
          right: "80px",
          width: "200px",
          height: "200px",
          borderRadius: "50%",
          background: `radial-gradient(circle, ${primaryColor}30, transparent 70%)`,
        }}
      />

      {/* Site type pill */}
      {siteType && (
        <div
          style={{
            display: "flex",
            marginBottom: "20px",
          }}
        >
          <span
            style={{
              padding: "8px 18px",
              borderRadius: "20px",
              fontSize: "16px",
              fontWeight: 600,
              color: primaryColor,
              backgroundColor: `${primaryColor}18`,
              border: `1px solid ${primaryColor}40`,
            }}
          >
            {siteType}
          </span>
        </div>
      )}

      {/* Business name */}
      <div
        style={{
          fontSize: businessName.length > 20 ? "56px" : "72px",
          fontWeight: 800,
          color: "#ffffff",
          lineHeight: 1.1,
          marginBottom: tagline ? "16px" : "40px",
          maxWidth: "900px",
        }}
      >
        {businessName}
      </div>

      {/* Tagline */}
      {tagline && (
        <div
          style={{
            fontSize: "24px",
            color: "rgba(255, 255, 255, 0.6)",
            lineHeight: 1.4,
            marginBottom: "40px",
            maxWidth: "700px",
          }}
        >
          {tagline}
        </div>
      )}

      {/* EWB branding */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "12px",
        }}
      >
        {/* Logo mark */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "32px",
            height: "32px",
            borderRadius: "8px",
            background: "linear-gradient(135deg, #e8a849, #3ecfb4)",
            fontWeight: 800,
            fontSize: "18px",
            color: "#0a0b0f",
          }}
        >
          E
        </div>
        <span
          style={{
            fontSize: "16px",
            fontWeight: 500,
            color: "rgba(255, 255, 255, 0.4)",
          }}
        >
          Built with easywebsitebuild.com
        </span>
      </div>
    </div>,
    {
      width: 1200,
      height: 630,
    }
  );
}
