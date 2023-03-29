import React from "react";
import { Portal } from "@fluentui/react-portal";
import { ToastContext } from "./ToastContainer";

export interface ToastProps {
  name: string;
  children: React.ReactNode;
  imperativeRef: React.RefObject<{ open: () => void; close: () => void }>;
  // TODO implement with priority queue
  priority?: number;
}

export const Toast: React.FC<ToastProps> = ({
  children,
  name,
  imperativeRef,
}) => {
  const { visible, open, close, mountNode } = React.useContext(ToastContext);

  React.useImperativeHandle(
    imperativeRef,
    () => ({
      open: () => open(name),
      close: () => close(name),
    }),
    [name]
  );

  return (
    <>
      {visible.has(name) && (
        <Portal mountNode={mountNode}>
          <div style={{ width: 200, height: 30, border: "2px dashed red" }}>
            {children}
          </div>
        </Portal>
      )}
    </>
  );
};
