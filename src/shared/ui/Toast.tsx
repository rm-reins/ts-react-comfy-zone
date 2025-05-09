import * as React from "react";
import { Toast as ToastPrimitive } from "radix-ui";
import { CircleAlert, Info, CircleX, CircleCheck, X } from "lucide-react";

export type ToastVariant = "success" | "error" | "warning" | "info";

interface ToastProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  title: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

const variantStyles = {
  success:
    "bg-green-50 border-green-600 dark:bg-green-700 dark:border-green-500",
  error: "bg-red-50 border-red-600 dark:bg-red-700 dark:border-red-500",
  warning:
    "bg-amber-50 border-amber-600 dark:bg-amber-700 dark:border-amber-500",
  info: "bg-blue-50 border-blue-600 dark:bg-blue-700 dark:border-blue-500",
};

const Toast: React.FC<ToastProps> = ({
  open,
  setOpen,
  title,
  description,
  variant = "info",
  duration = 3000,
}) => {
  return (
    <ToastPrimitive.Provider swipeDirection="right">
      <ToastPrimitive.Root
        className={`grid grid-cols-[auto_max-content] items-center gap-x-4 rounded-xl border p-4 shadow-md ${variantStyles[variant]}
        data-[swipe=cancel]:translate-x-0 
        data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] 
        data-[state=closed]:animate-hide 
        data-[state=open]:animate-slideIn 
        data-[swipe=end]:animate-swipeOut 
        data-[swipe=cancel]:transition-[transform_200ms_ease-out]`}
        open={open}
        onOpenChange={setOpen}
        duration={duration}
      >
        <div className="flex items-start gap-3">
          {variant === "success" && (
            <CircleCheck className="h-5 w-5 text-green-600 dark:text-green-400" />
          )}
          {variant === "error" && (
            <CircleX className="h-5 w-5 text-red-600 dark:text-red-400" />
          )}
          {variant === "warning" && (
            <CircleAlert className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          )}
          {variant === "info" && (
            <Info className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          )}
          <div>
            <ToastPrimitive.Title className="text-sm font-medium text-gray-900 dark:text-white">
              {title}
            </ToastPrimitive.Title>
            {description && (
              <ToastPrimitive.Description className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                {description}
              </ToastPrimitive.Description>
            )}
          </div>
        </div>
        <ToastPrimitive.Close className="rounded-full p-1 text-gray-400 opacity-100 transition-opacity hover:text-gray-900 focus:opacity-100 focus:outline-none focus:ring-2 dark:text-gray-300 dark:hover:text-white">
          <X className="h-4 w-4" />
        </ToastPrimitive.Close>
      </ToastPrimitive.Root>
      <ToastPrimitive.Viewport className="fixed top-0 left-0 z-30 m-0 flex w-[390px] max-w-[100vw] list-none flex-col gap-2.5 p-6 outline-none" />
    </ToastPrimitive.Provider>
  );
};

interface ToastContextType {
  showToast: (props: Omit<ToastProps, "open" | "setOpen">) => void;
}

const ToastContext = React.createContext<ToastContextType | undefined>(
  undefined
);

const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = React.useState<(ToastProps & { id: string })[]>(
    []
  );

  const showToast = React.useCallback(
    (props: Omit<ToastProps, "open" | "setOpen">) => {
      const id = Math.random().toString(36).substring(2, 9);
      setToasts((prevToasts) => [
        ...prevToasts,
        {
          ...props,
          id,
          open: true,
          setOpen: (open) => {
            if (!open) {
              setToasts((prev) => prev.filter((toast) => toast.id !== id));
            }
          },
        },
      ]);

      // Auto remove toast after duration
      setTimeout(() => {
        setToasts((prevToasts) =>
          prevToasts.filter((toast) => toast.id !== id)
        );
      }, props.duration || 3000);
    },
    []
  );

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          {...toast}
        />
      ))}
    </ToastContext.Provider>
  );
};

const useToast = (): ToastContextType => {
  const context = React.useContext(ToastContext);
  if (context === undefined) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export { Toast, useToast, ToastProvider };
