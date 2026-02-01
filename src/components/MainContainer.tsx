import { lazy, PropsWithChildren, Suspense, useEffect } from "react";
import About from "./About";
import Career from "./Career";
import Contact from "./Contact";
import Cursor from "./Cursor";
import Landing from "./Landing";
import Navbar from "./Navbar";
import SocialIcons from "./SocialIcons";
import WhatIDo from "./WhatIDo";
import Work from "./Work";
import setSplitText from "./utils/splitText";
import { useBreakpoint } from "../hooks/useBreakpoint";

const TechStack = lazy(() => import("./TechStack"));

// Loading fallback for TechStack
const TechStackFallback = () => (
  <div className="techstack" style={{ opacity: 0.5 }}>
    <h2>Our Techstack</h2>
  </div>
);

const MainContainer = ({ children }: PropsWithChildren) => {
  const { isDesktop } = useBreakpoint();

  useEffect(() => {
    const resizeHandler = () => {
      setSplitText();
    };
    resizeHandler();
    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  return (
    <div className="container-main">
      <Cursor />
      <Navbar />
      <SocialIcons />
      {isDesktop && children}
      <main id="main-content" className="container-main">
        <Landing>{!isDesktop && children}</Landing>
        <About />
        <WhatIDo />
        <Career />
        <Work />
        <Suspense fallback={<TechStackFallback />}>
          <TechStack />
        </Suspense>
        <Contact />
      </main>
    </div>
  );
};

export default MainContainer;
