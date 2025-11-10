import React, { useMemo, useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Sidebar: React.FC = () => {
  const { nodes, addHobbyToUser } = useAppContext();
  const [query, setQuery] = useState("");

  // ✅ Collect unique hobbies from all users
  const allHobbies = useMemo(() => {
    const hobbySet = new Set<string>();

    if (!nodes || nodes.length === 0) return [];

    nodes.forEach((node: any) => {
      const hobbies = node?.data?.hobbies || [];
      hobbies.forEach((h: string) => hobbySet.add(h.trim()));
    });

    return Array.from(hobbySet).sort();
  }, [nodes]);

  // ✅ Filtered hobbies based on search input
  const filteredHobbies = useMemo(() => {
    if (!query.trim()) return allHobbies;
    return allHobbies.filter((h) =>
      h.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, allHobbies]);

  // ✅ Handle drag
  const onDragStart = (e: React.DragEvent, hobby: string) => {
    e.dataTransfer.setData("text/hobby", hobby);
    e.dataTransfer.effectAllowed = "copy";
  };

  return (
    <div style={{ padding: 12 }}>
      <h2 style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span>🎯 Hobbies</span>
      </h2>

      {/* Search bar */}
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search hobbies..."
        style={{
          width: "100%",
          padding: 6,
          marginBottom: 8,
          border: "1px solid #ccc",
          borderRadius: 6,
        }}
      />

      {/* Hobbies List */}
      <div>
        {filteredHobbies.length === 0 ? (
          <p style={{ color: "#666", fontSize: 13 }}>No hobbies found</p>
        ) : (
          filteredHobbies.map((hobby) => (
            <div
              key={hobby}
              draggable
              onDragStart={(e) => onDragStart(e, hobby)}
              style={{
                padding: "8px 10px",
                marginBottom: 6,
                background: "#f3f4f6",
                borderRadius: 6,
                cursor: "grab",
                fontSize: 13,
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#e5e7eb")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.background = "#f3f4f6")
              }
            >
              {hobby}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Sidebar;
