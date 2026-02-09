/**
 * Creates a ZIP file from the generated project files using JSZip.
 */

import JSZip from "jszip";
import type { ExportResult } from "./generate-project";

/**
 * Bundle an ExportResult into a downloadable ZIP blob.
 */
export async function createProjectZip(result: ExportResult): Promise<Blob> {
  const zip = new JSZip();
  const folderName =
    result.businessName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || "website";

  const folder = zip.folder(folderName);
  if (!folder) throw new Error("Failed to create zip folder");

  for (const file of result.files) {
    folder.file(file.path, file.content);
  }

  return zip.generateAsync({ type: "blob" });
}

/**
 * Trigger a browser download for a blob.
 */
export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
