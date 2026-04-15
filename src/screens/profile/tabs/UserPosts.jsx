import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { postData } from '../../../dummyData/Data';
import PostCard from '../../../components/ui/PostCard';
import { COLORS } from '../../../utils/theme';

const UserPosts = () => {
    // Filter posts for the current user (burki)
    const userPosts = postData.filter(post => post.user.username === 'burki');

    return (
        <View style={styles.container}>
            <FlatList
                data={userPosts}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <PostCard post={item} />}
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
