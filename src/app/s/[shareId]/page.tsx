import type { Metadata } from "next";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";
import { SharedPreviewClient } from "./SharedPreviewClient";

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL!;

interface SharePageProps {
  params: Promise<{ shareId: string }>;
}

export async function generateMetadata({ params }: SharePageProps): Promise<Metadata> {
  const { shareId } = await params;

  try {
    const client = new ConvexHttpClient(CONVEX_URL);
    const preview = await client.query(api.sharedPreviews.getSharedPreview, {
      shareId,
    });

    if (!preview) {
      return {
        title: "Preview Not Found | EasyWebsiteBuild",
        description: "This preview link is no longer available.",
      };
    }

    const title = `${preview.businessName} | Built with EasyWebsiteBuild`;
    const description =
      preview.tagline ||
      `Check out ${preview.businessName} — a ${preview.siteType} website built with EasyWebsiteBuild.`;
    const ogImageUrl = `${process.env.NEXT_PUBLIC_SITE_URL || "https://easywebsitebuild.com"}/api/og?id=${shareId}`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "website",
        images: [
          {
            url: ogImageUrl,
            width: 1200,
            height: 630,
            alt: `${preview.businessName} preview`,
          },
        ],
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
        images: [ogImageUrl],
      },
    };
  } catch {
    return {
      title: "Shared Preview | EasyWebsiteBuild",
      description: "View a website preview built with EasyWebsiteBuild.",
    };
  }
}

export default async function SharePage({ params }: SharePageProps): Promise<React.ReactElement> {
  const { shareId } = await params;
  return <SharedPreviewClient shareId={shareId} />;
}
