import * as React from "react";
import {
  canBeRendered,
  isFn,
  isNum,
  isStr,
  getAutoCloseDelay,
  toToastItem,
} from "../utils";
import { eventManager, Event } from "../core/eventManager";

import {
  Id,
  ToastContainerProps,
  ToastProps,
  ToastContent,
  Toast,
  ToastPosition,
  ClearWaitingQueueParams,
  NotValidatedToastProps,
} from "../types";

interface QueuedToast {
  toastContent: ToastContent;
  toastProps: ToastProps;
  staleId?: Id;
}

export interface ContainerInstance {
  toastKey: number;
  displayedToast: number;
  props: ToastContainerProps;
  containerId?: Id | null;
  isToastActive: (toastId: Id) => boolean;
  getToast: (id: Id) => Toast | null | undefined;
  queue: QueuedToast[];
  count: number;
}

export function useToastContainer(props: ToastContainerProps) {
  const [, forceUpdate] = React.useReducer((x) => x + 1, 0);
  const [toastIds, setToastIds] = React.useState<Id[]>([]);
  const containerRef = React.useRef(null);
  const toastToRender = React.useRef(new Map<Id, Toast>()).current;
  const isToastActive = (id: Id) => toastIds.indexOf(id) !== -1;
  const instance = React.useRef<ContainerInstance>({
    toastKey: 1,
    displayedToast: 0,
    count: 0,
    queue: [],
    props,
    containerId: null,
    isToastActive,
    getToast: (id) => toastToRender.get(id),
  }).current;

  const { offset = { horizontal: 0, vertical: 0} } = props;

  React.useEffect(() => {
    instance.containerId = props.containerId;
    const clearToasts = (toastId: Id | undefined) =>
      containerRef.current && removeToast(toastId);
    eventManager
      .cancelEmit(Event.WillUnmount)
      .on(Event.Show, buildToast)
      .on(Event.Clear, clearToasts)
      .on(Event.ClearWaitingQueue, clearWaitingQueue)
      .emit(Event.DidMount, instance);

    return () => {
      eventManager
        .off(Event.Show, buildToast)
        .off(Event.Clear, clearToasts)
        .off(Event.ClearWaitingQueue, clearWaitingQueue);
      toastToRender.clear();
      eventManager.emit(Event.WillUnmount, instance);
    };
  }, []);

  React.useEffect(() => {
    instance.props = props;
    instance.isToastActive = isToastActive;
    instance.displayedToast = toastIds.length;
  });

  function clearWaitingQueue({ containerId }: ClearWaitingQueueParams) {
    const { limit } = instance.props;
    if (limit && (!containerId || instance.containerId === containerId)) {
      instance.count -= instance.queue.length;
      instance.queue = [];
    }
  }

  function removeToast(toastId?: Id) {
    setToastIds((state) =>
      toastId == null ? [] : state.filter((id) => id !== toastId)
    );
  }

  function dequeueToast() {
    const { toastContent, toastProps, staleId } =
      instance.queue.shift() as QueuedToast;
    appendToast(toastContent, toastProps, staleId);
  }

  /**
   * check if a container is attached to the dom
   * check for multi-container, build only if associated
   * check for duplicate toastId if no update
   */
  function isNotValid(options: NotValidatedToastProps) {
    return (
      !containerRef.current ||
      (instance.props.enableMultiContainer &&
        options.containerId !== instance.props.containerId) ||
      (toastToRender.has(options.toastId) && options.updateId == null)
    );
  }

  // this function and all the function called inside needs to rely on refs
  function buildToast(
    content: ToastContent,
    { delay, staleId, ...options }: NotValidatedToastProps
  ) {
    if (!canBeRendered(content) || isNotValid(options)) return;

    const { toastId, updateId, data } = options;
    const { props } = instance;
    const closeToast = () => removeToast(toastId);
    const isNotAnUpdate = updateId == null;

    if (isNotAnUpdate) instance.count++;

    const toastProps: ToastProps = {
      ...props,
      position: props.position ?? "bottom-right",
      draggablePercent: props.draggablePercent ?? 80,
      type: "default",
      key: instance.toastKey++,
      ...Object.fromEntries(
        Object.entries(options).filter(([_, v]) => v != null)
      ),
      toastId,
      updateId,
      data,
      closeToast,
      isIn: false,
      autoClose: options.isLoading
        ? false
        : getAutoCloseDelay(options.autoClose, props.autoClose),
      deleteToast() {
        const removed = toToastItem(toastToRender.get(toastId)!, "removed");
        toastToRender.delete(toastId);

        eventManager.emit(Event.Change, removed);

        const queueLen = instance.queue.length;
        instance.count =
          toastId == null
            ? instance.count - instance.displayedToast
            : instance.count - 1;

        if (instance.count < 0) instance.count = 0;

        if (queueLen > 0) {
          const freeSlot = toastId == null ? instance.props.limit! : 1;

          if (queueLen === 1 || freeSlot === 1) {
            instance.displayedToast++;
            dequeueToast();
          } else {
            const toDequeue = freeSlot > queueLen ? queueLen : freeSlot;
            instance.displayedToast = toDequeue;

            for (let i = 0; i < toDequeue; i++) dequeueToast();
          }
        } else {
          forceUpdate();
        }
      },
    };

    let toastContent = content;

    if (React.isValidElement(content) && !isStr(content.type)) {
      toastContent = React.cloneElement(content as React.ReactElement, {
        closeToast,
        toastProps,
        data,
      });
    } else if (isFn(content)) {
      toastContent = content({ closeToast, toastProps, data });
    }

    // not handling limit + delay by design. Waiting for user feedback first
    if (
      props.limit &&
      props.limit > 0 &&
      instance.count > props.limit &&
      isNotAnUpdate
    ) {
      instance.queue.push({ toastContent, toastProps, staleId });
    } else if (isNum(delay)) {
      setTimeout(() => {
        appendToast(toastContent, toastProps, staleId);
      }, delay);
    } else {
      appendToast(toastContent, toastProps, staleId);
    }
  }

  function appendToast(
    content: ToastContent,
    toastProps: ToastProps,
    staleId?: Id
  ) {
    const { toastId } = toastProps;

    if (staleId) toastToRender.delete(staleId);

    const toast = {
      content,
      props: toastProps,
    };
    toastToRender.set(toastId, toast);

    setToastIds((state) => [...state, toastId].filter((id) => id !== staleId));
    eventManager.emit(
      Event.Change,
      toToastItem(toast, toast.props.updateId == null ? "added" : "updated")
    );
  }

  function getToastToRender<T>(
    cb: (position: ToastPosition, toastList: Toast[]) => T
  ) {
    const toRender = new Map<ToastPosition, Toast[]>();
    const collection = Array.from(toastToRender.values());

    collection.forEach((toast) => {
      const { position } = toast.props;
      toRender.has(position) || toRender.set(position, []);
      toRender.get(position)!.push(toast);
    });

    return Array.from(toRender, ([position, toasts]) => {
      if (position.startsWith("top")) {
        toasts.reverse();
      }

      return cb(position, toasts);
    });
  }

  function getPositionStyles(position: ToastPosition) {
    const containerStyles: React.CSSProperties = {
      position: "fixed",
    };

    let positionStyles: React.CSSProperties = {};
    const { horizontal, vertical } = offset;
    switch (position) {
      case "top-left":
        positionStyles = {
          top: 0 + vertical,
          left: 0 + horizontal,
        };
        break;
      case "top-right":
        positionStyles = {
          top: 0 + vertical,
          right: 0 + horizontal,
        };
        break;
      case "bottom-left":
        positionStyles = {
          bottom: 0 + vertical,
          left: 0 + horizontal,
        };
        break;
      case "bottom-right":
        positionStyles = {
          bottom: 0 + vertical,
          right: 0 + horizontal,
        };
        break;
    }

    Object.assign(containerStyles, positionStyles);
    return containerStyles;
  }

  return {
    getToastToRender,
    containerRef,
    isToastActive,
    getPositionStyles,
  };
}
