import React, { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AuthProvider } from "react-oidc-context";

// Configuración con los IDs reales de tu consola de AWS Cognito
const cognitoAuthConfig = {
  authority: "https://cognito-idp.us-east-1.amazonaws.com/us-east-1_xYTGOQsnI",
  client_id: "67i5a8nlr96n5e6n7t3244mjmv",
  redirect_uri: "http://localhost:5173",
  response_type: "code",
  scope: "phone openid email",
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider {...cognitoAuthConfig}>
      <App />
    </AuthProvider>
  </StrictMode>
);
