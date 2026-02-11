"use client";

import { useState, useEffect, useCallback } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { NAV_LINKS, SITE } from "@/lib/constants";

export function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = useCallback(() => {
    setIsOpen((prev) => {
      const next = !prev;
      document.body.style.overflow = next ? "hidden" : "";
      return next;
    });
  }, []);

  const closeMenu = useCallback(() => {
    setIsOpen(false);
    document.body.style.overflow = "";
  }, []);

  const handleNavClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
      e.preventDefault();
      closeMenu();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
      }
    },
    [closeMenu]
  );

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-void/80 backdrop-blur-xl border-b border-border/50"
            : "bg-transparent"
        }`}
      >
        <div className="container-width flex items-center justify-between px-5 py-3 md:px-8">
          {/* Logo */}
          <a href="#" className="text-base font-bold" aria-label="Home">
            <span className="text-terminal">{"{"}</span>
            alqode
            <span className="text-terminal">{"}"}</span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-8" aria-label="Main navigation">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.href)}
                className="text-sm text-muted hover:text-terminal transition-colors"
              >
                {link.label}
              </a>
            ))}
            <a
              href={SITE.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-terminal text-void px-4 py-2 rounded-md text-sm font-bold hover:bg-terminal/90 transition-colors"
            >
              Get a system built
            </a>
          </nav>

          {/* Mobile: CTA + Hamburger */}
          <div className="flex lg:hidden items-center gap-3">
            <a
              href={SITE.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-terminal text-void px-3 py-1.5 rounded-md text-xs font-bold"
            >
              Get a system built
            </a>
            <button
              onClick={toggleMenu}
              className="text-white p-1"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              aria-expanded={isOpen}
            >
              {isOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
            className="fixed inset-0 z-40 bg-void/[0.98] backdrop-blur-xl flex flex-col items-center justify-center"
          >
            <button
              onClick={closeMenu}
              className="absolute top-3 right-5 text-white p-1"
              aria-label="Close menu"
            >
              <X size={22} />
            </button>

            <nav className="flex flex-col items-center gap-8" aria-label="Mobile navigation">
              {NAV_LINKS.map((link, i) => (
                <motion.a
                  key={link.href}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.href)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="text-2xl font-semibold text-white hover:text-terminal transition-colors"
                >
                  {link.label}
                </motion.a>
              ))}
              <motion.a
                href={SITE.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: NAV_LINKS.length * 0.1 }}
                className="mt-4 bg-terminal text-void px-8 py-3 rounded-lg text-lg font-bold w-full max-w-xs text-center"
              >
                Get a system built
              </motion.a>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
