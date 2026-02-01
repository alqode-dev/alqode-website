import { useCallback, useRef } from "react";

interface LoadingProgress {
  /** Complete loading immediately */
  clear: () => void;
  /** Animate to 100% and return a promise */
  loaded: () => Promise<number>;
  /** Current percent value */
  percent: number;
}

/**
 * Hook for managing loading progress with proper cleanup
 * Extracted from Loading.tsx setProgress function
 */
export function useLoadingProgress(
  setLoading: (value: number) => void
): LoadingProgress {
  const percentRef = useRef(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const clearAllIntervals = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const clear = useCallback(() => {
    clearAllIntervals();
    percentRef.current = 100;
    setLoading(100);
  }, [clearAllIntervals, setLoading]);

  const loaded = useCallback((): Promise<number> => {
    return new Promise((resolve) => {
      clearAllIntervals();

      intervalRef.current = setInterval(() => {
        if (percentRef.current < 100) {
          percentRef.current++;
          setLoading(percentRef.current);
        } else {
          clearAllIntervals();
          resolve(percentRef.current);
        }
      }, 2);
    });
  }, [clearAllIntervals, setLoading]);

  // Return the interface matching the original setProgress return type
  return {
    clear,
    loaded,
    get percent() {
      return percentRef.current;
    },
  };
}

/**
 * Standalone function version (for Scene.tsx compatibility)
 * This matches the original setProgress signature
 */
export function setProgress(setLoading: (value: number) => void): LoadingProgress {
  let percent = 0;
  let interval: ReturnType<typeof setInterval> | null = null;

  const clearIntervals = () => {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
  };

  // Start initial progress
  interval = setInterval(() => {
    if (percent <= 50) {
      const rand = Math.round(Math.random() * 5);
      percent += rand;
      setLoading(percent);
    } else {
      clearIntervals();
      interval = setInterval(() => {
        percent += Math.round(Math.random());
        setLoading(percent);
        if (percent > 91) {
          clearIntervals();
        }
      }, 2000);
    }
  }, 100);

  return {
    clear: () => {
      clearIntervals();
      setLoading(100);
    },
    loaded: () => {
      return new Promise<number>((resolve) => {
        clearIntervals();
        interval = setInterval(() => {
          if (percent < 100) {
            percent++;
            setLoading(percent);
          } else {
            clearIntervals();
            resolve(percent);
          }
        }, 2);
      });
    },
    get percent() {
      return percent;
    },
  };
}

export default useLoadingProgress;
