import { StyleSheet, TouchableOpacity, Text, Image } from 'react-native';
import { useTheme } from '../../context/ThemeContext'
import { ms, s, vs } from '../../utils/responsive';

const Button = ({ title, onPress, loading }) => {
    const { theme } = useTheme();
    return (
        <TouchableOpacity
            style={[styles.button, { backgroundColor: theme.colors.primary, shadowColor: theme.colors.primary }]}
            onPress={onPress}
            disabled={loading}
        >
            <Text style={[styles.buttonText, { color: '#fff' }]}>{loading ? 'Please wait...' : title}</Text>
        </TouchableOpacity>
    )
}

export const SocialButton = ({ title, onPress, iconType = 'google' }) => {
    const { theme } = useTheme();
    const getIcon = () => {
        switch (iconType) {
            case 'google':
                return require('../../assets/google.png');
            default:
                return require('../../assets/google.png');
        }
    }

    return (
        <TouchableOpacity style={[styles.socialButton, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]} onPress={onPress}>
            <Image source={getIcon()} style={styles.socialIcon} />
            <Text style={[styles.socialButtonText, { color: theme.colors.text }]}>{title}</Text>
        </TouchableOpacity>
    )
}

export default Button

const styles = StyleSheet.create({
    button: {
        width: '90%',
        height: vs(55),
        borderRadius: s(15),
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: vs(15),
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    buttonText: {
        fontSize: ms(18),
        fontWeight: '700',
    },
    socialButton: {
        width: '90%',
        height: vs(55),
        borderRadius: s(15),
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        marginVertical: vs(10),
    },
    socialIcon: {
        width: s(24),
        height: s(24),
        marginRight: s(15),
        resizeMode: 'contain',
    },
    socialButtonText: {
        fontSize: ms(16),
        fontWeight: '600',
    },
})