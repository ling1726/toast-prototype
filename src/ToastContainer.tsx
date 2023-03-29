import React from "react";
import { Queue } from "./Queue";

interface ToastContext {
  visible: Set<string>;
  open: (name: string) => void;
  close: (name: string) => void;
  mountNode?: HTMLElement;
}

interface ToastContainerProps {
  children: React.ReactNode;
  stackCount?: number;
}

export const ToastContext = React.createContext<ToastContext>({
  visible: new Set<string>(),
  open: () => null,
  close: () => null,
});

export const ToastContainer: React.FC<ToastContainerProps> = (props) => {
  const queue = React.useState(() => new Queue<string>())[0];
  const { children, stackCount = 3 } = props;
  const [visible] = React.useState<Set<string>>(new Set<string>());
  const forceRender = React.useReducer(() => ({}), {})[1];
  const timeouts = React.useRef<Record<string, number>>({});
  const [mountNode, setMountNode] = React.useState<HTMLElement>();

  const close = (name: string) => {
    delete timeouts.current[name];
    console.log("removing", name);
    visible.delete(name);
    if (queue.size) {
      const nextVisible = queue.dequeue()!;
      console.log("dequeueing", nextVisible);
      open(nextVisible);
    }

    forceRender();
  };

  const open = (name: string) => {
    if (visible.size < stackCount) {
      console.log(visible.size, stackCount);
      console.log("adding visible", name);
      visible.add(name);
      forceRender();

      timeouts.current[name] = setTimeout(() => {
        close(name);
        // TODO make duration configurable in `open`
      }, 3000);
    } else {
      console.log("enqueueing", name);
      queue.enqueue(name);
    }
  };

  React.useEffect(() => {
    const mountNode = document.createElement("div");
    document.body.append(mountNode);
    setMountNode(mountNode);
    Object.assign(mountNode.style, {
      position: 'fixed',
      right: 0,
      bottom: 0,
    });
    return () => mountNode.remove();
  }, []);

  return (
    <ToastContext.Provider value={{ visible, open, close, mountNode }}>
      {children}
    </ToastContext.Provider>
  );
};
