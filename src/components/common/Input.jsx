import { StyleSheet, TextInput, View } from 'react-native';
import { useTheme } from '../../context/ThemeContext'
import { ms, s, vs } from '../../utils/responsive';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Input = ({ placeholder, icon, ...props }) => {
    const { theme } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            {icon && (
                <View style={styles.iconContainer}>
                    <Ionicons name={icon} size={ms(20)} color={theme.colors.primary} />
                </View>
            )}
            <TextInput
                style={[styles.input, { color: theme.colors.text }]}
                placeholder={placeholder}
                placeholderTextColor={theme.colors.subtext}
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
        borderWidth: 1,
        borderRadius: s(15),
        marginVertical: vs(10),
        paddingHorizontal: s(15),
    },
    iconContainer: {
        marginRight: s(10),
    },
    input: {
        flex: 1,
        height: '100%',
        fontSize: ms(16),
        fontWeight: '500',
    },
})