import type { Metadata } from "next";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../../convex/_generated/api";
import type { Id } from "../../../../convex/_generated/dataModel";
import { PublishedSiteClient } from "./PublishedSiteClient";

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL!;

interface PublishedSitePageProps {
  params: Promise<{ projectId: string }>;
}

export async function generateMetadata({ params }: PublishedSitePageProps): Promise<Metadata> {
  const { projectId } = await params;

  try {
    const client = new ConvexHttpClient(CONVEX_URL);
    const project = await client.query(api.projects.getPublishedProject, {
      projectId: projectId as Id<"projects">,
    });

    if (!project) {
      return {
        title: "Site Not Found",
        description: "This site may have been unpublished or removed.",
      };
    }

    const spec = project.sessionId
      ? await client.query(api.siteSpecs.getSiteSpec, {
          sessionId: project.sessionId,
        })
      : null;

    const businessName = spec?.businessName ?? project.name;
    const tagline = spec?.tagline ?? project.tagline ?? "";
    const title = businessName;
    const description = tagline || `${businessName} — professional website`;

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: "website",
        siteName: businessName,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
      },
      robots: {
        index: true,
        follow: true,
      },
    };
  } catch {
    return {
      title: "Site Not Found",
      description: "This site may have been unpublished or removed.",
    };
  }
}

export default async function PublishedSitePage({
  params,
}: PublishedSitePageProps): Promise<React.ReactElement> {
  const { projectId } = await params;
  return <PublishedSiteClient projectId={projectId} />;
}
