import React from "react";

const Loader: React.FC = () => (
  <div
    style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "100%",
      width: "100%",
      background: "rgba(255,255,255,0.7)",
      position: "absolute",
      top: 0,
      left: 0,
      zIndex: 9999,
    }}
  >
    <div
      style={{
        border: "4px solid #e5e7eb",
        borderTop: "4px solid #2563eb",
        borderRadius: "50%",
        width: 48,
        height: 48,
        animation: "spin 1s linear infinite",
      }}
    />
    <style>
      {`@keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }`}
    </style>
  </div>
);

export default Loader;
