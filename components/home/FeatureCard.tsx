import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <Card className="group relative overflow-hidden border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-indigo-500/10 dark:hover:border-indigo-500/30">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <CardContent className="relative z-10 flex flex-col items-center text-center gap-4 p-8">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3">
          <Icon className="h-7 w-7" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-foreground mb-2 transition-colors group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
            {title}
          </h3>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
