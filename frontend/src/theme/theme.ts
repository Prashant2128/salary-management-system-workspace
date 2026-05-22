import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#0057D9"
    },
    secondary: {
      main: "#2E7D32"
    }
  },
  shape: {
    borderRadius: 10
  },
  typography: {
    h5: {
      fontWeight: 700
    }
  }
});
