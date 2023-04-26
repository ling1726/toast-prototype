import { Portal } from "@fluentui/react-portal";
import React from "react";
import { ToastPosition, useToastContainer } from "./react-toastify";
import { Toast } from "./Toast";
import { makeStyles, mergeClasses, shorthands } from "@griffel/react";

interface ToasterProps {
  position: ToastPosition;
  targetDocument: Document | null | undefined;
  limit?: number;
}

const useStyles = makeStyles({
  container: {
    position: "fixed",
  },

  "top-right": {
    top: 0,
    right: 0,
  },

  "top-center": {
    top: 0,
    left: "50%",
    transform: "translateX(-50%)",
  },

  "top-left": {
    top: 0,
    let: 0,
  },

  "bottom-right": {
    bottom: 0,
    right: 0,
  },

  "bottom-center": {
    bottom: 0,
    left: "50%",
    transform: "translateX(-50%)",
  },

  "bottom-left": {
    bottom: 0,
    left: 0,
  },
});

export const Toaster: React.FC<ToasterProps> = (props) => {
  const { position = "bottom-left", targetDocument, limit } = props;
  const { containerRef, getToastToRender, isToastActive } = useToastContainer({
    newestOnTop: false,
    targetDocument,
    limit,
  });

  const styles = useStyles();

  return (
    <Portal>
      <div
        className={mergeClasses(styles.container, styles[position])}
        ref={containerRef}
      >
        {getToastToRender((position, toasts) => {
          return toasts.map(({ content, props: toastProps }, i) => {
            return (
              <Toast
                {...toastProps}
                key={`toast-${toastProps.key}`}
                isIn={isToastActive(toastProps.toastId)}
              >
                {content as React.ReactNode}
                {toastProps.toastId}
              </Toast>
            );
          });
        })}
      </div>
    </Portal>
  );
};
