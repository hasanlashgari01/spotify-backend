export interface FollowingRaw {
    following_id: string;
    following_fullName: string;
    following_username: string;
    following_avatar: string | null;
    following_role: string;
    isFollowed: string;
}

export interface FollowerRaw {
    follower_id: string;
    follower_fullName: string;
    follower_username: string;
    follower_avatar: string | null;
    follower_role: string;
    isFollowing: string;
}
