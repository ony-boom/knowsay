"use server";

import { 
  deleteFriendship, 
  sendFriendRequest as sendRequest, 
  updateFriendshipStatus 
} from "@/lib/friendship/manage-friendship";

/**
 * Send a friend request to another user
 */
export async function sendFriendRequest(requesterId: string, addresseeId: string) {
  return sendRequest(requesterId, addresseeId);
}

/**
 * Accept a friend request
 */
export async function acceptFriendRequest(friendshipId: string, userId: string) {
  return updateFriendshipStatus(friendshipId, userId, 'accepted');
}

/**
 * Decline a friend request
 */
export async function declineFriendRequest(friendshipId: string, userId: string) {
  return updateFriendshipStatus(friendshipId, userId, 'declined');
}

/**
 * Remove a friend (delete the friendship)
 */
export async function removeFriend(friendshipId: string, userId: string) {
  return deleteFriendship(friendshipId, userId);
}

/**
 * Block a user
 */
export async function blockUser(friendshipId: string, userId: string) {
  return updateFriendshipStatus(friendshipId, userId, 'blocked');
}
