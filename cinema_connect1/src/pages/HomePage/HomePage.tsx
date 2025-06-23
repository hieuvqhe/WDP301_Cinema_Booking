import FeaturedSection from "../../components/banners/FeaturedSection/FeaturedSection";
import HeroSection from "../../components/banners/HeroSection/HeroSection";
import TrailerSection from "../../components/movies/TrailerSection/TrailerSection";

const Home = () => {
  return (
    <div>
      <HeroSection />
      <FeaturedSection />
      <TrailerSection />
    </div>
  );
};

export default Home;
