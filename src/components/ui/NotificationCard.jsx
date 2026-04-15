import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { ms } from '../../utils/responsive'
import AppText from '../common/AppText'
import { COLORS } from '../../utils/theme'

const NotificationCard = ({ item }) => {
    return (
        <View style={styles.container}>
            <View style={styles.notificationContainer}>
                <Image source={item.user.avatar} style={styles.image} />
                <View style={styles.textContainer}>
                    <AppText.body style={styles.textContainer}>{item.user.name} liked your post</AppText.body>
                    <AppText.small style={styles.timeContainer}>{item.timeAgo}</AppText.small>
                </View>

            </View>
        </View>
    )
}

export default NotificationCard

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: ms(10),
    },
    notificationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: ms(10),
        width: '100%',
        height: ms(60),
        borderRadius: ms(20),
        backgroundColor: COLORS.white,
        paddingHorizontal: ms(5),
        paddingVertical: ms(5),
        marginVertical: ms(10),
        marginHorizontal: ms(5),
        borderWidth: 1,
        borderColor: COLORS.border,
        // overflow: 'hidden',
    },

    image: {
        width: ms(50),
        height: ms(50),
        borderRadius: ms(25),
    },

    textContainer: {
        flex: 1,
        justifyContent: 'center',

    },
    timeContainer: {
        flex: 1,
        justifyContent: 'center',
    },

})