import React, { useCallback, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import useFormField from "@/hooks/useFormField";

const convertFileToBase64 = (file: any): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const useFormImageDropZone = (name: string, accept?: string) => {
  const { value, setValue, error } = useFormField<{
    fileName: string;
    fileType: string;
    fileData: string;
  }>({ name });

  const fileRef = useRef<{ name: string; type: string }>(null);

  const handleDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const fileName = acceptedFiles[0].name;
      const fileType = acceptedFiles[0].type;
      const fileData = await convertFileToBase64(acceptedFiles[0]);
      setValue({ fileName, fileType, fileData });
    },
    [setValue],
  );

  const [dragAndDropError, setDragAndDropError] = useState(false);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDropRejected: () => {
      setDragAndDropError(true);
    },
    onDropAccepted: () => {
      setDragAndDropError(false);
    },
    onDrop: handleDrop,
    maxFiles: 1,
    accept,
  });

  const handleRemove = useCallback(() => {
    fileRef.current = null;
    setValue(null);
  }, [setValue]);

  return {
    value,
    error,
    getRootProps,
    getInputProps,
    dragAndDropError,
    handleDrop,
    handleRemove,
    isDragActive,
  };
};
