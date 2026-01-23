import { MdArrowOutward, MdCopyright } from "react-icons/md";
import "./styles/Contact.css";
import { config } from "../config";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useState, FormEvent } from "react";

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const [name, setName] = useState("");
  const [service, setService] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const message = encodeURIComponent(
      `Hi, I'm ${name}.\n\nI need: ${service}\n\nAbout my project: ${description}`
    );
    window.open(`${config.contact.whatsapp}?text=${message}`, '_blank');
  };

  useEffect(() => {
    const contactTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: ".contact-section",
        start: "top 80%",
        end: "bottom center",
        toggleActions: "play none none none",
      },
    });

    contactTimeline.fromTo(
      ".contact-section h3",
      {
        opacity: 0,
        y: 50,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
      }
    );

    contactTimeline.fromTo(
      ".contact-box",
      {
        opacity: 0,
        y: 50,
      },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        stagger: 0.15,
        ease: "power3.out",
      },
      "-=0.4"
    );

    return () => {
      contactTimeline.kill();
    };
  }, []);

  return (
    <div className="contact-section section-container" id="contact">
      <div className="contact-container">
        <h3>{config.developer.fullName}</h3>
        <p className="contact-subtitle">{config.developer.title}</p>
        <div className="contact-response-badge">
          {config.contact.responseTime}
        </div>
        <div className="contact-flex">
          <div className="contact-box">
            <h4>WhatsApp <span className="contact-primary-badge">Primary</span></h4>
            <p>
              <a
                href={config.contact.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="disable"
                aria-label="Contact us on WhatsApp"
              >
                {config.social.whatsapp}
              </a>
            </p>
            <h4>Email</h4>
            <p>
              <a
                href={`mailto:${config.contact.email}`}
                data-cursor="disable"
                aria-label="Send us an email"
              >
                {config.contact.email}
              </a>
            </p>
            <h4>Location</h4>
            <p className="contact-location">
              <span>Based in {config.social.location}</span>
            </p>
            <h4>Social</h4>
            <a
              href={config.contact.github}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="disable"
              className="contact-social"
              aria-label="Visit our GitHub profile"
            >
              Github <MdArrowOutward />
            </a>
            <a
              href={config.contact.instagram}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="disable"
              className="contact-social"
              aria-label="Visit our Instagram profile"
            >
              Instagram <MdArrowOutward />
            </a>
          </div>
          <div className="contact-box contact-form-box">
            <h4>Let's Talk</h4>
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Company or individual name"
                  required
                  data-cursor="disable"
                />
              </div>
              <div className="form-group">
                <label htmlFor="service">What do you need?</label>
                <select
                  id="service"
                  value={service}
                  onChange={(e) => setService(e.target.value)}
                  required
                  data-cursor="disable"
                >
                  <option value="" disabled>Select a service</option>
                  <option value="Website Development">Website Development</option>
                  <option value="Web Application">Web Application</option>
                  <option value="Automation & Workflows">Automation & Workflows</option>
                  <option value="AI Integration">AI Integration</option>
                  <option value="E-Commerce">E-Commerce</option>
                  <option value="UI/UX Design">UI/UX Design</option>
                  <option value="Security & Maintenance">Security & Maintenance</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="description">Tell us more</label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Whether it's a company or an individual, I'm willing to build anything for you."
                  rows={4}
                  required
                  data-cursor="disable"
                />
              </div>
              <button type="submit" className="contact-submit" data-cursor="disable">
                Send <MdArrowOutward />
              </button>
            </form>
          </div>
          <div className="contact-box">
            <h2>
              Designed and Developed <br /> by <span className="logo-bracket">{"{"}</span>alqode<span className="logo-bracket">{"}"}</span>
            </h2>
            <h5>
              <MdCopyright /> {new Date().getFullYear()}
            </h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
