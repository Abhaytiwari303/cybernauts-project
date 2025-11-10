import React from "react";
import { AppProvider } from "./context/AppContext";
import HomePage from "./pages/HomePage";
import { Toaster } from "react-hot-toast";

const App: React.FC = () => {
  return (
    <AppProvider>
       <Toaster
        position="top-right"
        toastOptions={{
          duration: 2500,
          style: { background: "#1f2937", color: "#fff" },
          success: { iconTheme: { primary: "#22c55e", secondary: "#fff" } },
          error: { iconTheme: { primary: "#ef4444", secondary: "#fff" } },
        }}
      />
      <HomePage />
    </AppProvider>
  );
};

export default App;
