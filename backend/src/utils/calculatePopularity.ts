import { IUser } from "../models/User";

/**
 * Popularity formula:
 * popularityScore = uniqueFriends + (sharedHobbiesWithFriends × 0.5)
 */
export const calculatePopularity = (user: IUser, allUsers: IUser[]): number => {
  if (!user || !Array.isArray(user.friends)) return 0;

  const userHobbies = user.hobbies || [];
  const userFriendIds = user.friends.map((f) => f.toString());

  // Create a quick lookup map for performance
  const userMap = new Map(allUsers.map((u) => [u._id.toString(), u]));

  let sharedHobbiesCount = 0;

  for (const friendId of userFriendIds) {
    const friend = userMap.get(friendId);
    if (!friend) continue; // Skip missing/deleted users

    const friendHobbies = friend.hobbies || [];

    // Count shared hobbies safely
    const shared = userHobbies.filter((h) => friendHobbies.includes(h)).length;
    sharedHobbiesCount += shared;
  }

  const uniqueFriends = userFriendIds.length;
  const popularity = uniqueFriends + sharedHobbiesCount * 0.5;

  // Optional: round to one decimal for cleaner UI display
  return Math.round(popularity * 10) / 10;
};
