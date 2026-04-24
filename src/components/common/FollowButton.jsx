import React from 'react';
import { TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import AppText from './AppText';
import { COLORS } from '../../utils/theme';
import { ms } from '../../utils/responsive';
import { useFollow } from '../../hooks/useFollow';

const FollowButton = ({ targetUserId, style }) => {
    const { isFollowing, loading, actionLoading, toggleFollow } = useFollow(targetUserId);

    if (loading) return null;

    return (
        <TouchableOpacity
            style={[
                styles.button,
                isFollowing ? styles.followingButton : styles.followButton,
                style
            ]}
            onPress={toggleFollow}
            disabled={actionLoading}
        >
            {actionLoading ? (
                <ActivityIndicator size="small" color={isFollowing ? COLORS.text : COLORS.surface} />
            ) : (
                <AppText.body style={[
                    styles.text,
                    isFollowing ? styles.followingText : styles.followText
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
    followButton: {
        backgroundColor: COLORS.primary,
    },
    followingButton: {
        backgroundColor: COLORS.surface,
        borderWidth: 1,
        borderColor: COLORS.border,
    },
    text: {
        fontSize: ms(14),
        fontWeight: 'bold',
    },
    followText: {
        color: COLORS.surface,
    },
    followingText: {
        color: COLORS.text,
    },
});
