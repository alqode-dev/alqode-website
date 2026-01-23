import { PropsWithChildren } from "react";
import "./styles/Landing.css";
import { config } from "../config";

const Landing = ({ children }: PropsWithChildren) => {
  const handleScrollTo = (e: React.MouseEvent, target: string) => {
    e.preventDefault();
    const element = document.querySelector(target) as HTMLElement | null;
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <div className="landing-section" id="landingDiv">
        <div className="landing-container">
          <div className="landing-intro">
            <h1>{config.developer.fullName}</h1>
            <h2>{config.developer.title}</h2>
          </div>
          <div className="landing-info">
            <h3 className="landing-tagline">"{config.developer.tagline}"</h3>
            <div className="landing-cta-buttons">
              <a
                href="#contact"
                className="cta-button cta-primary"
                data-cursor="disable"
                aria-label="Start your project - scroll to contact form"
                onClick={(e) => handleScrollTo(e, "#contact")}
              >
                Start Your Project
              </a>
              <a
                href="#work"
                className="cta-button cta-secondary"
                data-cursor="disable"
                aria-label="View my portfolio work"
                onClick={(e) => handleScrollTo(e, "#work")}
              >
                View My Work
              </a>
            </div>
          </div>
        </div>
        {children}
      </div>
    </>
  );
};

export default Landing;
