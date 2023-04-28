import { Portal } from "@fluentui/react-portal";
import React from "react";
import { ToastContainerProps, ToastPosition, useToastContainer } from "../react-toastify";
import { Toast } from "./Toast";
import { makeStyles, mergeClasses, shorthands } from "@griffel/react";

interface ToasterProps extends Pick<ToastContainerProps, 'offset'> {
  position: ToastPosition;
  targetDocument: Document | null | undefined;
  limit?: number;
}

const useStyles = makeStyles({
  container: {
    position: "fixed",
  },
});

export const Toaster: React.FC<ToasterProps> = (props) => {
  const { targetDocument, limit, offset } = props;
  const { containerRef, getToastToRender, isToastActive, getPositionStyles} = useToastContainer({
    targetDocument,
    limit,
    offset,
  });


  const styles = useStyles();

  return (
    <Portal>
      <div
        ref={containerRef}
      >
        {getToastToRender((position, toasts) => {
          return (
            <div key={position} style={getPositionStyles(position)} className={mergeClasses(styles.container)}>
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
