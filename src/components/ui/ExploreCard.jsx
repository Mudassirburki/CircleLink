import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { ms } from '../../utils/responsive'
import AppText from '../common/AppText'

const ExploreCard = ({ item }) => {
    return (
        <View style={styles.container}>
            <Image source={item.image} style={styles.image} />

        </View>
    )
}

export default ExploreCard

const styles = StyleSheet.create({
    container: {
        flex: 1,
        margin: ms(5),
    },
    image: {
        width: '100%',
        height: ms(200),
        borderRadius: ms(10),
        resizeMode: 'cover',
        flex: 1,
        aspectRatio: 1,

    },
})