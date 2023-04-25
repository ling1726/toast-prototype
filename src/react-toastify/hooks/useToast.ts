import * as React from 'react';

import { Default, Direction, SyntheticEvent } from '../utils';
import { ToastProps } from '../types';

interface Draggable {
  start: number;
  x: number;
  y: number;
  delta: number;
  removalDistance: number;
  canCloseOnClick: boolean;
  canDrag: boolean;
  boundingRect: DOMRect | null;
  didMove: boolean;
}

type DragEvent = MouseEvent & TouchEvent;

function getX(e: DragEvent) {
  return e.targetTouches && e.targetTouches.length >= 1
    ? e.targetTouches[0].clientX
    : e.clientX;
}

function getY(e: DragEvent) {
  return e.targetTouches && e.targetTouches.length >= 1
    ? e.targetTouches[0].clientY
    : e.clientY;
}

export function useToast(props: ToastProps) {
  const [isRunning, setIsRunning] = React.useState(false);
  const [preventExitTransition, setPreventExitTransition] = React.useState(false);
  const toastRef = React.useRef<HTMLDivElement>(null);
  const drag = React.useRef<Draggable>({
    start: 0,
    x: 0,
    y: 0,
    delta: 0,
    removalDistance: 0,
    canCloseOnClick: true,
    canDrag: false,
    boundingRect: null,
    didMove: false
  }).current;
  const syncProps = React.useRef(props);
  const { autoClose, pauseOnHover, closeToast, closeOnClick, targetDocument } = props;

  React.useEffect(() => {
    syncProps.current = props;
  });

  React.useEffect(() => {
    if (toastRef.current)
      toastRef.current.addEventListener(
        SyntheticEvent.ENTRANCE_ANIMATION_END,
        playToast,
        { once: true }
      );
  }, []);

  React.useEffect(() => {
    props.pauseOnFocusLoss && bindFocusEvents();
    return () => {
      props.pauseOnFocusLoss && unbindFocusEvents();
    };
  }, [props.pauseOnFocusLoss]);

  function onDragStart(
    e: React.MouseEvent<HTMLElement, MouseEvent> | React.TouchEvent<HTMLElement>
  ) {
    if (props.draggable) {
      // required for ios safari to prevent default swipe behavior
      if (e.nativeEvent.type === 'touchstart') e.nativeEvent.preventDefault();

      bindDragEvents();
      const toast = toastRef.current!;
      drag.canCloseOnClick = true;
      drag.canDrag = true;
      drag.boundingRect = toast.getBoundingClientRect();
      toast.style.transition = '';
      drag.x = getX(e.nativeEvent as DragEvent);
      drag.y = getY(e.nativeEvent as DragEvent);

      if (props.draggableDirection === Direction.X) {
        drag.start = drag.x;
        drag.removalDistance =
          toast.offsetWidth * (props.draggablePercent / 100);
      } else {
        drag.start = drag.y;
        drag.removalDistance =
          toast.offsetHeight *
          (props.draggablePercent === Default.DRAGGABLE_PERCENT
            ? props.draggablePercent * 1.5
            : props.draggablePercent / 100);
      }
    }
  }

  function onDragTransitionEnd(
    e: React.MouseEvent<HTMLElement, MouseEvent> | React.TouchEvent<HTMLElement>
  ) {
    if (drag.boundingRect) {
      const { top, bottom, left, right } = drag.boundingRect;

      if (
        e.nativeEvent.type !== 'touchend' &&
        props.pauseOnHover &&
        drag.x >= left &&
        drag.x <= right &&
        drag.y >= top &&
        drag.y <= bottom
      ) {
        pauseToast();
      } else {
        playToast();
      }
    }
  }

  function playToast() {
    setIsRunning(true);
  }

  function pauseToast() {
    setIsRunning(false);
  }

  function bindFocusEvents() {
    if (!targetDocument?.hasFocus()) pauseToast();
    const win = targetDocument?.defaultView;

    win?.addEventListener('focus', playToast);
    win?.addEventListener('blur', pauseToast);
  }

  function unbindFocusEvents() {
    const win = targetDocument?.defaultView;

    win?.removeEventListener('focus', playToast);
    win?.removeEventListener('blur', pauseToast);
  }

  function bindDragEvents() {
    drag.didMove = false;
    targetDocument?.addEventListener('mousemove', onDragMove);
    targetDocument?.addEventListener('mouseup', onDragEnd);

    targetDocument?.addEventListener('touchmove', onDragMove);
    targetDocument?.addEventListener('touchend', onDragEnd);
  }

  function unbindDragEvents() {
    targetDocument?.removeEventListener('mousemove', onDragMove);
    targetDocument?.removeEventListener('mouseup', onDragEnd);

    targetDocument?.removeEventListener('touchmove', onDragMove);
    targetDocument?.removeEventListener('touchend', onDragEnd);
  }

  function onDragMove(e: MouseEvent | TouchEvent) {
    const toast = toastRef.current!;
    if (drag.canDrag && toast) {
      drag.didMove = true;
      if (isRunning) pauseToast();
      drag.x = getX(e as DragEvent);
      drag.y = getY(e as DragEvent);
      if (props.draggableDirection === Direction.X) {
        drag.delta = drag.x - drag.start;
      } else {
        drag.delta = drag.y - drag.start;
      }

      // prevent false positif during a toast click
      if (drag.start !== drag.x) drag.canCloseOnClick = false;
      toast.style.transform = `translate${props.draggableDirection}(${drag.delta}px)`;
      toast.style.opacity = `${
        1 - Math.abs(drag.delta / drag.removalDistance)
      }`;
    }
  }

  function onDragEnd() {
    unbindDragEvents();
    const toast = toastRef.current!;
    if (drag.canDrag && drag.didMove && toast) {
      drag.canDrag = false;
      if (Math.abs(drag.delta) > drag.removalDistance) {
        setPreventExitTransition(true);
        props.closeToast();
        return;
      }
      toast.style.transition = 'transform 0.2s, opacity 0.2s';
      toast.style.transform = `translate${props.draggableDirection}(0)`;
      toast.style.opacity = '1';
    }
  }

  const eventHandlers: React.DOMAttributes<HTMLElement> = {
    onMouseDown: onDragStart,
    onTouchStart: onDragStart,
    onMouseUp: onDragTransitionEnd,
    onTouchEnd: onDragTransitionEnd
  };

  if (autoClose && pauseOnHover) {
    eventHandlers.onMouseEnter = pauseToast;
    eventHandlers.onMouseLeave = playToast;
  }

  // prevent toast from closing when user drags the toast
  if (closeOnClick) {
    eventHandlers.onClick = () => {
      drag.canCloseOnClick && closeToast();
    };
  }

  return {
    playToast,
    pauseToast,
    isRunning,
    preventExitTransition,
    toastRef,
    eventHandlers
  };
}
