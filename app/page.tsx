import { HeroSection } from "@/components/home/HeroSection";
import { HowItWorks } from "@/components/home/HowItWorks";
import { MedicalDisclaimer } from "@/components/home/MedicalDisclaimer";
import { WhyEarlyScreening } from "@/components/home/WhyEarlyScreening";
import { BuiltForEveryone } from "@/components/home/BuiltForEveryone";
import { PricingSection } from "@/components/home/PricingSection";
import { FeatureSection } from "@/components/home/FeatureSection";



export default function Home() {
  return (
    <>
      <HeroSection />
      <HowItWorks />
      <WhyEarlyScreening />
      <FeatureSection />
      <BuiltForEveryone />
      <PricingSection />
      <MedicalDisclaimer />
    </>
  );
}
