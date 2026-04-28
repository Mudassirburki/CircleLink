import { useState, useEffect, useCallback, useRef } from 'react';
import { 
    getPaginatedPosts, 
    createPost as createPostService, 
    toggleLike as toggleLikeService, 
    addComment as addCommentService,
    toggleSavePost
} from '../services/PostService';

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

const PAGE_SIZE = 5;

export const usePosts = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [uploading, setUploading] = useState(false);
    
    const lastDoc = useRef(null);
    const isFetching = useRef(false);

    const fetchPosts = useCallback(async (isRefresh = false) => {
        if (isFetching.current) return;
        
        try {
            isFetching.current = true;
            if (isRefresh) {
                setRefreshing(true);
                lastDoc.current = null;
            } else {
                setLoading(true);
            }

            const { posts: newPosts, lastDoc: newLastDoc, hasMore: more } = await getPaginatedPosts(null, PAGE_SIZE);
            
            setPosts(newPosts);
            lastDoc.current = newLastDoc;
            setHasMore(more);
        } catch (error) {
            console.error('Error fetching posts:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
            isFetching.current = false;
        }
    }, []);

    // Real-time listener for current posts in state
    useEffect(() => {
        const postIds = posts.map(p => p.id);
        if (postIds.length === 0) return;

        // Note: Real-time updates for counts only? 
        // A single snapshot for all visible posts is hard with Firestore query limits.
        // Instead, we rely on individual post updates or a limited set.
        // For 'Circle Link', let's just use the onSnapshot(query) pattern for the top posts.
        const unsubscribe = firestore()
            .collection('posts')
            .orderBy('createdAt', 'desc')
            .limit(posts.length || PAGE_SIZE)
            .onSnapshot(snapshot => {
                if (snapshot) {
                    const updatedPosts = snapshot.docs.map(doc => ({
                        id: doc.id,
                        ...doc.data()
                    }));
                    // Merge with current state to preserve pagination logic if needed
                    // For now, replacing with fresh data for common fields
                    setPosts(prev => {
                        return updatedPosts.map(up => {
                            const existing = prev.find(p => p.id === up.id);
                            return existing ? { ...existing, ...up } : up;
                        });
                    });
                }
            });

        return () => unsubscribe();
    }, [posts.length]); // Only re-subscribe if the number of posts changes (pagination)

    const loadMorePosts = useCallback(async () => {
        if (isFetching.current || !hasMore || loadingMore) return;

        try {
            isFetching.current = true;
            setLoadingMore(true);

            const { posts: nextPosts, lastDoc: nextLastDoc, hasMore: more } = await getPaginatedPosts(lastDoc.current, PAGE_SIZE);
            
            if (nextPosts.length > 0) {
                setPosts(prev => [...prev, ...nextPosts]);
                lastDoc.current = nextLastDoc;
                setHasMore(more);
            } else {
                setHasMore(false);
            }
        } catch (error) {
            console.error('Error loading more posts:', error);
        } finally {
            setLoadingMore(false);
            isFetching.current = false;
        }
    }, [hasMore, loadingMore]);

    useEffect(() => {
        fetchPosts();
    }, [fetchPosts]);

    const createPost = useCallback(async (imageUri, caption) => {
        setUploading(true);
        try {
            await createPostService(imageUri, caption);
            // Refresh feed after new post
            fetchPosts(true);
        } finally {
            setUploading(false);
        }
    }, [fetchPosts]);

    const toggleLike = useCallback(async (postId, isLiked) => {
        const userId = auth().currentUser?.uid;
        if (!userId) return;

        // Optimistic UI update
        setPosts(prevPosts => prevPosts.map(post => {
            if (post.id === postId) {
                const newLikesCount = isLiked ? post.likesCount - 1 : post.likesCount + 1;
                const newLikes = isLiked 
                    ? post.likes.filter(id => id !== userId)
                    : [...post.likes, userId];
                return { ...post, likesCount: newLikesCount, likes: newLikes };
            }
            return post;
        }));

        try {
            await toggleLikeService(postId, userId, isLiked);
        } catch (error) {
            console.error('Error toggling like:', error);
            // Rollback if needed (simplified for now)
        }
    }, []);

    const toggleSave = useCallback(async (postId, isSaved) => {
        const userId = auth().currentUser?.uid;
        if (!userId) return;

        // Optimistic UI update
        setPosts(prevPosts => prevPosts.map(post => {
            if (post.id === postId) {
                const currentSavedBy = post.savedBy || [];
                const newSavedBy = isSaved 
                    ? currentSavedBy.filter(id => id !== userId)
                    : [...currentSavedBy, userId];
                return { ...post, savedBy: newSavedBy };
            }
            return post;
        }));

        try {
            await toggleSavePost(postId, userId, isSaved);
        } catch (error) {
            console.error('Error toggling save:', error);
            // Rollback if needed
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
        loadingMore,
        refreshing,
        hasMore,
        uploading,
        fetchPosts: () => fetchPosts(true),
        loadMorePosts,
        createPost,
        toggleLike,
        toggleSave,
        addComment,
    };
};
