import Hero from "@/components/shared/Hero";
import Featured from "@/components/homepage/Featured";
import Features from "@/components/homepage/Features";
import DashboardPreview from "@/components/homepage/DashboardPreview";
import HowItWorks from "@/components/homepage/HowItWorks";
import Stats from "@/components/homepage/Stats";
import Testimonials from "@/components/homepage/Testimonials";
import Pricing from "@/components/homepage/Pricing";
import CTA from "@/components/homepage/CTA";

export default function Home() {
  return (
    <>
      <Hero />
      <Featured />
      <Features />
      <DashboardPreview />
      <HowItWorks />
      <Stats />
      <Testimonials />
      <Pricing />
      <CTA />
    </>
  );
}
