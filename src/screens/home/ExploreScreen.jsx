import { FlatList, StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import AppText from '../../components/common/AppText'
import { ms } from '../../utils/responsive'
import { exploreData } from '../../dummyData/Data'
import ExploreCard from '../../components/ui/ExploreCard'
import { COLORS } from '../../utils/theme'
import Ionicons from 'react-native-vector-icons/Ionicons'

const ExploreScreen = () => {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <View style={styles.container}>
                <View style={styles.searchBar}>
                    <Ionicons name="search" size={ms(20)} color={COLORS.text} />
                    <TextInput
                        placeholder="Search people, tags, places..."
                        placeholderTextColor={COLORS.text}
                        style={styles.searchInput}
                    />
                </View>
                <View style={styles.content}>
                    <FlatList
                        data={exploreData}
                        renderItem={({ item }) => <ExploreCard item={item} />}
                        keyExtractor={(item) => item.id.toString()}
                        numColumns={2}
                        showsVerticalScrollIndicator={false}
                    />
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
    },
})