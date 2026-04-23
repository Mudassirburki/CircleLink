import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { postData } from '../../../dummyData/Data';
import PostCard from '../../../components/ui/PostCard';
import { COLORS } from '../../../utils/theme';

import { useState, useEffect } from 'react';
import { getUserPosts } from '../../../services/PostService';
import { usePosts } from '../../../hooks/usePosts';
import auth from '@react-native-firebase/auth';
import AppText from '../../../components/common/AppText';

const UserPosts = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const { toggleLike } = usePosts();
    const userId = auth().currentUser?.uid;

    useEffect(() => {
        if (userId) {
            getUserPosts(userId)
                .then(data => {
                    setPosts(data);
                })
                .catch(err => {
                    console.error('Error in UserPosts fetch:', err);
                })
                .finally(() => {
                    setLoading(false);
                });
        } else {
            setLoading(false);
        }
    }, [userId]);

    if (loading) return (
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
            <AppText.body>Loading posts...</AppText.body>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={posts}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <PostCard
                        post={item}
                        onLike={toggleLike}
                        onComment={(postId) => console.log('Open comments for', postId)}
                    />
                )}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

export default UserPosts;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    listContent: {
        paddingBottom: 20,
    },
});
