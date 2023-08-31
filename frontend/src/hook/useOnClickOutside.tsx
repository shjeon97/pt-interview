import { useEffect } from "react";

export const useOnClickOutside = (ref: any, handler: any) => {
  useEffect(() => {
    const handleClick = (event: any) => {
      if (!ref?.current || ref?.current.contains(event.target)) {
        return;
      }

      handler(event);
    };
    document.addEventListener("click", handleClick);

    return () => {
      document.removeEventListener("click", handleClick);
    };
  });
};
