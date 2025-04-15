import { supabase } from '../supabase';
import { Friendship, FriendWithDetails } from '@/lib/definitions';



/**
 * Get a user's friends list with full user details
 * @param userId - The ID of the user to get friends for
 * @returns A list of friends with user details
 */
export async function getFriends(userId: string) {
    if (!userId) {
        throw new Error('User ID is required');
    }

    // Get friendships where the user is part of the friendship and the status is accepted
    const { data: friendships, error } = await supabase
        .from('friendships')
        .select(`
            friendship_id,
            user_id1,
            user_id2,
            status,
            created_at
        `)
        .or(`user_id1.eq.${userId},user_id2.eq.${userId}`)
        .eq('status', 'accepted');

    if (error) {
        console.error('Error fetching friends:', error);
        throw new Error('Failed to fetch friends due to an internal error.');
    }

    if (!friendships?.length) {
        return [];
    }

    // Extract the friend IDs (the other user in each friendship)
    const friendIds = friendships.map(friendship => 
        friendship.user_id1 === userId ? friendship.user_id2 : friendship.user_id1
    );

    // Get the user details for all friend IDs
    const { data: friendUsers, error: userError } = await supabase
        .from('users')
        .select('*')
        .in('id', friendIds);

    if (userError) {
        console.error('Error fetching friend user details:', userError);
        throw new Error('Failed to fetch friend details due to an internal error.');
    }

    if (!friendUsers?.length) {
        return [];
    }

    // Combine friendship data with user details
    const friendsWithDetails: FriendWithDetails[] = friendUsers.map(user => {
        const friendship = friendships.find(f => 
            f.user_id1 === user.id || f.user_id2 === user.id
        );
        
        return {
            ...user,
            friendship_id: friendship?.friendship_id || '',
            friendship_status: friendship?.status || 'accepted',
            friendship_created_at: friendship?.created_at || ''
        };
    });

    return friendsWithDetails;
}

/**
 * Get friend requests (pending friendships) for a user
 * @param userId - The ID of the user to get friend requests for
 * @param direction - Whether to get incoming or outgoing requests (default: both)
 * @returns Lists of friend requests with user details
 */
export async function getFriendRequests(
    userId: string, 
    direction: 'incoming' | 'outgoing' | 'both' = 'both'
) {
    if (!userId) {
        throw new Error('User ID is required');
    }

    let query = supabase
        .from('friendships')
        .select(`
            friendship_id,
            user_id1,
            user_id2,
            status,
            created_at
        `)
        .eq('status', 'pending');
    
    // Filter by direction
    if (direction === 'incoming') {
        query = query.eq('user_id2', userId);
    } else if (direction === 'outgoing') {
        query = query.eq('user_id1', userId);
    } else {
        query = query.or(`user_id1.eq.${userId},user_id2.eq.${userId}`);
    }

    const { data: requests, error } = await query;

    if (error) {
        console.error('Error fetching friend requests:', error);
        throw new Error('Failed to fetch friend requests due to an internal error.');
    }

    if (!requests?.length) {
        return { incoming: [], outgoing: [] };
    }

    // Separate incoming and outgoing requests
    const incomingRequests = requests.filter(r => r.user_id2 === userId);
    const outgoingRequests = requests.filter(r => r.user_id1 === userId);
    
    // Get user IDs from requests
    const incomingUserIds = incomingRequests.map(r => r.user_id1);
    const outgoingUserIds = outgoingRequests.map(r => r.user_id2);
    const allUserIds = [...incomingUserIds, ...outgoingUserIds];
    
    if (!allUserIds.length) {
        return { incoming: [], outgoing: [] };
    }

    // Get user details for all requesters/recipients
    const { data: requestUsers, error: userError } = await supabase
        .from('users')
        .select('*')
        .in('id', allUserIds);

    if (userError) {
        console.error('Error fetching request user details:', userError);
        throw new Error('Failed to fetch request details due to an internal error.');
    }

    if (!requestUsers?.length) {
        return { incoming: [], outgoing: [] };
    }

    // Combine request data with user details
    const incomingWithDetails: FriendWithDetails[] = incomingRequests.map(request => {
        const user = requestUsers.find(u => u.id === request.user_id1);
        return user ? {
            ...user,
            friendship_id: request.friendship_id,
            friendship_status: request.status,
            friendship_created_at: request.created_at
        } : null;
    }).filter(Boolean) as FriendWithDetails[];

    const outgoingWithDetails: FriendWithDetails[] = outgoingRequests.map(request => {
        const user = requestUsers.find(u => u.id === request.user_id2);
        return user ? {
            ...user,
            friendship_id: request.friendship_id,
            friendship_status: request.status,
            friendship_created_at: request.created_at
        } : null;
    }).filter(Boolean) as FriendWithDetails[];

    return {
        incoming: incomingWithDetails,
        outgoing: outgoingWithDetails
    };
}

/**
 * Check if a friendship exists between two users
 * @param userId1 - The ID of the first user
 * @param userId2 - The ID of the second user
 * @returns The friendship details or null if no friendship exists
 */
export async function checkFriendship(userId1: string, userId2: string): Promise<Friendship | null> {
    if (!userId1 || !userId2) {
        throw new Error('Both user IDs are required');
    }

    const { data, error } = await supabase
        .from('friendships')
        .select('*')
        .or(`and(user_id1.eq.${userId1},user_id2.eq.${userId2}),and(user_id1.eq.${userId2},user_id2.eq.${userId1})`)
        .maybeSingle();

    if (error) {
        console.error('Error checking friendship:', error);
        throw new Error('Failed to check friendship due to an internal error.');
    }

    return data as Friendship | null;
}

/**
 * Search for potential friends
 * @param userId - The ID of the user searching for friends
 * @param searchTerm - The search term to match against user names or emails
 * @returns A list of users matching the search term, with friendship status if applicable
 */
export async function searchPotentialFriends(userId: string, searchTerm: string) {
    if (!userId) {
        throw new Error('User ID is required');
    }

    if (!searchTerm || searchTerm.length < 2) {
        return [];
    }

    // Get all friendships for the user to exclude existing connections
    const { data: existingFriendships, error: friendshipError } = await supabase
        .from('friendships')
        .select('*')
        .or(`user_id1.eq.${userId},user_id2.eq.${userId}`);

    if (friendshipError) {
        console.error('Error fetching existing friendships:', friendshipError);
        throw new Error('Failed to search for friends due to an internal error.');
    }

    // Get user IDs of existing connections
    const existingConnectionIds = (existingFriendships || []).map(friendship => 
        friendship.user_id1 === userId ? friendship.user_id2 : friendship.user_id1
    );

    // Add current user to the exclusion list
    const excludeIds = [userId, ...existingConnectionIds];

    // Search for users
    const { data: users, error: searchError } = await supabase
        .from('users')
        .select('*')
        .not('id', 'in', `(${excludeIds.join(',')})`)
        .or(`name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`);

    if (searchError) {
        console.error('Error searching for users:', searchError);
        throw new Error('Failed to search for users due to an internal error.');
    }

    return users || [];
}