import React from "react";
import { Toast, ToastProps } from "./Toast";

export const ToastExample: React.FC<Omit<ToastProps, "imperativeRef">> = ({
  name,
  children,
}) => {
  const ref = React.useRef({ open: () => null, close: () => null });

  const onClick = () => {
    ref.current.open();
  };

  const onClickClose = () => {
    ref.current.close();
  };

  return (
    <>
      <button onClick={onClick}>Open {name}</button>{" "}
      <Toast imperativeRef={ref} name={name}>
        {children}
        <button onClick={onClickClose}>Close</button>
      </Toast>
    </>
  );
};
