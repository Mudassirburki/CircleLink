import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, View, ActivityIndicator } from 'react-native';
import PostCard from '../../../components/ui/PostCard';
import { COLORS } from '../../../utils/theme';
import { useTheme } from '../../../context/ThemeContext';
import { getLikedPosts } from '../../../services/PostService';
import { usePosts } from '../../../hooks/usePosts';
import auth from '@react-native-firebase/auth';
import AppText from '../../../components/common/AppText';

const LikedPosts = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { theme } = useTheme();
    const { toggleLike, toggleSave } = usePosts();
    const userId = auth().currentUser?.uid;

    useEffect(() => {
        if (userId) {
            const unsubscribe = getLikedPosts(userId, (data) => {
                setPosts(data);
                setLoading(false);
            });
            return () => unsubscribe();
        } else {
            setLoading(false);
        }
    }, [userId]);

    if (loading) {
        return (
            <View style={[styles.container, styles.center, { backgroundColor: theme.colors.background }]}>
                <ActivityIndicator size="small" color={theme.colors.primary} />
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <FlatList
                data={posts}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <PostCard
                        post={item}
                        onLike={toggleLike}
                        onSave={toggleSave}
                        onComment={(postId) => console.log('Open comments for', postId)}
                    />
                )}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={() => (
                    <View style={styles.center}>
                        <AppText.body style={{ color: theme.colors.subtext }}>No liked posts yet.</AppText.body>
                    </View>
                )}
            />
        </View>
    );
};

export default LikedPosts;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    listContent: {
        paddingBottom: 20,
    },
});

