import HeroSection from "@/components/landing/hero-section"
import FeaturesSection from "@/components/landing/features-section"
import MarketSection from "@/components/landing/market-section"
import AboutPage from "@/components/landing/about" 
import CTASection from "@/components/landing/cta-section"
import Footer from "@/components/landing/footer"
import Navigation from "@/components/landing/navigation"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navigation />
      <HeroSection />
      <FeaturesSection />
      <MarketSection />
      <AboutPage />
      <CTASection />
      <Footer />
    </main>
  )
}
