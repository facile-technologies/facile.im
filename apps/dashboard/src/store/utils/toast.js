import {toast} from "sonner"
export const showToast = (type, message) => {
  const options = {
    position: "top-center",
    duration: 4000,
    style: {
      borderRadius: "10px",
      background: "#333",
      color: "#fff",
    },
  };

  switch (type) {
    case "success":
      toast.success(message, options);
      break;
    case "error":
      toast.error(message, options);
      break;
    case "info":
      toast(message, options);
      break;
    default:
      toast(message, options);
  }
};