import { StyleSheet, Text, View, Image } from 'react-native'
import React from 'react'

const Avator = ({ image }) => {
    return (
        <View style={styles.avator}>
            <Image source={image} style={styles.avator} />
        </View>
    )
}

export default Avator

const styles = StyleSheet.create({
    avator: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
})