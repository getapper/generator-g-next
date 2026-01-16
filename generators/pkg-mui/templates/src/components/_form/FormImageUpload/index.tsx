import React, { memo, useCallback, useRef, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import {
  Box,
  Typography,
  CircularProgress,
  FormHelperText,
} from "@mui/material";
import { CloudUpload } from "@mui/icons-material";

type FormImageUploadValue = File | string | null;

export type FormImageUploadProps = {
  name: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  accept?: string;
  maxSize?: number; // in MB
  helperText?: string;
  /**
   * Optional async handler to upload a file.
   * - If provided, the component will call it and store the returned string into the form.
   * - If not provided, the component will store the selected File into the form.
   */
  onUpload?: (file: File) => Promise<string>;
  /**
   * Optional callback invoked after a successful upload (or file selection if onUpload is not provided).
   */
  onUploaded?: (value: FormImageUploadValue) => void;
};

const FormImageUpload: React.FC<FormImageUploadProps> = ({
  name,
  label,
  required = false,
  disabled = false,
  accept = "image/*",
  maxSize = 5, // 5MB default
  helperText,
  onUpload,
  onUploaded,
}) => {
  const { control, setValue, watch } = useFormContext();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentValue = watch(name) as FormImageUploadValue;

  const handleFileUpload = useCallback(
    async (file: File) => {
      try {
        setIsUploading(true);
        setUploadError(null);

        // Validate file size
        if (file.size > maxSize * 1024 * 1024) {
          throw new Error(`File size must be less than ${maxSize}MB`);
        }

        // Validate file type
        if (!file.type.startsWith("image/")) {
          throw new Error("Please select an image file");
        }

        const nextValue: FormImageUploadValue = onUpload
          ? await onUpload(file)
          : file;

        setValue(name, nextValue as any, { shouldValidate: true });
        onUploaded?.(nextValue);
      } catch (error) {
        setUploadError(
          error instanceof Error ? error.message : "Upload failed",
        );
      } finally {
        setIsUploading(false);
      }
    },
    [maxSize, name, onUpload, onUploaded, setValue],
  );

  const handleFileSelect = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        handleFileUpload(file);
      }
    },
    [handleFileUpload],
  );

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const file = event.dataTransfer.files[0];
      if (file) {
        handleFileUpload(file);
      }
    },
    [handleFileUpload],
  );

  const handleDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
    },
    [],
  );

  const handleClick = useCallback(() => {
    if (!disabled && !isUploading) {
      fileInputRef.current?.click();
    }
  }, [disabled, isUploading]);

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => (
        <Box>
          {label && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              {label}
              {required && " *"}
            </Typography>
          )}

          <Box
            sx={{
              border: `2px dashed ${uploadError || error ? "#D32F2F" : "#D0D5DD"}`,
              borderRadius: "8px",
              padding: "40px",
              textAlign: "center",
              cursor: disabled || isUploading ? "not-allowed" : "pointer",
              opacity: disabled ? 0.6 : 1,
              "&:hover": {
                borderColor:
                  disabled || isUploading
                    ? undefined
                    : "#1976D2",
                backgroundColor:
                  disabled || isUploading
                    ? undefined
                    : "rgba(25, 118, 210, 0.06)",
              },
            }}
            onClick={handleClick}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={accept}
              onChange={handleFileSelect}
              style={{ display: "none" }}
              disabled={disabled || isUploading}
            />

            <CloudUpload
              sx={{
                fontSize: 48,
                color: isUploading
                  ? "#1976D2"
                  : "#98A2B3",
                mb: 2,
              }}
            />

            <Typography
              sx={{
                color: "#667085",
                fontFamily: "var(--Font-family-font-family-body, Inter)",
                fontSize: "var(--Font-size-text-sm, 14px)",
                fontWeight: 400,
                lineHeight: "var(--Line-height-text-sm, 20px)",
                mb: 1,
              }}
            >
              {isUploading
                ? "Uploading..."
                : "Click to upload or drag and drop"}
            </Typography>

            <Typography
              sx={{
                color: "#667085",
                fontFamily: "var(--Font-family-font-family-body, Inter)",
                fontSize: "var(--Font-size-text-xs, 12px)",
                fontWeight: 400,
                lineHeight: "var(--Line-height-text-xs, 18px)",
              }}
            >
              SVG, PNG, JPG or GIF (max. {maxSize}MB)
            </Typography>

            {isUploading && (
              <Box sx={{ mt: 2 }}>
                <CircularProgress size={24} />
              </Box>
            )}

            {currentValue && !isUploading && (
              <Box sx={{ mt: 2 }}>
                <Typography variant="body2" color="success.main">
                  ✓ File uploaded successfully
                </Typography>
              </Box>
            )}
          </Box>

          {(uploadError || error) && (
            <FormHelperText error>
              {uploadError || error?.message}
            </FormHelperText>
          )}

          {helperText && !uploadError && !error && (
            <FormHelperText>{helperText}</FormHelperText>
          )}
        </Box>
      )}
    />
  );
};

export default FormImageUpload;
