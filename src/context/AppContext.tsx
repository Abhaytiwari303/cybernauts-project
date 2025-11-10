import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import api from "../api/api";
import toast from "react-hot-toast";

export interface NodeData {
  id: string;
  data: {
    username: string;
    age: number;
    popularityScore: number;
    hobbies?: string[];
  };
  position: { x: number; y: number };
}

export interface EdgeData {
  id: string;
  source: string;
  target: string;
}

interface AppContextType {
  nodes: NodeData[];
  edges: EdgeData[];
  loading: boolean;
  error: string | null;
  fetchGraph: () => Promise<void>;
  createUser: (payload: { username: string; age: number; hobbies: string[] }) => Promise<void>;
  updateUser: (id: string, payload: { username?: string; age?: number; hobbies?: string[] }) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  linkUsers: (id: string, friendId: string) => Promise<void>;
  unlinkUsers: (id: string, friendId: string) => Promise<void>;
  addHobbyToUser: (userId: string, hobby: string) => Promise<void>;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [nodes, setNodes] = useState<NodeData[]>([]);
  const [edges, setEdges] = useState<EdgeData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 🧩 Undo/Redo stacks
  const [history, setHistory] = useState<{ nodes: NodeData[]; edges: EdgeData[] }[]>([]);
  const [redoStack, setRedoStack] = useState<{ nodes: NodeData[]; edges: EdgeData[] }[]>([]);

  const canUndo = history.length > 0;
  const canRedo = redoStack.length > 0;

  // 🧠 Push current graph to history
  const pushHistory = useCallback(() => {
    setHistory((prev) => [...prev, { nodes: [...nodes], edges: [...edges] }]);
    setRedoStack([]); // clear redo when new change happens
  }, [nodes, edges]);

  // ⬅️ Undo
  const undo = () => {
    if (!canUndo) return;
    const prev = history[history.length - 1];
    setRedoStack((r) => [...r, { nodes, edges }]);
    setNodes(prev.nodes);
    setEdges(prev.edges);
    setHistory((h) => h.slice(0, -1));
  };

  // ➡️ Redo
  const redo = () => {
    if (!canRedo) return;
    const next = redoStack[redoStack.length - 1];
    setHistory((h) => [...h, { nodes, edges }]);
    setNodes(next.nodes);
    setEdges(next.edges);
    setRedoStack((r) => r.slice(0, -1));
  };

  // 🔄 Fetch graph
  const fetchGraph = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/users/graph");
      setNodes(res.data.nodes);
      setEdges(res.data.edges);
      setError(null);
      pushHistory(); // track initial load
    } catch (err: any) {
      setError(err.message || "Failed to load graph");
      toast.error("Failed to load graph");
    } finally {
      setLoading(false);
    }
  }, [pushHistory]);

  useEffect(() => {
    fetchGraph();
  }, []);

  // ➕ Create
  const createUser = async (payload: { username: string; age: number; hobbies: string[] }) => {
    setLoading(true);
    try {
      await api.post("/users", payload);
      toast.success("User created!");
      await fetchGraph();
    } catch (err: any) {
      toast.error("Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  // ✏️ Update
  const updateUser = async (id: string, payload: { username?: string; age?: number; hobbies?: string[] }) => {
    setLoading(true);
    try {
      await api.put(`/users/${id}`, payload);
      toast.success("User updated");
      await fetchGraph();
    } catch (err: any) {
      toast.error("Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  // ❌ Delete
  const deleteUser = async (id: string) => {
    setLoading(true);
    try {
      await api.delete(`/users/${id}`);
      toast.success("User deleted");
      await fetchGraph();
    } catch (err: any) {
      toast.error(err.response?.data?.error || "Unlink all friends before deleting user");
    } finally {
      setLoading(false);
    }
  };

  // 🔗 Link
  const linkUsers = async (id: string, friendId: string) => {
    setLoading(true);
    try {
      await api.post(`/users/${id}/link`, { friendId });
      toast.success("Users linked!");
      await fetchGraph();
    } catch {
      toast.error("Failed to link users");
    } finally {
      setLoading(false);
    }
  };

  // 🔗 Unlink
  const unlinkUsers = async (id: string, friendId: string) => {
    setLoading(true);
    try {
      await api.delete(`/users/${id}/unlink`, { data: { friendId } });
      toast.success("Users unlinked!");
      await fetchGraph();
    } catch {
      toast.error("Failed to unlink users");
    } finally {
      setLoading(false);
    }
  };

  // 🎯 Add hobby
  const addHobbyToUser = async (userId: string, hobby: string) => {
    setLoading(true);
    try {
      const { data: users } = await api.get("/users");
      const target = users.find((u: any) => u._id === userId);
      if (!target) throw new Error("User not found");

      const updatedHobbies = Array.from(new Set([...(target.hobbies || []), hobby]));
      await api.put(`/users/${userId}`, {
        username: target.username,
        age: target.age,
        hobbies: updatedHobbies,
      });

      toast.success(`Added hobby "${hobby}" to ${target.username}`);
      await fetchGraph();
    } catch (err: any) {
      console.error("Error adding hobby:", err);
      toast.error(err.response?.data?.error || "Failed to add hobby");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppContext.Provider
      value={{
        nodes,
        edges,
        loading,
        error,
        fetchGraph,
        createUser,
        updateUser,
        deleteUser,
        linkUsers,
        unlinkUsers,
        addHobbyToUser,
        undo,
        redo,
        canUndo,
        canRedo,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useAppContext must be used within AppProvider");
  return ctx;
};
