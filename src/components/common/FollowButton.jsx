import { StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import { ms } from '../../utils/responsive';
import AppText from './AppText';
import { useFollow } from '../../hooks/useFollow';

const FollowButton = ({ targetUserId, style }) => {
    const { isFollowing, loading, actionLoading, toggleFollow } = useFollow(targetUserId);
    const { theme } = useTheme();

    if (loading) return null;

    return (
        <TouchableOpacity
            style={[
                styles.button,
                isFollowing
                    ? { backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border }
                    : { backgroundColor: theme.colors.primary },
                style
            ]}
            onPress={toggleFollow}
            disabled={actionLoading}
        >
            {actionLoading ? (
                <ActivityIndicator size="small" color={isFollowing ? theme.colors.text : '#fff'} />
            ) : (
                <AppText.body style={[
                    styles.text,
                    { color: isFollowing ? theme.colors.text : '#fff' }
                ]}>
                    {isFollowing ? 'Following' : 'Follow'}
                </AppText.body>
            )}
        </TouchableOpacity>
    );
};

export default FollowButton;

const styles = StyleSheet.create({
    button: {
        paddingVertical: ms(10),
        paddingHorizontal: ms(20),
        borderRadius: ms(10),
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: ms(120),
    },
    text: {
        fontSize: ms(14),
        fontWeight: 'bold',
    },
});
