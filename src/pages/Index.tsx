import Header from "@/components/Header";
import PromoBanner from "@/components/PromoBanner";
import Hero from "@/components/Hero";
import FeatureCards from "@/components/FeatureCards";
import Footer from "@/components/Footer";
import { Helmet } from "react-helmet-async";

const Index = () => {
  return (
    <>
      <Helmet>
        <title>Quantivue AI - Affordable Web Hosting & Automation Platform</title>
        <meta
          name="description"
          content="Launch faster with secure, high-performance hosting. Affordable web hosting, WordPress hosting, and n8n cloud hosting for websites and automation."
        />
      </Helmet>
      <div className="min-h-screen flex flex-col">
        <Header />
        <PromoBanner />
        <main className="flex-1">
          <Hero />
          <FeatureCards />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default Index;
