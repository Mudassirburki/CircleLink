import { useState, useEffect, useCallback } from 'react';
import { getFeedPosts, createPost as createPostService, toggleLike as toggleLikeService, addComment as addCommentService } from '../services/PostService';
import auth from '@react-native-firebase/auth';

export const usePosts = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        let unsubscribeFeed = null;

        const unsubscribeAuth = auth().onAuthStateChanged(user => {
            if (user) {
                // User is signed in, subscribe to feed
                unsubscribeFeed = getFeedPosts((updatedPosts) => {
                    setPosts(updatedPosts);
                    setLoading(false);
                });
            } else {
                // User is signed out
                setPosts([]);
                setLoading(false);
                if (unsubscribeFeed) {
                    unsubscribeFeed();
                    unsubscribeFeed = null;
                }
            }
        });

        return () => {
            unsubscribeAuth();
            if (unsubscribeFeed) unsubscribeFeed();
        };
    }, []);

    const createPost = useCallback(async (imageUri, caption) => {
        setUploading(true);
        try {
            await createPostService(imageUri, caption);
        } finally {
            setUploading(false);
        }
    }, []);

    const toggleLike = useCallback(async (postId, isLiked) => {
        const userId = auth().currentUser?.uid;
        if (!userId) return;
        try {
            await toggleLikeService(postId, userId, isLiked);
        } catch (error) {
            console.error('Error toggling like:', error);
        }
    }, []);

    const addComment = useCallback(async (postId, text) => {
        try {
            await addCommentService(postId, text);
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    }, []);

    return {
        posts,
        loading,
        uploading,
        createPost,
        toggleLike,
        addComment,
    };
};
