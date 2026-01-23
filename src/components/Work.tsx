import "./styles/Work.css";
import WorkImage from "./WorkImage";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect } from "react";
import { config } from "../config";
import { MdArrowOutward } from "react-icons/md";

gsap.registerPlugin(ScrollTrigger);

// Width allocated for "Ready to be next?" CTA box
const CTA_BOX_WIDTH = 350;

const Work = () => {
  useEffect(() => {
    let translateX: number = 0;

    function setTranslateX() {
      const box = document.getElementsByClassName("work-box");
      const workContainer = document.querySelector(".work-container");

      if (box.length === 0 || !workContainer || !box[0].parentElement) return;

      const rectLeft = workContainer.getBoundingClientRect().left;
      const rect = box[0].getBoundingClientRect();
      const parentWidth = box[0].parentElement.getBoundingClientRect().width;
      const padding: number =
        parseInt(window.getComputedStyle(box[0]).padding) / 2;
      translateX = rect.width * box.length - (rectLeft + parentWidth) + padding + CTA_BOX_WIDTH;
    }

    setTranslateX();

    const timeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".work-section",
        start: "top top",
        end: `+=${translateX}`,
        scrub: true,
        pin: true,
        id: "work",
      },
    });

    timeline.to(".work-flex", {
      x: -translateX,
      ease: "none",
    });

    return () => {
      timeline.kill();
      ScrollTrigger.getById("work")?.kill();
    };
  }, []);

  return (
    <div className="work-section" id="work">
      <div className="work-container section-container">
        <h2>
          My <span>Projects</span>
        </h2>
        <div className="work-flex">
          {config.projects.map((project, index) => (
            <div className="work-box" key={project.id}>
              <div className="work-info">
                <div className="work-title">
                  <h3>0{index + 1}</h3>
                  <div>
                    <h4>{project.title}</h4>
                    <p>{project.category}</p>
                  </div>
                </div>
                <p className="work-description">{project.description}</p>
                <h4>Tools and features</h4>
                <p>{project.technologies}</p>
                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="work-view-link"
                    data-cursor="disable"
                    aria-label={`View ${project.title} project`}
                  >
                    View Project <MdArrowOutward />
                  </a>
                )}
              </div>
              <WorkImage image={project.image} alt={project.title} />
            </div>
          ))}
          <div className="work-box work-cta-box">
            <div className="work-cta-content">
              <h3>Ready to be next?</h3>
              <p>Let's build something that makes a difference for your business.</p>
              <a
                href="#contact"
                className="work-cta-button"
                data-cursor="disable"
                aria-label="Start your project - contact us"
              >
                Start Your Project
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Work;
