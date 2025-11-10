import React from "react";
import { motion } from "framer-motion";
import { Handle, Position } from "@xyflow/react";

const LowScoreNode: React.FC<{ data: any }> = ({ data }) => {
  return (
    <motion.div
      layout
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.8, opacity: 0 }}
      transition={{ duration: 0.3 }}
      style={{
        background: "#f3f4f6",
        color: "#1f2937",
        padding: "10px 14px",
        borderRadius: 10,
        border: "1px solid #d1d5db",
        fontSize: 13,
        minWidth: 140,
      }}
    >
      <strong>{data.username}</strong>
      <div>Age: {data.age}</div>
      <div>⭐ Popularity: {data.popularityScore}</div>
      <div style={{ fontSize: 12, opacity: 0.8 }}>
        {data.hobbies?.join(", ") || "No hobbies"}
      </div>

      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </motion.div>
  );
};

export default LowScoreNode;
