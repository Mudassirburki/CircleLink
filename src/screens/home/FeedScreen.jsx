import { FlatList, StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'
import AppText from '../../components/common/AppText'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { ms, s, vs } from '../../utils/responsive'
import { COLORS } from '../../utils/theme'
import { postData, storyData } from '../../dummyData/Data'
import PostCard from '../../components/ui/PostCard'

import { usePosts } from '../../hooks/usePosts'

const FeedScreen = () => {
    const { posts, loading, toggleLike } = usePosts();

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <AppText.body>Loading feed...</AppText.body>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.storyContainer} >
                <FlatList
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.storyListContent}
                    data={[{ id: 'yours', name: 'Your Story', image: null }, ...storyData]}
                    renderItem={({ item, index }) => (
                        <View style={styles.storyItem}>
                            <View style={[
                                styles.storyImageContainer,
                                item.id !== 'yours' && styles.storyRing
                            ]}>
                                {item.id === 'yours' ? (
                                    <View style={styles.yourStoryPlaceholder}>
                                        <Ionicons name="add" size={30} color={COLORS.primary} />
                                    </View>
                                ) : (
                                    <Image
                                        source={item.image}
                                        style={styles.storyImage}
                                    />
                                )}
                            </View>
                            <AppText.body style={styles.storyText} numberOfLines={1}>{item.name}</AppText.body>
                        </View>
                    )}
                    keyExtractor={(item) => item.id.toString()}
                />
            </View>
            <View style={styles.feedContent}>
                <FlatList
                    data={posts}
                    renderItem={({ item }) => (
                        <PostCard
                            post={item}
                            onLike={toggleLike}
                            onComment={(postId) => console.log('Open comments for', postId)}
                        />
                    )}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={{ paddingBottom: vs(20) }}
                />
            </View>
        </View>
    )
}

export default FeedScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    storyContainer: {
        marginTop: vs(10),
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
        borderColor: COLORS.secondary,
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
    feedContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    placeholderText: {
        color: COLORS.grey,
        textAlign: 'center',
    }
})
