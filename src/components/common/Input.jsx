import { StyleSheet, TextInput, View } from 'react-native'
import React from 'react'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { s, vs, ms } from '../../utils/responsive'

const Input = ({ placeholder, icon, ...props }) => {
    return (
        <View style={styles.container}>
            {icon && (
                <View style={styles.iconContainer}>
                    <Ionicons name={icon} size={ms(20)} color="#AF1A5D" />
                </View>
            )}
            <TextInput
                style={styles.input}
                placeholder={placeholder}
                placeholderTextColor="#ccc"
                {...props}
            />
        </View>
    )
}

export default Input

const styles = StyleSheet.create({
    container: {
        width: '90%',
        height: vs(55),
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#E5E5EA',
        borderWidth: 1,
        borderRadius: s(15),
        marginVertical: vs(10),
        backgroundColor: '#fff',
        paddingHorizontal: s(15),
    },
    iconContainer: {
        marginRight: s(10),
    },
    input: {
        flex: 1,
        height: '100%',
        color: '#1C1C1E',
        fontSize: ms(16),
        fontWeight: '500',
    },
})