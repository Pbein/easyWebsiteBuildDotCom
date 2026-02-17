import { Loader2 } from "lucide-react";

export default function DemoLoading(): React.ReactElement {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0b0f]">
      <div className="text-center">
        <Loader2 className="mx-auto mb-4 h-8 w-8 animate-spin text-[#e8a849]" />
        <p className="text-sm text-[rgba(255,255,255,0.5)]">Loading...</p>
      </div>
    </div>
  );
}
