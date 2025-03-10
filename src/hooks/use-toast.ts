
import { useState, useEffect } from "react";

export type ToastActionElement = React.ReactElement<HTMLButtonElement>;

export type ToastProps = {
  id: string;
  title?: string;
  description?: string;
  action?: ToastActionElement;
  variant?: "default" | "destructive";
  duration?: number;
};

export type ToastState = {
  toasts: ToastProps[];
};

const TOAST_LIMIT = 5;
const TOAST_REMOVE_DELAY = 5000;

const actionTypes = {
  ADD_TOAST: "ADD_TOAST",
  UPDATE_TOAST: "UPDATE_TOAST",
  DISMISS_TOAST: "DISMISS_TOAST",
  REMOVE_TOAST: "REMOVE_TOAST",
} as const;

let count = 0;

function generateId() {
  return `toast-${count++}`;
}

type ActionType = typeof actionTypes;

type Action =
  | {
      type: ActionType["ADD_TOAST"];
      toast: ToastProps;
    }
  | {
      type: ActionType["UPDATE_TOAST"];
      toast: Partial<ToastProps>;
    }
  | {
      type: ActionType["DISMISS_TOAST"];
      toastId?: string;
    }
  | {
      type: ActionType["REMOVE_TOAST"];
      toastId?: string;
    };

interface ToastContextType extends ToastState {
  addToast: (props: Omit<ToastProps, "id">) => string;
  updateToast: (id: string, props: Partial<ToastProps>) => void;
  dismissToast: (id: string) => void;
  removeToast: (id: string) => void;
  toast: (props: Omit<ToastProps, "id">) => string;
}

export function useToast(): ToastContextType {
  const [state, setState] = useState<ToastState>({ toasts: [] });

  function dispatch(action: Action) {
    switch (action.type) {
      case actionTypes.ADD_TOAST:
        setState((prevState) => {
          const newToasts = [action.toast, ...prevState.toasts].slice(0, TOAST_LIMIT);
          return { ...prevState, toasts: newToasts };
        });
        return;

      case actionTypes.UPDATE_TOAST:
        setState((prevState) => {
          const { toast } = action;
          const updatedToasts = prevState.toasts.map((t) =>
            t.id === toast.id ? { ...t, ...toast } : t
          );
          return { ...prevState, toasts: updatedToasts };
        });
        return;

      case actionTypes.DISMISS_TOAST:
        const { toastId } = action;
        if (toastId) {
          setState((prevState) => {
            const updatedToasts = prevState.toasts.map((t) =>
              t.id === toastId ? { ...t } : t
            );
            return { ...prevState, toasts: updatedToasts };
          });
        } else {
          setState((prevState) => {
            const updatedToasts = prevState.toasts.map((t) => ({
              ...t,
            }));
            return { ...prevState, toasts: updatedToasts };
          });
        }
        return;

      case actionTypes.REMOVE_TOAST:
        const { toastId: removeId } = action;
        if (removeId) {
          setState((prevState) => {
            const updatedToasts = prevState.toasts.filter((t) => t.id !== removeId);
            return { ...prevState, toasts: updatedToasts };
          });
        } else {
          setState((prevState) => {
            return { ...prevState, toasts: [] };
          });
        }
        return;
    }
  }

  function addToast(props: Omit<ToastProps, "id">): string {
    const id = generateId();
    const toast = { id, ...props } as ToastProps;
    dispatch({ type: actionTypes.ADD_TOAST, toast });
    return id;
  }

  function updateToast(id: string, props: Partial<ToastProps>) {
    dispatch({ type: actionTypes.UPDATE_TOAST, toast: { id, ...props } });
  }

  function dismissToast(id: string) {
    dispatch({ type: actionTypes.DISMISS_TOAST, toastId: id });
  }

  function removeToast(id: string) {
    dispatch({ type: actionTypes.REMOVE_TOAST, toastId: id });
  }

  const toast = addToast;

  return {
    ...state,
    addToast,
    updateToast,
    dismissToast,
    removeToast,
    toast,
  };
}

export const toast = (props: Omit<ToastProps, "id">) => {
  // This is a utility function for non-component usage
  // Create toast event that the Toaster component will handle
  const event = new CustomEvent("toast", { detail: props });
  document.dispatchEvent(event);
  return "";
};
