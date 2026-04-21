import { StyleSheet, View } from 'react-native'
import React from 'react'
import AppText from '../../components/common/AppText'
import { SafeAreaView } from 'react-native-safe-area-context'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { ms, s, vs } from '../../utils/responsive'
import { COLORS } from '../../utils/theme'
import TopTabBar from '../../navigation/TopTabBar'


const HomeScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <AppText.body style={styles.title}>CircleLink</AppText.body>
                <Ionicons name="notifications-outline" size={24} color={"#000"} />
            </View>
            <View style={{ flex: 1 }}>
                <TopTabBar />

            </View>
        </SafeAreaView>
    )
}

export default HomeScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        paddingTop: vs(10),
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: s(20),
        marginBottom: vs(10),
    },
    title: {
        fontSize: ms(20),
        fontWeight: 'bold',
        color: COLORS.secondary,
    },
})