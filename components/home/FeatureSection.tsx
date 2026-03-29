import { FeatureCard } from "./FeatureCard";
import { Eye, BarChart3, MessageCircle, CalendarClock } from "lucide-react";

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
    {
        icon: CalendarClock,
        title: "Tracker and Reminder",
        description:
            "Easily monitor your health and get reminders to stay consistent with your care.",
    },
];
export function FeatureSection() {

    return (
        <section className="border-b border-border py-16 md:py-20">
            <div className="mx-auto max-w-6xl px-4 md:px-6">
                <div className="mb-10 text-center">
                    <h2 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
                        What Lupustic Offers
                    </h2>
                    <p className="mt-2 text-muted-foreground">
                        Comprehensive tools for early detection and understanding
                    </p>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
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
    );
}