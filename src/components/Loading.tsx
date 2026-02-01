import { useEffect, useState } from "react";
import "./styles/Loading.css";
import { useLoading } from "../context/LoadingProvider";

import Marquee from "react-fast-marquee";

const Loading = ({ percent }: { percent: number }) => {
  const { setIsLoading } = useLoading();
  const [loaded, setLoaded] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [clicked, setClicked] = useState(false);

  // Handle loading completion - trigger transition when percent hits 100
  useEffect(() => {
    if (percent >= 100 && !loaded) {
      const timer1 = setTimeout(() => {
        setLoaded(true);
      }, 600);
      return () => clearTimeout(timer1);
    }
  }, [percent, loaded]);

  // After loaded, wait then set isLoaded
  useEffect(() => {
    if (loaded && !isLoaded) {
      const timer2 = setTimeout(() => {
        setIsLoaded(true);
      }, 1000);
      return () => clearTimeout(timer2);
    }
  }, [loaded, isLoaded]);

  // After isLoaded, trigger the initial FX and complete loading
  useEffect(() => {
    if (isLoaded && !clicked) {
      setClicked(true);
      import("./utils/initialFX").then((module) => {
        setTimeout(() => {
          if (module.initialFX) {
            module.initialFX();
          }
          setIsLoading(false);
        }, 900);
      });
    }
  }, [isLoaded, clicked, setIsLoading]);

  function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
    const { currentTarget: target } = e;
    const rect = target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    target.style.setProperty("--mouse-x", `${x}px`);
    target.style.setProperty("--mouse-y", `${y}px`);
  }

  return (
    <>
      <div className="loading-header">
        <a href="/#" className="loader-title" data-cursor="disable">
          <span className="logo-bracket">{"{"}</span>alqode<span className="logo-bracket">{"}"}</span>
        </a>
        <div className={`loaderGame ${clicked && "loader-out"}`}>
          <div className="loaderGame-container">
            <div className="loaderGame-in">
              {[...Array(27)].map((_, index) => (
                <div className="loaderGame-line" key={index}></div>
              ))}
            </div>
            <div className="loaderGame-ball"></div>
          </div>
        </div>
      </div>
      <div className="loading-screen">
        <div className="loading-marquee">
          <Marquee>
            <span> Digital Agency</span> <span>Automations</span>
            <span> Web Development</span> <span>3D Experiences</span>
          </Marquee>
        </div>
        <div
          className={`loading-wrap ${clicked && "loading-clicked"}`}
          onMouseMove={(e) => handleMouseMove(e)}
        >
          <div className="loading-hover"></div>
          <div className={`loading-button ${loaded && "loading-complete"}`}>
            <div className="loading-container">
              <div className="loading-content">
                <div className="loading-content-in">
                  Loading <span>{percent}%</span>
                </div>
              </div>
              <div className="loading-box"></div>
            </div>
            <div className="loading-content2">
              <span>Welcome</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Loading;

export const setProgress = (setLoading: (value: number) => void) => {
  let percent = 0;
  let fastInterval: ReturnType<typeof setInterval> | null = null;
  let slowInterval: ReturnType<typeof setInterval> | null = null;

  // Phase 1: Fast initial progress (0-30% in 1.5s)
  fastInterval = setInterval(() => {
    percent += 2;
    setLoading(percent);
    if (percent >= 30) {
      if (fastInterval) clearInterval(fastInterval);
      fastInterval = null;
      // Phase 2: Slow crawl to prevent stall (30-90% over time)
      slowInterval = setInterval(() => {
        if (percent < 90) {
          percent += 1;
          setLoading(percent);
        } else {
          if (slowInterval) clearInterval(slowInterval);
          slowInterval = null;
        }
      }, 300);
    }
  }, 50);

  function clear() {
    if (fastInterval) clearInterval(fastInterval);
    if (slowInterval) clearInterval(slowInterval);
    setLoading(100);
  }

  function loaded() {
    return new Promise<number>((resolve) => {
      // Clear all progress intervals
      if (fastInterval) {
        clearInterval(fastInterval);
        fastInterval = null;
      }
      if (slowInterval) {
        clearInterval(slowInterval);
        slowInterval = null;
      }
      // Quick completion when actually loaded
      const completeInterval = setInterval(() => {
        percent = Math.min(percent + 5, 100);
        setLoading(percent);
        if (percent >= 100) {
          clearInterval(completeInterval);
          resolve(100);
        }
      }, 20);
    });
  }

  return { loaded, percent, clear };
};
