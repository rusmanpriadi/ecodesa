"use client";

import { toast, Toaster } from "sonner";
import {
  HiXCircle,
  HiCheckCircle,
  HiInformationCircle,
  HiBell,
  HiExclamationTriangle,
  HiXMark,
} from "react-icons/hi2";
import { cn } from "./utils";
import { useState, useEffect } from "react";

// Custom Toaster component with modern styling
export function ModernToaster() {
  return (
    <Toaster
      position="top-center"
      toastOptions={{
        duration: 4000,
        className: "modern-toast",
      }}
      closeButton
    />
  );
}

// Base toast configuration
const baseToastConfig = {
  duration: 4000,
  closeButton: true,
};

// Progress bar component for toasts
const ToastProgressBar = ({ duration = 4000, variant = "default" }) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(interval);
          return 0;
        }
        return prev - 100 / (duration / 100);
      });
    }, 100);

    return () => clearInterval(interval);
  }, [duration]);

  const variantStyles = {
    error: "bg-red-400",
    success: "bg-emerald-400",
    info: "bg-blue-400",
    warning: "bg-amber-400",
    default: "bg-gray-400",
  };

  return (
    <div className="w-full h-1 bg-black/10 rounded-full mt-2 overflow-hidden">
      <div
        className={cn("h-full transition-all", variantStyles[variant])}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
};

// Toast content wrapper
const ToastContent = ({
  message,
  description,
  icon,
  variant = "default",
  duration = 4000,
  onDismiss,
}) => {
  const variantStyles = {
    error: "from-red-500/90 to-red-600/90 text-white",
    success: "from-emerald-500/90 to-emerald-600/90 text-white",
    info: "from-blue-500/90 to-blue-600/90 text-white",
    warning: "from-amber-500/90 to-amber-600/90 text-white",
    default: "from-gray-800/90 to-gray-900/90 text-white",
  };

  return (
    <div
      className={cn(
        "p-4 rounded-xl backdrop-blur-sm bg-gradient-to-br shadow-lg border border-white/10",
        "flex flex-col gap-1 min-w-[300px] max-w-[400px] animate-in fade-in-50 duration-300",
        variantStyles[variant]
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded-full bg-white/20 flex items-center justify-center">
            {icon}
          </div>
          <div>
            <h3 className="font-semibold text-sm">{message}</h3>
            {description && (
              <p className="text-xs opacity-90 mt-0.5">{description}</p>
            )}
          </div>
        </div>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="p-1 rounded-full hover:bg-white/20 transition-colors"
          >
            <HiXMark className="w-4 h-4" />
          </button>
        )}
      </div>
      <ToastProgressBar duration={duration} variant={variant} />
    </div>
  );
};

// Error toast
export const errorToast = (message, options = {}) => {
  const { description, duration = 4000, ...rest } = options;

  return toast.custom(
    (t) => (
      <ToastContent
        message={message}
        description={description}
        icon={<HiXCircle className="w-5 h-5" />}
        variant="error"
        duration={duration}
        onDismiss={() => toast.dismiss(t.id)}
        {...rest}
      />
    ),
    {
      ...baseToastConfig,
      duration,
      ...rest,
    }
  );
};

// Success toast
export const successToast = (message, options = {}) => {
  const { description, duration = 4000, ...rest } = options;

  return toast.custom(
    (t) => (
      <ToastContent
        message={message}
        description={description}
        icon={<HiCheckCircle className="w-5 h-5" />}
        variant="success"
        duration={duration}
        onDismiss={() => toast.dismiss(t.id)}
        {...rest}
      />
    ),
    {
      ...baseToastConfig,
      duration,
      ...rest,
    }
  );
};

// Info toast
export const infoToast = (message, options = {}) => {
  const { description, duration = 4000, ...rest } = options;

  return toast.custom(
    (t) => (
      <ToastContent
        message={message}
        description={description}
        icon={<HiInformationCircle className="w-5 h-5" />}
        variant="info"
        duration={duration}
        onDismiss={() => toast.dismiss(t.id)}
        {...rest}
      />
    ),
    {
      ...baseToastConfig,
      duration,
      ...rest,
    }
  );
};

// Warning toast
export const warningToast = (message, options = {}) => {
  const { description, duration = 4000, ...rest } = options;

  return toast.custom(
    (t) => (
      <ToastContent
        message={message}
        description={description}
        icon={<HiExclamationTriangle className="w-5 h-5" />}
        variant="warning"
        duration={duration}
        onDismiss={() => toast.dismiss(t.id)}
        {...rest}
      />
    ),
    {
      ...baseToastConfig,
      duration,
      ...rest,
    }
  );
};

// Notification toast
export const notificationToast = (message, options = {}) => {
  const { description, duration = 4000, ...rest } = options;

  return toast.custom(
    (t) => (
      <ToastContent
        message={message}
        description={description}
        icon={<HiBell className="w-5 h-5" />}
        variant="default"
        duration={duration}
        onDismiss={() => toast.dismiss(t.id)}
        {...rest}
      />
    ),
    {
      ...baseToastConfig,
      duration,
      ...rest,
    }
  );
};

// Add global CSS to your globals.css file
// .modern-toast {
//   @apply rounded-xl backdrop-blur-sm bg-gradient-to-br from-gray-800/90 to-gray-900/90 text-white shadow-lg border border-white/10;
// }
