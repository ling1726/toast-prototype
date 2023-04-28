import * as React from "react";
import { makeStyles } from '@griffel/react';

const useStyles = makeStyles({
  progress: {
    animationName: {
      from: {
        opacity: 0,
      },
      to: {
        opacity: 0,
      },
    }
  }
});

export const Timer: React.FC<{
  isRunning: boolean;
  timeout: number;
  onTimeout: () => void;
}> = (props) => {
  const styles = useStyles();
  const { isRunning, timeout, onTimeout } = props;
  const ref = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    if (ref.current) {
      ref.current.addEventListener('animationend', onTimeout);

      return () => ref.current?.removeEventListener('animationend', onTimeout);
    }
  }, []);

  const style: React.CSSProperties = {
    animationDuration: `${timeout}ms`,
    animationPlayState: isRunning ? "running" : "paused",
  };

  if (timeout < 0) {
    return null;
  }

  return <span ref={ref} style={style} className={styles.progress} />;
};
