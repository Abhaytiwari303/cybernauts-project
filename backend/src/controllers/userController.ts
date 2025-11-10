import { Request, Response } from "express";
import User from "../models/User";
import { calculatePopularity } from "../utils/calculatePopularity";

// ✅ Fetch all users
export const getUsers = async (req: Request, res: Response) => {
  const users = await User.find().populate("friends");
  res.json(users);
};

// ✅ Create new user
export const createUser = async (req: Request, res: Response) => {
  try {
    const { username, age, hobbies } = req.body;
    const newUser = new User({ username, age, hobbies, friends: [] });
    await newUser.save();

    // Recompute popularity for all users
    const allUsers = await User.find();
    for (const user of allUsers) {
      user.popularityScore = calculatePopularity(user, allUsers);
      await user.save();
    }

    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ error: "Invalid data" });
  }
};

// ✅ Update user (recalculate popularity live)
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { username, age, hobbies } = req.body;

    const updated = await User.findByIdAndUpdate(
      id,
      { username, age, hobbies },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: "User not found" });

    // 🧮 Recalculate popularity for all users
    const allUsers = await User.find();
    for (const user of allUsers) {
      user.popularityScore = calculatePopularity(user, allUsers);
      await user.save();
    }

    res.json(updated);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Delete user (and recompute popularity)
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return res.status(404).json({ error: "User not found" });

    if (user.friends.length > 0)
      return res
        .status(409)
        .json({ error: "Unlink all friends before deleting user" });

    await user.deleteOne();

    // 🧮 Update popularity for remaining users
    const allUsers = await User.find();
    for (const u of allUsers) {
      u.popularityScore = calculatePopularity(u, allUsers);
      await u.save();
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Link friends (bi-directional)
export const linkFriend = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { friendId } = req.body;

    if (id === friendId)
      return res.status(400).json({ error: "Cannot friend yourself" });

    const user = await User.findById(id);
    const friend = await User.findById(friendId);
    if (!user || !friend)
      return res.status(404).json({ error: "User not found" });

    const alreadyFriends =
      user.friends.includes(friend._id) || friend.friends.includes(user._id);

    if (alreadyFriends)
      return res
        .status(409)
        .json({ error: "Friendship already exists (mutual)" });

    user.friends.push(friend._id);
    friend.friends.push(user._id);

    await user.save();
    await friend.save();

    // 🧮 Update popularity for all users
    const allUsers = await User.find();
    for (const u of allUsers) {
      u.popularityScore = calculatePopularity(u, allUsers);
      await u.save();
    }

    res.json({ message: "Friendship linked successfully" });
  } catch (error) {
    console.error("Error linking friends:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Unlink friends (bi-directional)
export const unlinkFriend = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { friendId } = req.body;

    const user = await User.findById(id);
    const friend = await User.findById(friendId);
    if (!user || !friend)
      return res.status(404).json({ error: "User not found" });

    const wereFriends =
      user.friends.includes(friend._id) && friend.friends.includes(user._id);

    if (!wereFriends)
      return res
        .status(409)
        .json({ error: "These users are not currently linked" });

    user.friends = user.friends.filter(
      (fid) => fid.toString() !== friend._id.toString()
    );
    friend.friends = friend.friends.filter(
      (fid) => fid.toString() !== user._id.toString()
    );

    await user.save();
    await friend.save();

    // 🧮 Update popularity
    const allUsers = await User.find();
    for (const u of allUsers) {
      u.popularityScore = calculatePopularity(u, allUsers);
      await u.save();
    }

    res.json({ message: "Friendship removed successfully" });
  } catch (error) {
    console.error("Error unlinking friends:", error);
    res.status(500).json({ error: "Server error" });
  }
};

// ✅ Unlink all friends
export const unlinkAllFriends = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).populate("friends");

    if (!user) return res.status(404).json({ error: "User not found" });

    for (const friend of user.friends) {
      await User.findByIdAndUpdate(friend._id, {
        $pull: { friends: user._id },
      });
    }

    user.friends = [];
    await user.save();

    // 🧮 Update popularity
    const allUsers = await User.find();
    for (const u of allUsers) {
      u.popularityScore = calculatePopularity(u, allUsers);
      await u.save();
    }

    res.json({ message: "All friends unlinked successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error while unlinking" });
  }
};

// ✅ Get graph data (with hobbies)
export const getGraphData = async (req: Request, res: Response) => {
  try {
    const users = await User.find().populate("friends");

    const nodes = users.map((user) => ({
      id: user._id.toString(),
      data: {
        username: user.username,
        age: user.age,
        popularityScore: user.popularityScore,
        hobbies: user.hobbies || [],
      },
      position: { x: Math.random() * 500, y: Math.random() * 500 },
    }));

    const edges: { id: string; source: string; target: string }[] = [];
    const seenPairs = new Set<string>();

    for (const user of users) {
      for (const friendId of user.friends) {
        const pairKey = [user._id.toString(), friendId.toString()]
          .sort()
          .join("-");
        if (!seenPairs.has(pairKey)) {
          seenPairs.add(pairKey);
          edges.push({
            id: `edge-${pairKey}`,
            source: user._id.toString(),
            target: friendId.toString(),
          });
        }
      }
    }

    res.json({ nodes, edges });
  } catch (error) {
    console.error("Error generating graph:", error);
    res.status(500).json({ error: "Failed to load graph data" });
  }
};
