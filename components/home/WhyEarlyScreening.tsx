import { Activity, Clock, MapPin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function WhyEarlyScreening() {
  const stats = [
    {
      icon: Activity,
      iconColor: "text-rose-500",
      bgColor: "bg-rose-50 dark:bg-rose-500/10",
      title: "5 million+",
      desc: "people worldwide are affected by Lupus",
    },
    {
      icon: Clock,
      iconColor: "text-purple-500",
      bgColor: "bg-purple-50 dark:bg-purple-500/10",
      title: "6 to 7.5 years",
      desc: "Average delay in achieving proper lupus diagnosis",
    },
    {
      icon: MapPin,
      iconColor: "text-amber-500",
      bgColor: "bg-amber-50 dark:bg-amber-500/10",
      title: "Limited",
      desc: "Access in rural areas. Screening not available in remote communities",
    },
  ];

  return (
    <section className="border-b border-border relative w-full pt-16 pb-12 md:pt-24 md:pb-16 flex flex-col items-center bg-indigo-50/40 dark:bg-indigo-950/20">
      {/* Decorative background blobs */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 h-64 w-64 rounded-full bg-indigo-400/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 h-64 w-64 rounded-full bg-purple-400/10 blur-3xl pointer-events-none" />

      {/* Content Container */}
      <div className="relative z-10 w-full max-w-6xl px-4 md:px-6 mx-auto flex flex-col items-center text-center">
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-indigo-950 dark:text-indigo-50 mb-2">
          Why Early Screening Matters?
        </h2>
        <p className="text-indigo-800/80 dark:text-indigo-200/80 text-sm md:text-base font-medium mb-12">
          Lupus: The Silent Threat You Shouldn't Ignore
        </p>

        {/* Cards Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
          {stats.map((stat, idx) => {
            const Icon = stat.icon;
            return (
              <Card
                key={idx}
                className="relative overflow-hidden group shadow-lg hover:shadow-xl transition-all duration-300 border-none bg-white/95 dark:bg-secondary/95 backdrop-blur-sm"
              >
                <CardContent className="flex flex-col items-center text-center p-8 gap-4">
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl ${stat.bgColor} transition-transform group-hover:scale-110 duration-300`}
                  >
                    <Icon className={`h-6 w-6 ${stat.iconColor}`} />
                  </div>
                  <h3 className="text-2xl font-bold text-foreground">
                    {stat.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    {stat.desc}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
