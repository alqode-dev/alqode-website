import { useEffect, useState } from "react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import HoverLinks from "./HoverLinks";
import { gsap } from "gsap";
import Lenis from "lenis";
import { useLoading } from "../context/LoadingProvider";
import "./styles/Navbar.css";

gsap.registerPlugin(ScrollTrigger);
export let lenis: Lenis | null = null;

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isLoading } = useLoading();

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    // Lock/unlock body scroll when menu is open
    document.body.style.overflow = !isMobileMenuOpen ? "hidden" : "";
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    document.body.style.overflow = "";
  };

  useEffect(() => {
    // Initialize Lenis smooth scroll
    lenis = new Lenis({
      duration: 1.7,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1.7,
      touchMultiplier: 1.3,
      infinite: false,
    });

    // Start paused
    lenis.stop();

    // Handle smooth scroll animation frame
    function raf(time: number) {
      lenis?.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    // Handle navigation links
    let links = document.querySelectorAll(".header ul a");
    links.forEach((elem) => {
      let element = elem as HTMLAnchorElement;
      element.addEventListener("click", (e) => {
        if (window.innerWidth > 1024) {
          e.preventDefault();
          let elem = e.currentTarget as HTMLAnchorElement;
          let section = elem.getAttribute("data-href");
          if (section && lenis) {
            const target = document.querySelector(section) as HTMLElement;
            if (target) {
              lenis.scrollTo(target, {
                offset: 0,
                duration: 1.5,
              });
            }
          }
        }
      });
    });

    // Handle resize
    window.addEventListener("resize", () => {
      lenis?.resize();
    });

    return () => {
      lenis?.destroy();
    };
  }, []);
  return (
    <>
      {/* Hide entire navbar during loading - loading screen has its own logo */}
      {!isLoading && (
        <div className="header">
          <a href="/#" className="navbar-title" data-cursor="disable">
            <span className="logo-bracket">{"{"}</span>alqode<span className="logo-bracket">{"}"}</span>
          </a>
          <a
            href="mailto:alqodez@gmail.com"
            className="navbar-connect"
            data-cursor="disable"
          >
            alqodez@gmail.com
          </a>
          <ul className="navbar-links">
            <li>
              <a data-href="#about" href="#about">
                <HoverLinks text="ABOUT" />
              </a>
            </li>
            <li>
              <a data-href="#work" href="#work">
                <HoverLinks text="WORK" />
              </a>
            </li>
            <li>
              <a data-href="#contact" href="#contact">
                <HoverLinks text="CONTACT" />
              </a>
            </li>
          </ul>

          <button
            className={`navbar-hamburger ${isMobileMenuOpen ? "open" : ""}`}
            onClick={toggleMobileMenu}
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      )}

      {/* Mobile Menu Backdrop - hidden during loading */}
      {!isLoading && (
        <div
          className={`navbar-backdrop ${isMobileMenuOpen ? "open" : ""}`}
          onClick={closeMobileMenu}
          aria-hidden="true"
        ></div>
      )}

      {/* Mobile Menu Panel - hidden during loading */}
      {!isLoading && (
        <nav className={`navbar-mobile-menu ${isMobileMenuOpen ? "open" : ""}`}>
          <ul>
            <li>
              <a href="#about" onClick={closeMobileMenu}>About</a>
            </li>
            <li>
              <a href="#work" onClick={closeMobileMenu}>Work</a>
            </li>
            <li>
              <a href="#contact" onClick={closeMobileMenu}>Contact</a>
            </li>
          </ul>
          <a
            href="mailto:alqodez@gmail.com"
            className="navbar-mobile-email"
            onClick={closeMobileMenu}
          >
            alqodez@gmail.com
          </a>
        </nav>
      )}

      <div className="landing-circle1"></div>
      <div className="landing-circle2"></div>
      <div className="nav-fade"></div>
    </>
  );
};

export default Navbar;
