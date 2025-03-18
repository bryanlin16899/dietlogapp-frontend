import { createTheme } from "@mantine/core";

const theme = createTheme({
  breakpoints: {
    xs: "36em",
    sm: "48em",
    md: "62em",
    lg: "75em",
    xl: "88em",
  },
  colors: {
    brand: [
      "#fffae6",  // Lightest
      "#fff3c4",
      "#ffeca0",
      "#ffe57f",
      "#ffd43b",  // Main color
      "#ffc53d",
      "#faad14",
      "#d48806",
      "#ad6800",
      "#874d00",  // Darkest
    ],
  },
});

export default theme;
