import React, { memo } from "react";
import { Box, FormHelperText, IconButton } from "@mui/material";
import { useFormImageDropZone } from "./index.hooks";
import { DeleteOutlined } from "@mui/icons-material";

export type FormImageDropZoneProps = {
  name: string;
  helperText: string;
  preview?: boolean;
  accept?: string;
  dragAndDropText?: string;
};

export const FormImageDropZone = memo(
  ({
    name,
    helperText,
    accept,
    preview = true,
    dragAndDropText = "Drag 'n' drop an image or click to select",
  }: FormImageDropZoneProps) => {
    const {
      value,
      error,
      getRootProps,
      getInputProps,
      dragAndDropError,
      handleRemove,
      isDragActive,
    } = useFormImageDropZone(name, accept);

    return (
      <>
        <Box
          component={"div"}
          {...getRootProps()}
          sx={{
            display: !value ? "block" : "none",
            cursor: "pointer",
            border:
              dragAndDropError || error
                ? "2px dashed #F00"
                : isDragActive
                ? "2px dashed #33e"
                : "2px dashed #E8E8E8",
            background: isDragActive ? "#f0f0f0" : undefined,
            transition: "all .2s",
            borderRadius: "4px",
            padding: "10px 10px 10px 10px",
            "&:hover": {
              background: "#fafafa",
              border: "2px dashed #ccc",
            },
          }}
        >
          <Box component={"div"}>
            <input {...getInputProps()} />
            <p>{dragAndDropText}</p>
          </Box>
        </Box>
        {dragAndDropError && (
          <FormHelperText
            error={true}
            sx={{ paddingLeft: "10px", color: "#F00" }}
          >
            {helperText}
          </FormHelperText>
        )}

        {preview && !!value && (
          <Box
            component={"div"}
            sx={{
              height: "150px",
              width: "150px",
              alignSelf: "center",
            }}
          >
            <Box
              component={"img"}
              src={value.fileData}
              sx={{
                alignSelf: "center",
                height: "100%",
                width: "100%",
                objectFit: "cover",
                transition: "0.5s ease",
                "&:hover": {
                  opacity: "0.7",
                },
              }}
            />

            <IconButton
              onClick={handleRemove}
              size={"small"}
              sx={{
                position: "absolute",
                backgroundColor: "#F00",
                marginLeft: "-40px",
                marginTop: "5px",
              }}
            >
              <DeleteOutlined
                sx={{
                  color: "#FFF",
                }}
              />
            </IconButton>
          </Box>
        )}
      </>
    );
  },
);
FormImageDropZone.displayName = "FormImageDropZone";
