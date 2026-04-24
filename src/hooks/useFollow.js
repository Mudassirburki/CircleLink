import { useState, useEffect, useCallback } from 'react';
import { followUser, unfollowUser, checkIfFollowing } from '../services/FollowService';
import auth from '@react-native-firebase/auth';

export const useFollow = (targetUserId) => {
    const [isFollowing, setIsFollowing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(false);
    const currentUserId = auth().currentUser?.uid;

    const checkStatus = useCallback(async () => {
        if (!currentUserId || !targetUserId || currentUserId === targetUserId) {
            setLoading(false);
            return;
        }
        try {
            const status = await checkIfFollowing(currentUserId, targetUserId);
            setIsFollowing(status);
        } catch (error) {
            console.error('Error checking follow status:', error);
        } finally {
            setLoading(false);
        }
    }, [currentUserId, targetUserId]);

    useEffect(() => {
        checkStatus();
    }, [checkStatus]);

    const toggleFollow = async () => {
        if (!currentUserId || !targetUserId || currentUserId === targetUserId) return;
        
        setActionLoading(true);
        try {
            if (isFollowing) {
                await unfollowUser(currentUserId, targetUserId);
                setIsFollowing(false);
            } else {
                await followUser(currentUserId, targetUserId);
                setIsFollowing(true);
            }
        } catch (error) {
            console.error('Error toggling follow:', error);
        } finally {
            setActionLoading(false);
        }
    };

    return {
        isFollowing,
        loading,
        actionLoading,
        toggleFollow,
    };
};
