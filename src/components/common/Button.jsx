import { Image, StyleSheet, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { s, vs, ms } from '../../utils/responsive'

const Button = ({ title, onPress }) => {
    return (
        <TouchableOpacity style={styles.button} onPress={onPress}>
            <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
    )
}

export const SocialButton = ({ title, onPress, iconType = 'google' }) => {
    const getIcon = () => {
        switch (iconType) {
            case 'google':
                return require('../../assets/google.png');
            // Add more cases as needed (facebook, apple, etc.)
            default:
                return require('../../assets/google.png');
        }
    }

    return (
        <TouchableOpacity style={styles.socialButton} onPress={onPress}>
            <Image source={getIcon()} style={styles.socialIcon} />
            <Text style={styles.socialButtonText}>{title}</Text>
        </TouchableOpacity>
    )
}

export default Button

const styles = StyleSheet.create({
    button: {
        width: '90%',
        height: vs(55),
        backgroundColor: '#AF1A5D',
        borderRadius: s(15),
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: vs(15),
        shadowColor: '#AF1A5D',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: ms(18),
        fontWeight: '700',
    },
    socialButton: {
        width: '90%',
        height: vs(55),
        borderRadius: s(15),
        borderWidth: 1,
        borderColor: '#E5E5EA',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        backgroundColor: '#fff',
        marginVertical: vs(10),
    },
    socialIcon: {
        width: s(24),
        height: s(24),
        marginRight: s(15),
        resizeMode: 'contain',
    },
    socialButtonText: {
        color: '#1C1C1E',
        fontSize: ms(16),
        fontWeight: '600',
    },
})