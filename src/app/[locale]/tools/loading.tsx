import { Loader2 } from "lucide-react";

export default function ToolsLoading() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <Loader2 className="h-12 w-12 text-accent-teal animate-spin mx-auto" />
          <p className="text-text-secondary">Araçlar yükleniyor...</p>
        </div>
      </div>
    </div>
  );
}
