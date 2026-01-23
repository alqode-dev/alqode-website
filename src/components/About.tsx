import "./styles/About.css";
import { config } from "../config";

const About = () => {
  return (
    <div className="about-section" id="about">
      <div className="about-container">
        <div className="about-story">
          <h3 className="about-title">{config.about.title}</h3>
          <p className="about-intro">{config.about.intro}</p>
        </div>

        <div className="about-claims">
          <h4 className="about-subtitle">What I Deliver</h4>
          <ul className="claims-list">
            {config.about.claims.map((claim) => (
              <li key={claim} className="claim-item">{claim}</li>
            ))}
          </ul>
        </div>

        <div className="about-proof">
          <h4 className="about-subtitle">Proof</h4>
          <div className="proof-grid">
            {config.about.proof.map((item) => (
              <div key={item.title} className="proof-item">
                <h5 className="proof-title">{item.title}</h5>
                <p className="proof-result">{item.result}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;
