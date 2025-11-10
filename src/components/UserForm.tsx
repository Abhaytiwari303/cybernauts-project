import React, { useState } from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const UserForm: React.FC = () => {
  const { createUser, updateUser, nodes } = useAppContext();
  const [username, setUsername] = useState("");
  const [age, setAge] = useState<number | "">("");
  const [hobbies, setHobbies] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !age) return toast.error("Provide username and age");
    try {
      await createUser({ username, age: Number(age), hobbies: hobbies.split(",").map((s) => s.trim()).filter(Boolean) });
      toast.success("User created");
      setUsername(""); setAge(""); setHobbies("");
    } catch (err) {
      toast.error("Failed to create");
    }
  };

  const startEdit = (id: string) => {
    const u = nodes.find((n: any) => n.id === id);
    if (!u) return;
    setEditingId(id);
    setUsername(u.data.username);
    setAge(u.data.age);
    setHobbies((u.data.hobbies || []).join(", "));
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingId) return;
    try {
      await updateUser(editingId, { username, age: Number(age), hobbies: hobbies.split(",").map((s) => s.trim()).filter(Boolean) });
      toast.success("Updated");
      setEditingId(null); setUsername(""); setAge(""); setHobbies("");
    } catch {
      toast.error("Failed to update");
    }
  };

  return (
    <div>
      <form onSubmit={editingId ? handleUpdate : handleCreate} style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <input placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input placeholder="Age" type="number" value={age as any} onChange={(e) => setAge(e.target.value ? Number(e.target.value) : "")} />
        <input placeholder="Hobbies (comma-separated)" value={hobbies} onChange={(e) => setHobbies(e.target.value)} />
        <div style={{ display: "flex", gap: 8 }}>
          <button type="submit">{editingId ? "Save" : "Create"}</button>
          {editingId && <button type="button" onClick={() => { setEditingId(null); setUsername(""); setAge(""); setHobbies(""); }}>Cancel</button>}
        </div>
      </form>

      <hr style={{ margin: "12px 0" }} />

      <div>
        <h4>Quick Edit</h4>
        <ul style={{ maxHeight: 120, overflow: "auto" }}>
          {nodes.map((n) => (
            <li key={n.id} style={{ marginBottom: 6 }}>
              <button onClick={() => startEdit(n.id)} style={{ marginRight: 8 }}>Edit</button>
              {n.data.username} ({n.data.age})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default UserForm;
