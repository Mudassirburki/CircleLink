import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { postData } from '../../../dummyData/Data';
import PostCard from '../../../components/ui/PostCard';
import { COLORS } from '../../../utils/theme';

const LikedPosts = () => {
    // Filter posts liked by the user
    const likedPosts = postData.filter(post => post.liked);

    return (
        <View style={styles.container}>
            <FlatList
                data={likedPosts}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <PostCard 
                        post={item} 
                        onLike={() => {}} 
                        onComment={() => {}}
                    />
                )}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

export default LikedPosts;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    listContent: {
        paddingBottom: 20,
    },
});
