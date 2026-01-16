import React, { memo, useRef, useEffect, useCallback } from "react";
import { useFormVerificationCode } from "./index.hooks";
import { TextField, Stack } from "@mui/material";

export type FormVerificationCodeProps = {
  name: string;
  length?: number;
};

export const FormVerificationCode = memo(
  ({ name, length = 6 }: FormVerificationCodeProps) => {
    const {
      digits,
      handleDigitChange,
      handleDigitKeyDown,
      handlePaste,
      error,
    } = useFormVerificationCode(name, length);

    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
      // Focus first input on mount
      inputRefs.current[0]?.focus();
    }, []);

    return (
      <Stack direction="row" spacing={1.5} justifyContent="center">
        {digits.map((digit, index) => (
          <TextField
            key={index}
            inputRef={(el) => {
              inputRefs.current[index] = el;
            }}
            value={digit}
            onChange={(e) =>
              handleDigitChange(index, e.target.value, inputRefs)
            }
            onKeyDown={(e) =>
              handleDigitKeyDown(
                index,
                e as React.KeyboardEvent<HTMLInputElement>,
                inputRefs,
              )
            }
            inputProps={{
              maxLength: 1,
              style: {
                textAlign: "center",
              },
              onPaste: (e: React.ClipboardEvent<HTMLInputElement>) => {
                handlePaste(index, e, inputRefs);
              },
            }}
            error={!!error}
          />
        ))}
      </Stack>
    );
  },
);
FormVerificationCode.displayName = "FormVerificationCode";
