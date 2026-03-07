import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-bg-base">
      <div className="text-center space-y-4">
        <Loader2 className="h-12 w-12 text-accent-teal animate-spin mx-auto" />
        <p className="text-text-secondary">Yükleniyor...</p>
      </div>
    </div>
  );
}
