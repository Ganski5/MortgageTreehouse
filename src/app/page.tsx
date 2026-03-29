import Hero from "@/components/home/Hero";
import AudiencePaths from "@/components/home/AudiencePaths";
import FeaturedCalculators from "@/components/home/FeaturedCalculators";
import FeaturedContent from "@/components/home/FeaturedContent";
import TrustSection from "@/components/home/TrustSection";

export default function Home() {
  return (
    <main>
      <Hero />
      <AudiencePaths />
      <FeaturedCalculators />
      <FeaturedContent />
      <TrustSection />
    </main>
  );
}
