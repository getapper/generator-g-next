import React, { memo } from "react";
import { Box, FormHelperText, IconButton } from "@mui/material";
import { useFormImageDropZone } from "./index.hooks";
import { Controller } from "react-hook-form";
import { DeleteOutlined } from "@mui/icons-material";

export type FormImageDropZoneProps = {
  name: string;
  helperText: string;
  setValue: any;
  preview?: boolean;
  error: boolean;
  fileMetadata?: boolean;
};

export const FormImageDropZone = memo(
  ({
     name,
     helperText,
     setValue,
     fileMetadata,
     error,
     preview = true,
   }: FormImageDropZoneProps) => {
    const {
      getRootProps,
      getInputProps,
      dragAndDropError,
      handleRemove,
      isDragActive,
      watch,
      control,
    } = useFormImageDropZone(name, setValue, fileMetadata);

    return (
      <>
        <Controller
          control={control}
          name={name!}
          render={({ field: { onChange } }) => {
            return (
              <Box
                component={"div"}
                {...getRootProps()}
                sx={{
                  display: !watch(name) ? "block" : "none",
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
                  <p>Drag 'n' drop an image or click to select</p>
                </Box>
              </Box>
            );
          }}
        />
        {dragAndDropError && (
          <FormHelperText
            error={true}
            sx={{ paddingLeft: "10px", color: "#F00" }}
          >
            {helperText}
          </FormHelperText>
        )}

        {preview && !!watch(name) && (
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
              src={watch(name)}
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
