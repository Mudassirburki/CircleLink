import { FlatList, StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import AppText from '../../components/common/AppText'
import { ms } from '../../utils/responsive'
import { exploreData } from '../../dummyData/Data'
import ExploreCard from '../../components/ui/ExploreCard'
import { COLORS } from '../../utils/theme'
import Ionicons from 'react-native-vector-icons/Ionicons'

import { useUser } from '../../hooks/useUser'
import { usePosts } from '../../hooks/usePosts'
import { useState } from 'react'

const ExploreScreen = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const { searchUsers, searchResults, searchLoading } = useUser();
    const { posts, loading: postsLoading } = usePosts();

    const handleSearch = (text) => {
        setSearchQuery(text);
        searchUsers(text);
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <View style={styles.searchBar}>
                    <Ionicons name="search" size={ms(20)} color={COLORS.text} />
                    <TextInput
                        placeholder="Search users..."
                        placeholderTextColor={COLORS.text}
                        style={styles.searchInput}
                        value={searchQuery}
                        onChangeText={handleSearch}
                    />
                </View>

                <View style={styles.content}>
                    {searchQuery.length > 0 ? (
                        <FlatList
                            data={searchResults}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <TouchableOpacity style={styles.userItem}>
                                    <View style={styles.userAvatarContainer}>
                                        <Ionicons name="person-circle" size={ms(40)} color={COLORS.grey} />
                                    </View>
                                    <View>
                                        <AppText.body style={styles.userName}>{item.name}</AppText.body>
                                        <AppText.body style={styles.userBio} numberOfLines={1}>{item.bio}</AppText.body>
                                    </View>
                                </TouchableOpacity>
                            )}
                            ListEmptyComponent={() => (
                                <AppText.body style={styles.emptyText}>No users found</AppText.body>
                            )}
                        />
                    ) : (
                        <FlatList
                            data={posts}
                            renderItem={({ item }) => <ExploreCard item={item} />}
                            keyExtractor={(item) => item.id.toString()}
                            numColumns={3}
                            showsVerticalScrollIndicator={false}
                        />
                    )}
                </View>
            </View>
        </SafeAreaView>
    )
}

export default ExploreScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: ms(16),
    },
    searchBar: {
        backgroundColor: COLORS.background,
        height: ms(50),
        borderRadius: ms(16),
        paddingHorizontal: ms(16),
        marginVertical: ms(16),
        borderWidth: 1,
        borderColor: COLORS.border,
        // justifyContent: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        gap: ms(10),

    },
    searchInput: {
        color: COLORS.text,
        fontSize: ms(16),
        flex: 1,
    },
    userItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: ms(10),
        borderBottomWidth: 1,
        borderBottomColor: COLORS.border,
        gap: ms(10),
    },
    userName: {
        fontSize: ms(16),
        fontWeight: 'bold',
        color: COLORS.text,
    },
    userBio: {
        fontSize: ms(12),
        color: COLORS.subtext,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: ms(20),
        color: COLORS.grey,
    },
    content: {
        flex: 1,
    }
})