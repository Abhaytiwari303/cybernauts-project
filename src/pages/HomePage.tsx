import React from "react";
import Sidebar from "../components/Sidebar";
import UserForm from "../components/UserForm";
import GraphView from "../components/GraphView";

const HomePage: React.FC = () => {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <div style={{ width: 280, borderRight: "1px solid #e5e7eb", display: "flex", flexDirection: "column" }}>
        <Sidebar />
        <div style={{ borderTop: "1px solid #e5e7eb", padding: 12 }}>
          <UserForm />
        </div>
      </div>

      <div style={{ flex: 1 }}>
        <GraphView />
      </div>
    </div>
  );
};

export default HomePage;
