import { HeroSection } from "@/components/home/HeroSection";
import { HowItWorks } from "@/components/home/HowItWorks";
import { FeatureCard } from "@/components/home/FeatureCard";
import { MedicalDisclaimer } from "@/components/home/MedicalDisclaimer";
import { Eye, BarChart3, MessageCircle } from "lucide-react";

const features = [
  {
    icon: Eye,
    title: "Computer Vision Scan",
    description:
      "Advanced image analysis powered by a trained deep learning model that examines skin lesion patterns associated with Systemic Lupus Erythematosus.",
  },
  {
    icon: BarChart3,
    title: "Confidence Scoring",
    description:
      "Receive a clear confidence percentage alongside your results, helping you understand the strength of the AI's assessment at a glance.",
  },
  {
    icon: MessageCircle,
    title: "AI Consultation",
    description:
      "After your scan, consult our AI assistant to discuss symptoms, learn about next steps, and understand your results in plain language.",
  },
];

export default function Home() {
  return (
    <>
      <HeroSection />
      <HowItWorks />

      {/* Feature Cards */}
      <section className="py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4 md:px-6">
          <div className="mb-10 text-center">
            <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
              What Lupustic Offers
            </h2>
            <p className="mt-2 text-muted-foreground">
              Comprehensive tools for early detection and understanding
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {features.map((feature) => (
              <FeatureCard
                key={feature.title}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </section>

      <MedicalDisclaimer />
    </>
  );
}
