import express from "express";
import cors from "cors";
import morgan from "morgan";
import userRoutes from "./routes/userRoutes";

const app = express();

app.use(cors());
app.use(express.json());

app.use(morgan("dev"));

app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send("🚀 Cybernauts API is running...");
});

export default app;
