import { Hero } from "../components/Hero";
import { OutfitGallery } from "../components/OutfitGallery";
import { FashionMagazine } from "../components/FashionMagazine";
import { RevolutionaryFeatures } from "../components/RevolutionaryFeatures";
import { FullServicePackages } from "../components/FullServicePackages";
import { Footer } from "../components/Footer";

export function HomePage() {
  return (
    <>
      <Hero />
      <OutfitGallery />
      <FashionMagazine />
      <RevolutionaryFeatures />
      <FullServicePackages />
      <Footer />
    </>
  );
}
