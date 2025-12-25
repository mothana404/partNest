import Footer from "../../components/layout/Footer";
import Hero from "../../components/home sections/Hero";
import HowItWorks from "../../components/home sections/HowItWorks";
import Navbar from "../../components/layout/Navbar";
import PlatformBenefits from "../../components/home sections/PlatformBenefits";
// import TopOpportunities from "../../components/home sections/TopOpportunities";
import { useEffect } from "react";

const Home = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <>
      <Navbar></Navbar>
      <Hero></Hero>
      {/* <TopOpportunities></TopOpportunities> */}
      <HowItWorks></HowItWorks>
      <PlatformBenefits></PlatformBenefits>
      <Footer></Footer>
    </>
  );
};

export default Home;
