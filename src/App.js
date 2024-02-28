import React from 'react';
import { createTheme, ThemeProvider, CssBaseline } from '@mui/material';
import RegistrationForm from "./components/RegistrationForm";

const theme = createTheme({
    palette: {
        background: {
            default: '#f5f5f5', // Grey background
            paper: '#ffffff', // White cards
        },
    }
});

function App() {
  return (
      <ThemeProvider theme={theme}>
          <CssBaseline /> {/* This helps to apply the background color properly */}
          <div style={{ margin: 20 }}>
              <RegistrationForm/>
          </div>
      </ThemeProvider>
  );
}

export default App;
