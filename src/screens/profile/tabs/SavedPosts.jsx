import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { postData } from '../../../dummyData/Data';
import PostCard from '../../../components/ui/PostCard';
import { COLORS } from '../../../utils/theme';

const SavedPosts = () => {
    // Filter posts saved by the user
    const savedPosts = postData.filter(post => post.saved);

    return (
        <View style={styles.container}>
            <FlatList
                data={savedPosts}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <PostCard post={item} />}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
            />
        </View>
    );
};

export default SavedPosts;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    listContent: {
        paddingBottom: 20,
    },
});
