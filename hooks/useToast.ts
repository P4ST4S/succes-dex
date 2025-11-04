import { useState, useCallback } from "react";

interface ToastOptions {
  message: string;
  type: "success" | "error";
  duration?: number;
}

export function useToast() {
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");

  const showToastMessage = useCallback(
    ({ message, type, duration = 3000 }: ToastOptions) => {
      setToastMessage(message);
      setToastType(type);
      setShowToast(true);

      setTimeout(() => {
        setShowToast(false);
      }, duration);
    },
    []
  );

  const hideToast = useCallback(() => {
    setShowToast(false);
  }, []);

  return {
    showToast,
    toastMessage,
    toastType,
    showToastMessage,
    hideToast,
  };
}
