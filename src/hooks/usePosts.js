import { useState, useEffect, useCallback, useRef } from 'react';
import { 
    getPaginatedPosts, 
    createPost as createPostService, 
    toggleLike as toggleLikeService, 
    addComment as addCommentService 
} from '../services/PostService';
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
        addComment,
    };
};
