import React from "react";
import { motion } from "framer-motion";
import { Handle, Position } from "@xyflow/react";

const HighScoreNode: React.FC<{ data: any }> = ({ data }) => {
  return (
    <motion.div
      layout
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        background: "linear-gradient(135deg, #22c55e, #16a34a)",
        color: "white",
        padding: "10px 14px",
        borderRadius: 10,
        fontSize: 13,
        boxShadow: "0 0 8px rgba(22,163,74,0.5)",
        minWidth: 140,
      }}
    >
      <strong>{data.username}</strong>
      <div>Age: {data.age}</div>
      <div>🔥 Popularity: {data.popularityScore}</div>
      <div style={{ fontSize: 12, opacity: 0.9 }}>
        {data.hobbies?.join(", ") || "No hobbies"}
      </div>

      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </motion.div>
  );
};

export default HighScoreNode;
