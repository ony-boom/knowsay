import { Friendship, FriendshipStatus } from '../definitions';
import { supabase } from '../supabase';

/**
 * Send a friend request to another user
 * @param requesterId - The ID of the user sending the request
 * @param addresseeId - The ID of the user receiving the request
 * @returns The created friendship record
 */
export async function sendFriendRequest(requesterId: string, addresseeId: string) {
    if (!requesterId || !addresseeId) {
        throw new Error('Both requester and addressee IDs are required');
    }

    if (requesterId === addresseeId) {
        throw new Error('Cannot send friend request to yourself');
    }

    // Check if a friendship already exists between these users
    const { data: existingFriendship, error: checkError } = await supabase
        .from('friendships')
        .select('*')
        .or(`and(user_id1.eq.${requesterId},user_id2.eq.${addresseeId}),and(user_id1.eq.${addresseeId},user_id2.eq.${requesterId})`)
        .maybeSingle();

    if (checkError) {
        console.error('Error checking existing friendship:', checkError);
        throw new Error('Failed to send friend request due to an internal error.');
    }

    if (existingFriendship) {
        if (existingFriendship.status === 'blocked') {
            throw new Error('Cannot send friend request to this user');
        }
        throw new Error(`A friendship already exists with status: ${existingFriendship.status}`);
    }

    // Create the friendship record
    const { data, error } = await supabase
        .from('friendships')
        .insert([
            {
                user_id1: requesterId,
                user_id2: addresseeId,
                status: 'pending'
            }
        ])
        .select()
        .single();

    if (error) {
        console.error('Error sending friend request:', error);
        throw new Error('Failed to send friend request due to an internal error.');
    }

    return data as Friendship;
}

/**
 * Update the status of a friendship
 * @param friendshipId - The ID of the friendship to update
 * @param userId - The ID of the user performing the action (must be part of the friendship)
 * @param newStatus - The new status to set
 * @returns The updated friendship record
 */
export async function updateFriendshipStatus(
    friendshipId: string, 
    userId: string, 
    newStatus: FriendshipStatus
) {
    if (!friendshipId || !userId || !newStatus) {
        throw new Error('Friendship ID, user ID, and new status are required');
    }

    // Get the friendship record to verify the user is authorized to update it
    const { data: friendship, error: getError } = await supabase
        .from('friendships')
        .select('*')
        .eq('friendship_id', friendshipId)
        .single();

    if (getError) {
        console.error('Error getting friendship:', getError);
        throw new Error('Failed to update friendship due to an internal error.');
    }

    if (!friendship) {
        throw new Error('Friendship not found');
    }

    // For accepting/declining requests, the user must be the addressee (user_id2)
    if ((newStatus === 'accepted' || newStatus === 'declined') && friendship.user_id2 !== userId) {
        throw new Error('Only the recipient of a friend request can accept or decline it');
    }

    // For blocking, either user can perform this action
    if (newStatus === 'blocked' && friendship.user_id1 !== userId && friendship.user_id2 !== userId) {
        throw new Error('You are not authorized to update this friendship');
    }

    // Update the friendship status
    const { data, error } = await supabase
        .from('friendships')
        .update({ 
            status: newStatus,
            updated_at: new Date().toISOString()
        })
        .eq('friendship_id', friendshipId)
        .select()
        .single();

    if (error) {
        console.error('Error updating friendship status:', error);
        throw new Error('Failed to update friendship due to an internal error.');
    }

    return data as Friendship;
}

/**
 * Delete a friendship between two users
 * @param friendshipId - The ID of the friendship to delete
 * @param userId - The ID of the user performing the deletion (must be part of the friendship)
 * @returns True if deletion was successful
 */
export async function deleteFriendship(friendshipId: string, userId: string) {
    if (!friendshipId || !userId) {
        throw new Error('Friendship ID and user ID are required');
    }

    // Get the friendship record to verify the user is authorized to delete it
    const { data: friendship, error: getError } = await supabase
        .from('friendships')
        .select('*')
        .eq('friendship_id', friendshipId)
        .single();

    if (getError) {
        console.error('Error getting friendship:', getError);
        throw new Error('Failed to delete friendship due to an internal error.');
    }

    if (!friendship) {
        throw new Error('Friendship not found');
    }

    // Verify that the user is part of this friendship
    if (friendship.user_id1 !== userId && friendship.user_id2 !== userId) {
        throw new Error('You are not authorized to delete this friendship');
    }

    // Delete the friendship
    const { error } = await supabase
        .from('friendships')
        .delete()
        .eq('friendship_id', friendshipId);

    if (error) {
        console.error('Error deleting friendship:', error);
        throw new Error('Failed to delete friendship due to an internal error.');
    }

    return true;
}
