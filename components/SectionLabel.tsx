import type { ReactNode } from "react";
import { ArrowRight } from "lucide-react";

export default function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <span className="mb-4 flex items-center gap-2">
      <ArrowRight className="h-5 w-5 shrink-0 text-primary" />
      <span className="section-label text-base sm:text-lg">{children}</span>
    </span>
  );
}
