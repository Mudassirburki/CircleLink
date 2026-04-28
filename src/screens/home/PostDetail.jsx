import React, { useState, useEffect } from 'react';
import { 
    View, 
    StyleSheet, 
    ActivityIndicator, 
    ScrollView, 
    TouchableOpacity 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { onPostUpdate } from '../../services/PostService';
import { usePosts } from '../../hooks/usePosts';
import PostCard from '../../components/ui/PostCard';
import AppText from '../../components/common/AppText';
import { useTheme } from '../../context/ThemeContext';

const PostDetail = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const { theme } = useTheme();
    const { postId } = route.params;
    const { toggleLike } = usePosts();
    
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!postId) return;

        const unsubscribe = onPostUpdate(postId, (updatedPost) => {
            setPost(updatedPost);
            setLoading(false);
        });

        return () => unsubscribe();
    }, [postId]);

    if (loading) {
        return (
            <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
            </View>
        );
    }

    if (!post) {
        return (
            <View style={[styles.center, { backgroundColor: theme.colors.background }]}>
                <AppText.body style={{ color: theme.colors.subtext }}>Post not found</AppText.body>
            </View>
        );
    }

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <AppText.h3 style={[styles.headerTitle, { color: theme.colors.text }]}>Post</AppText.h3>
                <View style={{ width: 24 }} />
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <PostCard 
                    post={post} 
                    onLike={toggleLike} 
                />
            </ScrollView>
        </SafeAreaView>
    );
};

export default PostDetail;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderBottomWidth: 0.5,
    },
    headerTitle: {
        fontWeight: 'bold',
    },
    scrollContent: {
        paddingTop: 10,
        paddingBottom: 20,
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
