import * as React from "react";

export const Timer: React.FC<{
  isRunning: boolean;
  timeout: number;
  onTimeout: () => void;
}> = (props) => {
  const { isRunning, timeout, onTimeout } = props;
  const ref = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    if (ref.current) {
      ref.current.addEventListener('animationend', onTimeout);

      return () => ref.current?.removeEventListener('animationend', onTimeout);
    }
  }, []);

  const styles: React.CSSProperties = {
    animationDuration: `${timeout}ms`,
    animationPlayState: isRunning ? "running" : "paused",
    animationName: 'none',
  };

  return <span ref={ref} style={styles} />;
};
