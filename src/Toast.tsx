import React from "react";
import { Transition } from "react-transition-group";
import { makeStyles, mergeClasses, shorthands } from "@griffel/react";
import {
  useToast,
  ToastProps,
} from "./react-toastify";

const useStyles = makeStyles({
  toast: {
    ...shorthands.border("2px", "dashed", "red"),
    ...shorthands.padding("4px"),
    display: "flex",
    minHeight: "40px",
    maxHeight: "40px",
    minWidth: "200px",
    maxWidth: "200px",
    alignItems: "center",
  },

  slide: {
    animationDuration: "200ms",
    animationDelay: '200msms, 0ms',
    animationName: [
      {
        from: {
          transform: "translate3d(0, 110%, 0)",
        },
        to: {
          transform: "translate3d(0, 0, 0)",
        },
      },
      {
        from: {
          height: "0",
          minHeight: "0",
          maxHeight: "0",
        },
        to: {
          height: "40px",
          minHeight: "40px",
          maxHeight: "40px",
        },
      },
    ],
  },

  fadeOut: {
    animationDuration: "400ms",
    animationName: [
      {
        from: {
          opacity: 1,
        },
        to: {
          opacity: 0,
        },
      },
    ],
  },
});

export const Toast: React.FC<ToastProps> = (props) => {
  const styles = useStyles();
  const { isIn, children, closeToast, deleteToast } = props;
  const { eventHandlers, toastRef } = useToast(props);

  React.useEffect(() => {
    setTimeout(closeToast,3000);
  }, []);

  return (
    <Transition in={isIn} unmountOnExit mountOnEnter timeout={300} onExited={deleteToast}>
      <div
        className={mergeClasses(
          styles.toast,
          isIn && styles.slide,
          !isIn && styles.fadeOut
        )}
        ref={toastRef}
        {...eventHandlers}
      >
        {children as React.ReactNode}
      </div>
    </Transition>
  );
};
