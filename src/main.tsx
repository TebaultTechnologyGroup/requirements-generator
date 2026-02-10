import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Import Amplify config FIRST before anything else
import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";
import "./index.css";
import "@aws-amplify/ui-react/styles.css";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

// components
import LandingPage from "./pages/LandingPage.tsx";
import LoginPage from "./pages/LoginPage.tsx";
import RegisterPage from "./pages/RegisterPage.tsx";
import AppLayout from "./layouts/AppLayout.tsx";
import NewProjectPage from "./pages/NewProjectPage.tsx";
import { Authenticator } from "@aws-amplify/ui-react";

Amplify.configure(outputs);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ThemeProvider theme={createTheme()}>
      <Authenticator.Provider>
        <CssBaseline />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<AppLayout />}>
              <Route index element={<LandingPage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="register" element={<RegisterPage />} />
            </Route>

            {/* Protected routes */}
            <Route path="/app" element={<AppLayout />}>
              <Route path="newproject" element={<NewProjectPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Authenticator.Provider>
    </ThemeProvider>
  </React.StrictMode>,
);

/*

<React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Authenticator>
        {() => <App />}
      </Authenticator>
    </ThemeProvider>
  </React.StrictMode>


*/
