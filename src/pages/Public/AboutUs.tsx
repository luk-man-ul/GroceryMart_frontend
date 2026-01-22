import AboutHero from "../../components/about/AboutHero";
import WhyChooseUs from "../../components/about/WhyChooseUs";
import MissionVision from "../../components/about/MissionVision";
import AboutCTA from "../../components/about/AboutCTA";

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gray-100">

      <AboutHero />
      <WhyChooseUs />
      <MissionVision />
      <AboutCTA />

    </div>
  );
};

export default AboutUs;
