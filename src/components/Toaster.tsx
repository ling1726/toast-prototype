import { Portal } from "@fluentui/react-portal";
import React from "react";
import { ToastPosition, useToastContainer } from "../react-toastify";
import { Toast } from "./Toast";
import { makeStyles, mergeClasses, shorthands } from "@griffel/react";

interface ToasterProps {
  position: ToastPosition;
  targetDocument: Document | null | undefined;
  limit?: number;
  boundary?: HTMLElement;
}

const useStyles = makeStyles({
  container: {
    position: "fixed",
  },
});

export const Toaster: React.FC<ToasterProps> = (props) => {
  const { targetDocument, limit, boundary } = props;
  const { containerRef, getToastToRender, isToastActive, positions } = useToastContainer({
    targetDocument,
    limit,
    boundary,
  });


  const styles = useStyles();

  return (
    <Portal>
      <div
        ref={containerRef}
      >
        {getToastToRender((position, toasts) => {
          const positionStyles = positions[position];
          return (
            <div key={position} style={positionStyles} className={mergeClasses(styles.container)}>
              {toasts.map(({ content, props: toastProps }, i) => {
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
              })}
            </div>
          );
        })}
      </div>
    </Portal>
  );
};
