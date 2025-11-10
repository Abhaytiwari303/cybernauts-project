import express from "express";

import {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  linkFriend,
  unlinkFriend,
  unlinkAllFriends,
  getGraphData
} from "../controllers/userController";

const router = express.Router();

router.get("/", getUsers);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);
router.post("/:id/link", linkFriend);
router.delete("/:id/unlink", unlinkFriend);
router.delete("/:id/unlinkAll", unlinkAllFriends);
router.get("/graph", getGraphData);

export default router;
