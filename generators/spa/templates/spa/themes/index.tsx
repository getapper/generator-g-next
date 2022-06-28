import { createTheme, responsiveFontSizes } from "@mui/material";

export default responsiveFontSizes(
  createTheme({
    palette: {
      primary: {
        main: "#71B9DA",
      },
      secondary: {
        main: "#6291A8",
      },
    },
  })
);
