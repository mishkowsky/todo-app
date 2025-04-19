"use client";
import { useEffect, useRef } from "react";

/**
 * Custom hook to automatically resize a textarea to fit its content
 * @param value The current value of the textarea
 * @returns A ref to be attached to the textarea element
 */
const useAutoResizeTextarea = (value: string) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    // Reset height to auto to get the correct scrollHeight
    textarea.style.height = "auto";

    // Set the height to scrollHeight to fit the content
    textarea.style.height = `${textarea.scrollHeight}px`;

    if (textarea.scrollHeight > 600) {
      textarea.style.height = "600px";
    }

    // Set a minimum height if needed
    if (textarea.scrollHeight < 80) {
      textarea.style.height = "80px";
    }
  }, [value]); // Re-run when value changes

  return textareaRef;
};

export default useAutoResizeTextarea;
