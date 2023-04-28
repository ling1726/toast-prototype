import React from "react";
import { Transition } from "react-transition-group";
import { makeStyles, mergeClasses, shorthands } from "@griffel/react";
import { useToast, ToastProps } from "../react-toastify";
import { ToastContextProvider } from "../contexts/toastContext";

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
    backgroundColor: 'white',
  },

  slide: {
    animationDuration: "200ms, 400ms",
    animationDelay: "0ms, 200ms",
    animationName: [
      {
        from: {
          height: "0",
          minHeight: "0",
          maxHeight: "0",
          opacity: 0,
        },
        to: {
          opacity: 0,
        },
      },
      {
        from: {
          opacity: 0,
        },
        to: {
          opacity: 1,
        }
      }
    ],
  },

  fadeOut: {
    animationDuration: "400ms, 200ms",
    animationDelay: "0ms, 400ms",
    animationName: [
      {
        from: {
          opacity: 1,
        },
        to: {
          opacity: 0,
        },
      },
      {
        from: {
          opacity: 0,
        },
        to: {
          opacity: 0,
          height: 0,
          maxHeight: 0,
          minHeight: 0,
        },
      },
    ],
  },
});

export const Toast: React.FC<ToastProps> = (props) => {
  const styles = useStyles();
  const { isIn, children, closeToast, deleteToast, autoClose = 3000 } = props;
  const { eventHandlers, toastRef } = useToast(props);

  React.useEffect(() => {
    setTimeout(closeToast, autoClose as number);
  }, []);

  return (
    <Transition
      in={isIn}
      unmountOnExit
      mountOnEnter
      timeout={500}
      onExited={deleteToast}
    >
      <ToastContextProvider value={{ closeToast }}>
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
      </ToastContextProvider>
    </Transition>
  );
};
