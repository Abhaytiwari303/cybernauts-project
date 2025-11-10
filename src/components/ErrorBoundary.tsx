import React from "react";

interface ErrorBoundaryState {
  hasError: boolean;
  message?: string;
}

export default class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  ErrorBoundaryState
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error: any): ErrorBoundaryState {
    return { hasError: true, message: error?.message || "Unexpected error occurred" };
  }

  componentDidCatch(error: any, info: any) {
    console.error("💥 ErrorBoundary caught an error:", error, info);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            height: "100vh",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            background: "#fef2f2",
            color: "#b91c1c",
            textAlign: "center",
            padding: 20,
          }}
        >
          <h2 style={{ fontSize: 22, marginBottom: 8 }}>⚠ Something went wrong.</h2>
          <p style={{ marginBottom: 16 }}>{this.state.message}</p>
          <button
            onClick={this.handleReload}
            style={{
              background: "#b91c1c",
              color: "#fff",
              border: "none",
              padding: "8px 16px",
              borderRadius: 6,
              cursor: "pointer",
              fontWeight: 500,
            }}
          >
            Reload Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
