import { useCallback, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { useFormContext } from "react-hook-form";

const convertFileToBase64 = (file: any): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const useFormImageDropZone = (
  name: string,
  setValue: any,
  fileMetadata?: boolean,
) => {
  const {
    control,
    formState: { errors },
    watch,
    trigger,
  } = useFormContext();

  const fileRef = useRef<{ name: string; type: string }>(null);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      trigger(name);
      if (acceptedFiles[0]?.type.startsWith("image/")) {
        const fileName = acceptedFiles[0].name;
        const fileType = acceptedFiles[0].type;
        const base64 = await convertFileToBase64(acceptedFiles[0]);
        !fileMetadata
          ? setValue(name, base64)
          : setValue(name, { fileName, fileType, file: base64 });
        trigger(name);
      }
    },
    [setValue, trigger],
  );

  const [dragAndDropError, setDragAndDropError] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDropRejected: () => {
      setDragAndDropError(true);
    },
    onDropAccepted: () => {
      setDragAndDropError(false);
    },
    onDrop,
    maxFiles: 1,
    accept: "image/*",
  });

  const handleRemove = useCallback(() => {
    fileRef.current = null;
    setValue(name, null);
    trigger(name);
  }, []);

  return {
    getRootProps,
    getInputProps,
    dragAndDropError,
    onDrop,
    handleRemove,
    isDragActive,
    watch,
    control,
    errors,
  };
};
