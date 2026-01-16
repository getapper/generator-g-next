import useFormField from "@/hooks/useFormField";
import React, { useCallback, useMemo } from "react";
import { KeyboardEvent, ClipboardEvent } from "react";

export const useFormVerificationCode = (name: string, length: number = 6) => {
  const { value, setValue, error } = useFormField<string>({
    name,
  });

  // Split value into array of digits, pad with empty strings
  const digits = useMemo(() => {
    const valueStr = value || "";
    const digitsArray = valueStr.split("").slice(0, length);
    while (digitsArray.length < length) {
      digitsArray.push("");
    }
    return digitsArray;
  }, [value, length]);

  const handleDigitChange = useCallback(
    (
      index: number,
      newValue: string,
      inputRefs: React.MutableRefObject<(HTMLInputElement | null)[]>,
    ) => {
      // Only allow digits
      if (newValue && !/^\d$/.test(newValue)) return;

      const newDigits = [...digits];
      newDigits[index] = newValue;
      const code = newDigits.join("");

      setValue(code);

      // Auto-focus next input if value entered
      if (newValue && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    },
    [digits, length, setValue],
  );

  const handleDigitKeyDown = useCallback(
    (
      index: number,
      e: KeyboardEvent<HTMLInputElement>,
      inputRefs: React.MutableRefObject<(HTMLInputElement | null)[]>,
    ) => {
      if (e.key === "Backspace" && !digits[index] && index > 0) {
        // Move to previous input if current is empty
        inputRefs.current[index - 1]?.focus();
      } else if (e.key === "ArrowLeft" && index > 0) {
        e.preventDefault();
        inputRefs.current[index - 1]?.focus();
      } else if (e.key === "ArrowRight" && index < length - 1) {
        e.preventDefault();
        inputRefs.current[index + 1]?.focus();
      }
    },
    [digits, length],
  );

  const handlePaste = useCallback(
    (
      index: number,
      e: ClipboardEvent<HTMLInputElement>,
      inputRefs: React.MutableRefObject<(HTMLInputElement | null)[]>,
    ) => {
      e.preventDefault();
      const pastedData = e.clipboardData.getData("text");

      // Extract only digits from pasted data
      const digitsOnly = pastedData.replace(/\D/g, "").slice(0, length);

      if (digitsOnly.length === 0) return;

      // Create new digits array
      const newDigits = [...digits];

      // Fill digits starting from the pasted input
      for (let i = 0; i < digitsOnly.length && index + i < length; i++) {
        newDigits[index + i] = digitsOnly[i];
      }

      const code = newDigits.join("");
      setValue(code);

      // Focus the next empty input or the last input
      const nextEmptyIndex = Math.min(index + digitsOnly.length, length - 1);
      setTimeout(() => {
        inputRefs.current[nextEmptyIndex]?.focus();
      }, 0);
    },
    [digits, length, setValue],
  );

  return {
    digits,
    handleDigitChange,
    handleDigitKeyDown,
    handlePaste,
    error,
  };
};
