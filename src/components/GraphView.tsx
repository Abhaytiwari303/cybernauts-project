import React, { useCallback, useEffect, useRef } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  Node,
  Edge,
  useReactFlow,
  ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useAppContext } from "../context/AppContext";
import CustomNode from "./nodes/CustomNode";
import toast from "react-hot-toast";

const nodeTypes = { customNode: CustomNode };

const GraphContent: React.FC = () => {
  const {
    nodes,
    edges,
    fetchGraph,
    linkUsers,
    loading,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useAppContext();

  const savedPositions = useRef<Record<string, { x: number; y: number }>>({});
  const { fitView } = useReactFlow();

  // 🧩 Map backend → ReactFlow (preserve node positions)
  const flowNodes: Node[] = nodes.map((n) => {
    const prev = savedPositions.current[n.id];
    const pos =
      prev || n.position || { x: Math.random() * 300, y: Math.random() * 300 };
    savedPositions.current[n.id] = pos;

    return {
      id: n.id,
      position: pos,
      data: {
        username: n.data.username,
        age: n.data.age,
        popularityScore: n.data.popularityScore,
        hobbies: n.data.hobbies,
      },
      type: "customNode",
    };
  });

  const flowEdges: Edge[] = edges.map((e) => ({
    id: e.id,
    source: e.source,
    target: e.target,
  }));

  // 🔗 Connect users
  const onConnect = useCallback(
    async (params: any) => {
      try {
        await linkUsers(params.source, params.target);
        toast.success("Users linked successfully!");
        await fetchGraph();
      } catch (err: any) {
        toast.error(err.response?.data?.error || "Failed to link users");
      }
    },
    [linkUsers, fetchGraph]
  );

  // 🔁 Refresh graph
  const handleRefresh = async () => {
    await fetchGraph();
    toast.success("Graph refreshed!");
  };

  // ⌨️ Keyboard shortcuts for Undo/Redo
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "z") {
        e.preventDefault();
        if (canUndo) undo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === "y") {
        e.preventDefault();
        if (canRedo) redo();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [undo, redo, canUndo, canRedo]);

  return (
    <div
      style={{
        flex: 1,
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {/* Toolbar */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "8px 12px",
          background: "#f3f4f6",
          alignItems: "center",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={undo}
            disabled={!canUndo}
            style={{
              background: canUndo ? "#2563eb" : "#9ca3af",
              color: "white",
              padding: "4px 10px",
              borderRadius: 6,
              border: "none",
              cursor: canUndo ? "pointer" : "not-allowed",
            }}
          >
            ⬅ Undo
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            style={{
              background: canRedo ? "#16a34a" : "#9ca3af",
              color: "white",
              padding: "4px 10px",
              borderRadius: 6,
              border: "none",
              cursor: canRedo ? "pointer" : "not-allowed",
            }}
          >
            Redo ➡
          </button>
        </div>

        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={() => fitView({ padding: 0.2 })}
            style={{
              background: "#10b981",
              border: "none",
              color: "white",
              padding: "5px 10px",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            🎯 Fit View
          </button>
          <button
            onClick={handleRefresh}
            style={{
              background: "#f59e0b",
              border: "none",
              color: "white",
              padding: "5px 10px",
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* Loading Spinner Overlay */}
      {loading && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(255,255,255,0.7)",
            zIndex: 10,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontWeight: 500,
            fontSize: 15,
            color: "#1f2937",
          }}
        >
          <div
            style={{
              border: "4px solid #e5e7eb",
              borderTop: "4px solid #2563eb",
              borderRadius: "50%",
              width: 40,
              height: 40,
              marginRight: 10,
              animation: "spin 1s linear infinite",
            }}
          />
          Loading graph...
          <style>
            {`@keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }`}
          </style>
        </div>
      )}

      {/* React Flow Graph */}
      <div style={{ flex: 1 }}>
        <ReactFlow
          nodes={flowNodes}
          edges={flowEdges}
          nodeTypes={nodeTypes}
          onConnect={onConnect}
          fitView
          fitViewOptions={{ padding: 0.2 }}
          minZoom={0.3}
          maxZoom={2}
          proOptions={{ hideAttribution: true }}
        >
          <MiniMap />
          <Controls />
          <Background gap={16} size={1} />
        </ReactFlow>
      </div>
    </div>
  );
};

// ✅ Wrap GraphContent inside ReactFlowProvider
const GraphView: React.FC = () => (
  <ReactFlowProvider>
    <GraphContent />
  </ReactFlowProvider>
);

export default GraphView;
