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
    if (!isMobileMenuOpen) {
      // Opening menu - lock scroll
      document.body.style.overflow = "hidden";
    } else {
      // Closing menu - restore scroll (must use overflowY to not break Lenis)
      document.body.style.overflow = "";
      document.body.style.overflowY = "auto";
    }
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
    // Restore scroll (must use overflowY to not break Lenis)
    document.body.style.overflow = "";
    document.body.style.overflowY = "auto";
  };

  // Cleanup body overflow on unmount
  useEffect(() => {
    return () => {
      document.body.style.overflow = "";
      document.body.style.overflowY = "auto";
    };
  }, []);

  // Reset overflow when loading state changes
  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = "";
      setIsMobileMenuOpen(false);
    }
  }, [isLoading]);

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

    // CRITICAL: Connect Lenis to GSAP ScrollTrigger
    // This ensures scroll-triggered animations work with smooth scroll
    lenis.on('scroll', ScrollTrigger.update);

    // Use GSAP ticker for smoother integration (better than raw RAF)
    gsap.ticker.add((time) => {
      lenis?.raf(time * 1000);
    });

    // Disable GSAP lag smoothing for precise scroll sync
    gsap.ticker.lagSmoothing(0);

    // Handle navigation links
    const links = document.querySelectorAll(".header ul a");
    const clickHandlers = new Map<Element, EventListener>();

    links.forEach((elem) => {
      const handler = (e: Event) => {
        if (window.innerWidth > 1024) {
          e.preventDefault();
          const anchor = e.currentTarget as HTMLAnchorElement;
          const section = anchor.getAttribute("data-href");
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
      };
      clickHandlers.set(elem, handler);
      elem.addEventListener("click", handler);
    });

    // Handle resize
    const resizeHandler = () => {
      lenis?.resize();
      ScrollTrigger.refresh();
    };
    window.addEventListener("resize", resizeHandler);

    return () => {
      // Cleanup: remove GSAP ticker
      gsap.ticker.remove((time) => {
        lenis?.raf(time * 1000);
      });

      // Cleanup: remove click handlers
      clickHandlers.forEach((handler, elem) => {
        elem.removeEventListener("click", handler);
      });

      // Cleanup: remove resize handler
      window.removeEventListener("resize", resizeHandler);

      // Cleanup: destroy Lenis
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
