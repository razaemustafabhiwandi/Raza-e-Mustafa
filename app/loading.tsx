import { Moon } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-3 py-20">
      <Moon className="h-8 w-8 animate-spin text-gold" style={{ animationDuration: "2s" }} />
      <p className="text-sm text-primary/50">Load ho raha hai&hellip;</p>
    </div>
  );
}
