"use client";

import { useEffect, useRef, RefObject } from "react";

const CHARS = "!@#$%^&*()_+-=[]{}|;:ABCDEFabcdef0123456789";

interface DecryptOptions {
  enabled?: boolean;
  speed?: number; // ms per character resolve (~30)
}

/**
 * On mouseenter, scramble visible text then resolve left-to-right.
 * Preserves child element nodes (e.g. <span> for {alqode} green text).
 * Desktop only (lg+ / non-touch).
 */
export function useDecryptOnHover(
  containerRef: RefObject<HTMLElement | null>,
  selector: string,
  options: DecryptOptions = {}
) {
  const { enabled = true, speed = 30 } = options;
  const animatingRef = useRef(new Set<HTMLElement>());

  useEffect(() => {
    if (!enabled) return;
    const container = containerRef.current;
    if (!container) return;

    // Desktop gate
    const mql = window.matchMedia("(min-width: 1024px)");
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    if (!mql.matches || isTouch) return;

    const elements = container.querySelectorAll<HTMLElement>(selector);
    if (elements.length === 0) return;

    // Collect text nodes from an element (preserving structure)
    function getTextNodes(el: Node): Text[] {
      const nodes: Text[] = [];
      const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
      let node: Text | null;
      while ((node = walker.nextNode() as Text | null)) {
        if (node.textContent && node.textContent.trim().length > 0) {
          nodes.push(node);
        }
      }
      return nodes;
    }

    function randomChar() {
      return CHARS[Math.floor(Math.random() * CHARS.length)];
    }

    function handleMouseEnter(this: HTMLElement) {
      const el = this;
      if (animatingRef.current.has(el)) return;
      animatingRef.current.add(el);

      const textNodes = getTextNodes(el);
      if (textNodes.length === 0) {
        animatingRef.current.delete(el);
        return;
      }

      // Store originals
      const originals = textNodes.map((n) => n.textContent || "");
      const allChars: { node: Text; index: number; original: string }[] = [];

      originals.forEach((text, ni) => {
        for (let ci = 0; ci < text.length; ci++) {
          allChars.push({ node: textNodes[ni], index: ci, original: text[ci] });
        }
      });

      const totalChars = allChars.length;
      if (totalChars === 0) {
        animatingRef.current.delete(el);
        return;
      }

      // Phase 1: Scramble everything instantly
      const scrambled = originals.map((text) =>
        text
          .split("")
          .map((ch) => (ch === " " || ch === "\n" ? ch : randomChar()))
          .join("")
      );
      textNodes.forEach((n, i) => {
        n.textContent = scrambled[i];
      });

      // Phase 2: Resolve left-to-right
      let resolved = 0;
      // Keep current scrambled arrays mutable
      const current = scrambled.map((s) => s.split(""));

      const scrambleInterval = setInterval(() => {
        // Scramble unresolved chars
        allChars.forEach((entry, gi) => {
          if (gi >= resolved && entry.original !== " " && entry.original !== "\n") {
            const nodeIdx = originals.indexOf(
              originals.find((_, ni) => {
                const start = originals.slice(0, ni).reduce((s, t) => s + t.length, 0);
                const end = start + originals[ni].length;
                return gi >= start && gi < end;
              })!
            );
            // Find which text node and local index
            let acc = 0;
            for (let ni = 0; ni < originals.length; ni++) {
              if (gi < acc + originals[ni].length) {
                current[ni][gi - acc] = randomChar();
                break;
              }
              acc += originals[ni].length;
            }
          }
        });
        // Apply current state
        textNodes.forEach((n, i) => {
          n.textContent = current[i].join("");
        });
      }, 50);

      const resolveInterval = setInterval(() => {
        if (resolved >= totalChars) {
          clearInterval(resolveInterval);
          clearInterval(scrambleInterval);
          // Restore originals exactly
          textNodes.forEach((n, i) => {
            n.textContent = originals[i];
          });
          animatingRef.current.delete(el);
          return;
        }

        // Resolve next char
        let acc = 0;
        for (let ni = 0; ni < originals.length; ni++) {
          if (resolved < acc + originals[ni].length) {
            current[ni][resolved - acc] = originals[ni][resolved - acc];
            break;
          }
          acc += originals[ni].length;
        }
        resolved++;

        // Apply current state
        textNodes.forEach((n, i) => {
          n.textContent = current[i].join("");
        });
      }, speed);
    }

    const cleanups: (() => void)[] = [];
    elements.forEach((el) => {
      el.addEventListener("mouseenter", handleMouseEnter);
      cleanups.push(() => el.removeEventListener("mouseenter", handleMouseEnter));
    });

    const handleBreakpoint = () => {
      // If resized to mobile, no-op (listeners just won't fire meaningfully)
    };
    mql.addEventListener("change", handleBreakpoint);

    return () => {
      cleanups.forEach((fn) => fn());
      mql.removeEventListener("change", handleBreakpoint);
    };
  }, [containerRef, selector, enabled, speed]);
}
