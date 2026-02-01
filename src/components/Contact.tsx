import { MdArrowOutward, MdCopyright } from "react-icons/md";
import "./styles/Contact.css";
import { config } from "../config";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useState, FormEvent } from "react";
import { useAnimatedPlaceholder } from "../hooks/useAnimatedPlaceholder";

gsap.registerPlugin(ScrollTrigger);

const Contact = () => {
  const [name, setName] = useState("");
  const [service, setService] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [showToast, setShowToast] = useState(false);

  // Animated placeholders for premium feel
  const namePlaceholder = useAnimatedPlaceholder({
    phrases: [
      "Tesla",
      "Spotify",
      "Netflix",
      "Airbnb",
      "Your Company",
      "Startup Inc"
    ],
    typingSpeed: 80,
    deleteSpeed: 40,
    pauseDuration: 2000,
  });

  const descPlaceholder = useAnimatedPlaceholder({
    phrases: [
      "Help me automate my quotations",
      "Build me a professional website",
      "Help me automate WhatsApp messaging",
      "Create an e-commerce platform for me",
      "Automate my email marketing workflow",
      "Build me a custom booking system"
    ],
    typingSpeed: 60,
    deleteSpeed: 30,
    pauseDuration: 2500,
  });

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const message = `Hi, I'm ${name}.\n\nI need: ${service}\n\nAbout my project: ${description}`;

    // Backup: Copy to clipboard in case user closes WhatsApp tab
    try {
      await navigator.clipboard.writeText(message);
    } catch (err) {
      console.warn('Clipboard copy failed:', err);
    }

    // Open WhatsApp
    const encodedMessage = encodeURIComponent(message);
    window.open(`${config.contact.whatsapp}?text=${encodedMessage}`, '_blank');

    // Show success state and toast after a brief delay
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setShowToast(true);
      // Reset success state after 3 seconds
      setTimeout(() => {
        setIsSuccess(false);
        setShowToast(false);
      }, 4000);
    }, 500);
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
      {/* Success Toast Notification */}
      <div className={`contact-toast ${showToast ? "contact-toast-visible" : ""}`}>
        Message copied to clipboard & WhatsApp opened!
      </div>
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
                  onChange={(e) => {
                    setName(e.target.value);
                    namePlaceholder.onInput(e.target.value.length > 0);
                  }}
                  onFocus={namePlaceholder.onFocus}
                  onBlur={namePlaceholder.onBlur}
                  placeholder={namePlaceholder.placeholder || "Company or individual name"}
                  required
                  data-cursor="disable"
                  className={namePlaceholder.isAnimating ? "animated-placeholder" : ""}
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
                  {config.services.map((svc) => (
                    <option key={svc} value={svc}>{svc}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="description">Tell us more</label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => {
                    setDescription(e.target.value);
                    descPlaceholder.onInput(e.target.value.length > 0);
                  }}
                  onFocus={descPlaceholder.onFocus}
                  onBlur={descPlaceholder.onBlur}
                  placeholder={descPlaceholder.placeholder || "Tell us about your project..."}
                  rows={4}
                  required
                  data-cursor="disable"
                  className={descPlaceholder.isAnimating ? "animated-placeholder" : ""}
                />
              </div>
              <button
                type="submit"
                className={`contact-submit ${isSuccess ? 'contact-submit-success' : ''}`}
                data-cursor="disable"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  "Opening WhatsApp..."
                ) : isSuccess ? (
                  "Message Sent!"
                ) : (
                  <>Send <MdArrowOutward /></>
                )}
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
