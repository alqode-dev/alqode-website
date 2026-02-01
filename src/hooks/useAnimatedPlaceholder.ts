import { useState, useEffect, useRef, useCallback } from 'react';

interface UseAnimatedPlaceholderOptions {
  phrases: string[];
  typingSpeed?: number;
  deleteSpeed?: number;
  pauseDuration?: number;
}

interface UseAnimatedPlaceholderReturn {
  placeholder: string;
  isAnimating: boolean;
  onFocus: () => void;
  onBlur: () => void;
  onInput: (hasValue: boolean) => void;
}

export function useAnimatedPlaceholder({
  phrases,
  typingSpeed = 80,
  deleteSpeed = 40,
  pauseDuration = 2000,
}: UseAnimatedPlaceholderOptions): UseAnimatedPlaceholderReturn {
  // Start with first character to avoid any empty state
  const [displayText, setDisplayText] = useState(() => phrases[0]?.charAt(0) || '');
  const [isAnimating, setIsAnimating] = useState(true);

  // All mutable state in a single ref to avoid closure issues
  const animState = useRef({
    phraseIndex: 0,
    charIndex: 1, // Start at 1 since we show first char immediately
    isTyping: true,
    isFocused: false,
    hasUserInput: false,
    isRunning: true,
  });

  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  useEffect(() => {
    const state = animState.current;

    const tick = () => {
      // Check if we should stop
      if (state.isFocused || state.hasUserInput || !state.isRunning) {
        return;
      }

      const currentPhrase = phrases[state.phraseIndex];

      if (state.isTyping) {
        // TYPING PHASE
        if (state.charIndex < currentPhrase.length) {
          state.charIndex++;
          setDisplayText(currentPhrase.substring(0, state.charIndex));
          timeoutRef.current = setTimeout(tick, typingSpeed);
        } else {
          // Finished typing - pause then delete
          timeoutRef.current = setTimeout(() => {
            state.isTyping = false;
            tick();
          }, pauseDuration);
        }
      } else {
        // DELETING PHASE - but never go below 1 character
        if (state.charIndex > 1) {
          state.charIndex--;
          setDisplayText(currentPhrase.substring(0, state.charIndex));
          timeoutRef.current = setTimeout(tick, deleteSpeed);
        } else {
          // At 1 char - switch to next phrase's first char (seamless transition)
          state.phraseIndex = (state.phraseIndex + 1) % phrases.length;
          const nextPhrase = phrases[state.phraseIndex];
          state.charIndex = 1;
          state.isTyping = true;
          // Swap to first char of new phrase
          setDisplayText(nextPhrase.charAt(0));
          timeoutRef.current = setTimeout(tick, typingSpeed);
        }
      }
    };

    // Initialize and start
    state.isRunning = true;
    state.phraseIndex = 0;
    state.charIndex = 1;
    state.isTyping = true;
    setDisplayText(phrases[0]?.charAt(0) || '');

    // Small delay before starting to type
    timeoutRef.current = setTimeout(tick, 500);

    return () => {
      clearTimer();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onFocus = useCallback(() => {
    animState.current.isFocused = true;
    setIsAnimating(false);
    clearTimer();
  }, [clearTimer]);

  const onBlur = useCallback(() => {
    const state = animState.current;
    state.isFocused = false;

    if (!state.hasUserInput) {
      setIsAnimating(true);
      // Resume from current position
      const currentPhrase = phrases[state.phraseIndex];

      const tick = () => {
        if (state.isFocused || state.hasUserInput || !state.isRunning) return;

        if (state.isTyping) {
          if (state.charIndex < currentPhrase.length) {
            state.charIndex++;
            setDisplayText(currentPhrase.substring(0, state.charIndex));
            timeoutRef.current = setTimeout(tick, typingSpeed);
          } else {
            timeoutRef.current = setTimeout(() => {
              state.isTyping = false;
              tick();
            }, pauseDuration);
          }
        } else {
          if (state.charIndex > 1) {
            state.charIndex--;
            setDisplayText(currentPhrase.substring(0, state.charIndex));
            timeoutRef.current = setTimeout(tick, deleteSpeed);
          } else {
            state.phraseIndex = (state.phraseIndex + 1) % phrases.length;
            const nextPhrase = phrases[state.phraseIndex];
            state.charIndex = 1;
            state.isTyping = true;
            setDisplayText(nextPhrase.charAt(0));
            timeoutRef.current = setTimeout(tick, typingSpeed);
          }
        }
      };

      state.isRunning = true;
      timeoutRef.current = setTimeout(tick, 300);
    }
  }, [phrases, typingSpeed, deleteSpeed, pauseDuration, clearTimer]);

  const onInput = useCallback((hasValue: boolean) => {
    const state = animState.current;
    state.hasUserInput = hasValue;

    if (hasValue) {
      setIsAnimating(false);
      clearTimer();
    } else if (!state.isFocused) {
      // Resume animation when input is cleared
      setIsAnimating(true);
      state.isRunning = true;

      const currentPhrase = phrases[state.phraseIndex];
      const tick = () => {
        if (state.isFocused || state.hasUserInput || !state.isRunning) return;

        if (state.isTyping) {
          if (state.charIndex < currentPhrase.length) {
            state.charIndex++;
            setDisplayText(currentPhrase.substring(0, state.charIndex));
            timeoutRef.current = setTimeout(tick, typingSpeed);
          } else {
            timeoutRef.current = setTimeout(() => {
              state.isTyping = false;
              tick();
            }, pauseDuration);
          }
        } else {
          if (state.charIndex > 1) {
            state.charIndex--;
            setDisplayText(currentPhrase.substring(0, state.charIndex));
            timeoutRef.current = setTimeout(tick, deleteSpeed);
          } else {
            state.phraseIndex = (state.phraseIndex + 1) % phrases.length;
            const nextPhrase = phrases[state.phraseIndex];
            state.charIndex = 1;
            state.isTyping = true;
            setDisplayText(nextPhrase.charAt(0));
            timeoutRef.current = setTimeout(tick, typingSpeed);
          }
        }
      };

      timeoutRef.current = setTimeout(tick, 300);
    }
  }, [phrases, typingSpeed, deleteSpeed, pauseDuration, clearTimer]);

  return {
    placeholder: displayText,
    isAnimating,
    onFocus,
    onBlur,
    onInput,
  };
}
