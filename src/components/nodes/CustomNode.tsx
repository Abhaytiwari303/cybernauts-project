import React, { useEffect, useState } from "react";
import { Handle, Position } from "@xyflow/react";
import { useAppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

interface Props {
  id: string;
  data: any;
}

const CustomNode: React.FC<Props> = ({ id, data }) => {
  const { addHobbyToUser, deleteUser } = useAppContext();

  const [popularity, setPopularity] = useState(data.popularityScore ?? 0);

  // 🔁 Keep local animation smooth when popularity updates
  useEffect(() => {
    const timer = setTimeout(() => setPopularity(data.popularityScore ?? 0), 200);
    return () => clearTimeout(timer);
  }, [data.popularityScore]);

  const onDragOver = (e: React.DragEvent) => e.preventDefault();

  const onDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    const hobby = e.dataTransfer.getData("text/hobby");
    if (!hobby) return;

    try {
      await addHobbyToUser(id, hobby);
      toast.success(`Added hobby "${hobby}"`);
    } catch {
      toast.error("Failed to add hobby");
    }
  };

  // 🎨 Dynamic node visuals
  const intensity = Math.min(popularity / 10, 1); // 0 to 1 scale
  const baseSize = 100 + popularity * 8; // grows with score
  const bgColor =
    popularity > 10
      ? `rgba(34,197,94,${0.5 + intensity * 0.5})` // Deep green
      : popularity > 5
      ? `rgba(59,130,246,${0.5 + intensity * 0.5})` // Blue
      : `rgba(147,197,253,${0.3 + intensity * 0.4})`; // Light blue

  return (
    <div
      onDragOver={onDragOver}
      onDrop={onDrop}
      style={{
        width: baseSize,
        padding: 12,
        borderRadius: 12,
        background: bgColor,
        color: "#fff",
        textAlign: "center",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        transition: "all 0.4s ease", // smooth animation
        transform: `scale(${1 + intensity * 0.1})`, // subtle scaling animation
      }}
    >
      <div style={{ fontWeight: 700, fontSize: 14 }}>{data.username}</div>
      <div style={{ fontSize: 12 }}>{data.age} yrs</div>
      <div style={{ fontSize: 11, opacity: 0.9 }}>
        ⭐ Score: {data.popularityScore ?? 0}
      </div>

      <button
        onClick={async () => {
          const confirmDel = window.confirm(
            `Delete user "${data.username}"? This will unlink all friends first.`
          );
          if (!confirmDel) return;

          try {
            await fetch(
              `${
                process.env.REACT_APP_API_URL || "http://localhost:5000/api"
              }/users/${id}/unlinkAll`,
              { method: "DELETE" }
            );
            await deleteUser(id);
            toast.success("User deleted successfully");
          } catch {
            toast.error("Failed to delete user");
          }
        }}
        style={{
          border: "none",
          background: "rgba(0,0,0,0.35)",
          color: "#fff",
          padding: "4px 10px",
          borderRadius: 8,
          cursor: "pointer",
          fontSize: 12,
          marginTop: 8,
          transition: "background 0.2s ease",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.5)")}
        onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(0,0,0,0.35)")}
      >
        Delete
      </button>

      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
};

export default CustomNode;
