import React from "react";
import ReactDOM from "react-dom/client";
import ErrorBoundary from "./components/ErrorBoundary";
import { AppProvider } from "./context/AppContext";
import App from "./App";

const root = ReactDOM.createRoot(document.getElementById("root")!);
root.render(
  <ErrorBoundary>
    <AppProvider>
      <App />
    </AppProvider>
  </ErrorBoundary>
);
 