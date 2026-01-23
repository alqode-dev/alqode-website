import "./styles/Career.css";
import { config } from "../config";

const Career = () => {
  return (
    <div className="career-section section-container">
      <div className="career-container">
        <div className="career-manifesto">
          <h2>
            {config.careers.headline.split("Best")[0]}<span>Best</span>
            <br /> {config.careers.headline.split("Best")[1]}
          </h2>
          <p className="manifesto-text">
            {config.careers.manifesto}
          </p>
        </div>

        <div className="career-positions">
          <h3 className="positions-title">{config.careers.positionsTitle}</h3>
          <div className="career-info">
            <div className="career-timeline">
              <div className="career-dot"></div>
            </div>
            {config.experiences.map((exp) => (
              <div key={exp.position} className="career-info-box">
                <div className="career-info-in">
                  <div className="career-role">
                    <h4>{exp.position}</h4>
                    <h5>{exp.company}</h5>
                  </div>
                  <h3>{exp.location}</h3>
                </div>
                <p>{exp.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="career-cta">
          <a
            href="#contact"
            className="career-cta-button"
            data-cursor="disable"
            aria-label="Join our team - contact us"
          >
            {config.careers.cta}
          </a>
        </div>
      </div>
    </div>
  );
};

export default Career;
