import { useMemo } from "react";

export const useFormRichTextField = () => {
  const quillFormats = useMemo(
    () => [
      "header",
      "bold",
      "italic",
      "underline",
      "strike",
      "blockquote",
      "color",
      "background",
      "list",
      "bullet",
      "align",
      "indent",
      "link",
    ],
    [],
  );

  const quillModules = useMemo(
    () => ({
      toolbar: [
        [{ header: [1, 2, 3, 4, 5, 6, false] }],
        [
          "bold",
          "italic",
          "underline",
          "strike",
          "blockquote",
          { color: [] },
          { background: [] },
        ],
        [{ list: "ordered" }, { list: "bullet" }],
        [{ indent: "-1" }, { indent: "+1" }],
        [{ align: [] }],
        ["link"],
        ["clean"],
      ],
      clipboard: {
        matchVisual: false,
      },
    }),
    [],
  );

  return {
    quillModules,
    quillFormats,
  };
};
