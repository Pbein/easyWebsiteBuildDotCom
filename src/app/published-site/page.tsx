import type { Metadata } from "next";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../../../convex/_generated/api";
import { PublishedDomainClient } from "./PublishedDomainClient";

const CONVEX_URL = process.env.NEXT_PUBLIC_CONVEX_URL!;

interface PublishedDomainPageProps {
  searchParams: Promise<{ domain?: string }>;
}

export async function generateMetadata({
  searchParams,
}: PublishedDomainPageProps): Promise<Metadata> {
  const { domain } = await searchParams;
  if (!domain) {
    return { title: "Site Not Found" };
  }

  try {
    const client = new ConvexHttpClient(CONVEX_URL);
    const domainRecord = await client.query(api.domains.getDomainByHostname, { domain });

    if (!domainRecord || domainRecord.status !== "active") {
      return { title: domain, description: `Website at ${domain}` };
    }

    const project = await client.query(api.projects.getPublishedProject, {
      projectId: domainRecord.projectId,
    });

    if (!project) {
      return { title: domain, description: `Website at ${domain}` };
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
        url: `https://${domain}`,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description,
      },
      robots: { index: true, follow: true },
    };
  } catch {
    return { title: domain, description: `Website at ${domain}` };
  }
}

export default async function PublishedDomainPage({
  searchParams,
}: PublishedDomainPageProps): Promise<React.ReactElement> {
  const { domain } = await searchParams;
  return <PublishedDomainClient domain={domain ?? null} />;
}
