import React from "react";

export interface UseTimeoutOptions {
  duration: number;
  isRunning: boolean;
}

export function useTimeout(onTimeout: () => void, options: UseTimeoutOptions) {
  const { duration, isRunning } = options;
  const durationRef = React.useRef(duration);
  const timeoutRef = React.useRef<number | undefined>();
  const startRef = React.useRef(0);

  React.useEffect(() => {
    durationRef.current = duration;
    clearTimeout(timeoutRef.current);
  }, [duration]);

  React.useEffect(() => {
    if (duration < 0) {
      return;
    }

    if (isRunning) {
      timeoutRef.current = setTimeout(onTimeout, durationRef.current);
      startRef.current = Date.now();
    } else {
      if (!timeoutRef.current) {
        return;
      }

      clearTimeout(timeoutRef.current);
      timeoutRef.current = undefined;
      durationRef.current = Date.now() - startRef.current;
    }
  }, [isRunning, duration]);
}
