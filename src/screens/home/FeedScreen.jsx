import { FlatList, StyleSheet, View, Image, ActivityIndicator, RefreshControl } from 'react-native'
import React, { useCallback, useMemo } from 'react'
import AppText from '../../components/common/AppText'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { ms, s, vs } from '../../utils/responsive'
import { COLORS } from '../../utils/theme'
import { storyData } from '../../dummyData/Data'
import PostCard from '../../components/ui/PostCard'
import { usePosts } from '../../hooks/usePosts'

import { useTheme } from '../../context/ThemeContext'

const FeedScreen = () => {
    const { 
        posts, 
        loading, 
        loadingMore, 
        refreshing, 
        hasMore, 
        fetchPosts, 
        loadMorePosts, 
        toggleLike,
        toggleSave 
    } = usePosts();
    const { theme } = useTheme();

    const renderFooter = useCallback(() => {
        if (!loadingMore) return <View style={{ height: vs(20) }} />;
        return (
            <View style={styles.footerLoader}>
                <ActivityIndicator size="small" color={theme.colors.primary} />
                <AppText.body style={[styles.loaderText, { color: theme.colors.subtext }]}>Loading more posts...</AppText.body>
            </View>
        );
    }, [loadingMore, theme]);

    const renderHeader = useMemo(() => (
        <View style={[styles.storyContainer, { borderBottomColor: theme.colors.border }]} >
            <FlatList
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.storyListContent}
                data={[{ id: 'yours', name: 'Your Story', image: null }, ...storyData]}
                renderItem={({ item }) => (
                    <View style={styles.storyItem}>
                        <View style={[
                            styles.storyImageContainer,
                            item.id !== 'yours' && { borderColor: theme.colors.primary, padding: 2 }
                        ]}>
                            {item.id === 'yours' ? (
                                <View style={[styles.yourStoryPlaceholder, { backgroundColor: theme.colors.surface, borderColor: theme.colors.primary }]}>
                                    <Ionicons name="add" size={30} color={theme.colors.primary} />
                                </View>
                            ) : (
                                <Image source={item.image} style={styles.storyImage} />
                            )}
                        </View>
                        <AppText.body style={[styles.storyText, { color: theme.colors.text }]} numberOfLines={1}>{item.name}</AppText.body>
                    </View>
                )}
                keyExtractor={(item) => item.id.toString()}
            />
        </View>
    ), [theme]);

    if (loading && posts.length === 0) {
        return (
            <View style={[styles.container, styles.centerContent, { backgroundColor: theme.colors.background }]}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <AppText.body style={{ marginTop: vs(10), color: theme.colors.text }}>Fetching your feed...</AppText.body>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <FlatList
                data={posts}
                ListHeaderComponent={renderHeader}
                renderItem={({ item }) => (
                    <PostCard
                        post={item}
                        onLike={toggleLike}
                        onSave={toggleSave}
                        onComment={(postId) => console.log('Open comments for', postId)}
                    />
                )}
                keyExtractor={(item) => item.id.toString()}
                contentContainerStyle={styles.feedScrollContent}
                onEndReached={loadMorePosts}
                onEndReachedThreshold={0.5}
                ListFooterComponent={renderFooter}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={fetchPosts}
                        colors={[theme.colors.primary]}
                        tintColor={theme.colors.primary}
                    />
                }
                ListEmptyComponent={
                    !loading && (
                        <View style={styles.centerContent}>
                            <AppText.body style={{ color: theme.colors.subtext }}>No posts found. Start following people!</AppText.body>
                        </View>
                    )
                }
            />
        </View>
    )
}

export default FeedScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    centerContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: vs(50),
    },
    storyContainer: {
        marginTop: vs(5),
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        paddingBottom: vs(10),
    },
    storyListContent: {
        paddingHorizontal: s(20),
    },
    storyItem: {
        alignItems: 'center',
        marginRight: s(15),
        width: s(70),
    },
    storyImageContainer: {
        width: s(66),
        height: s(66),
        borderRadius: s(33),
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'transparent',
    },
    storyRing: {
        borderColor: COLORS.primary,
        padding: 2,
    },
    yourStoryPlaceholder: {
        width: s(60),
        height: s(60),
        borderRadius: s(30),
        backgroundColor: COLORS.border,
        justifyContent: 'center',
        alignItems: 'center',
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: COLORS.primary,
    },
    storyImage: {
        width: s(60),
        height: s(60),
        borderRadius: s(30),
        backgroundColor: COLORS.border,
    },
    storyText: {
        fontSize: ms(11),
        marginTop: vs(5),
        textAlign: 'center',
    },
    feedScrollContent: {
        paddingBottom: vs(20),
    },
    footerLoader: {
        paddingVertical: vs(20),
        alignItems: 'center',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    loaderText: {
        marginLeft: s(10),
        fontSize: ms(13),
        color: COLORS.subtext,
    }
})
