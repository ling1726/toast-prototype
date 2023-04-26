import * as React from 'react';

export interface ToastContext {
  closeToast: () => void;
}


const toastContext = React.createContext<ToastContext>({ closeToast: () => null });

export const ToastContextProvider = toastContext.Provider;
export const useToastContext = () => React.useContext(toastContext);