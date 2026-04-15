import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import AppText from '../../components/common/AppText'
import { COLORS } from '../../utils/theme'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { ms, s, vs } from '../../utils/responsive'

const LiveScreen = () => {
    return (
        <View style={styles.container}>
            <Ionicons name="videocam-outline" size={s(50)} color={COLORS.secondary} />
            <AppText.body style={styles.text}>No one is live right now.</AppText.body>
        </View>
    )
}

export default LiveScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        marginTop: vs(10),
        color: COLORS.grey,
    }
})
