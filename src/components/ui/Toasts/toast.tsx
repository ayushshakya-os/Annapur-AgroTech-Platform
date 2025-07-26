import { ToastOptions, toast } from "react-toastify";
type ToastType = "error" | "success" | "warning" | "info";

export const showToast = (
  type: ToastType,
  text: string,
  options?: Partial<ToastOptions>
) => {
  const toastFn = toast[type];
  const toastOptions: ToastOptions = {
    position: "top-right",
    autoClose: 2500,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
    progress: undefined,
    theme: "light",
  };
  toastFn(text, { ...toastOptions, ...options });
};
