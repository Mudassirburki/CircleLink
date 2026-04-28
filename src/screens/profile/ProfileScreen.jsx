import { Image, StyleSheet, Text, View, ActivityIndicator, TouchableOpacity } from 'react-native'
import React from 'react'
import auth from '@react-native-firebase/auth';
import { SafeAreaView } from 'react-native-safe-area-context'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { COLORS } from '../../utils/theme'
import { ms, s } from '../../utils/responsive'

import StatsRow from '../../components/ui/ProfileInfo'
import AppText from '../../components/common/AppText'
import ProfileTabs from '../../navigation/ProfileTabs'
import { useNavigation } from '@react-navigation/native'


import { useUser } from '../../hooks/useUser'
import FollowButton from '../../components/common/FollowButton'

import { useTheme } from '../../context/ThemeContext'

const ProfileScreen = ({ route }) => {
    const navigation = useNavigation();
    const { theme } = useTheme();
    const userId = route.params?.userId || auth().currentUser?.uid;
    const isOwner = userId === auth().currentUser?.uid;

    const { userData, loading } = useUser(userId);

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }]}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
                <AppText.body style={{ marginTop: 10, color: theme.colors.text }}>Loading profile...</AppText.body>
            </View>
        );
    }

    const user = userData || {
        name: 'Guest User',
        username: '@guest',
        bio: 'No bio available',
        avatar: null,
        postsCount: 0,
        followersCount: 0,
        followingCount: 0
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={styles.header}>
                <Ionicons name="arrow-back" size={24} color={theme.colors.text} onPress={() => navigation.goBack()} />
                <Text style={[styles.headerTitle, { color: theme.colors.text }]}>{isOwner ? 'My Profile' : user.name}</Text>
                {isOwner ? (
                    <Ionicons name="menu" size={24} color={theme.colors.text} onPress={() => navigation.navigate('Settings')} />
                ) : (
                    <Ionicons name="ellipsis-vertical" size={24} color={theme.colors.text} onPress={() => { }} />
                )}
            </View>

            <View style={styles.profileTopSection}>
                <View style={styles.profileContainer}>
                    <Image
                        source={user.avatar ? { uri: user.avatar } : require('../../assets/user.png')}
                        style={styles.profileImage}
                    />
                    <StatsRow
                        posts={user.postsCount || 0}
                        followers={user.followersCount || 0}
                        following={user.followingCount || 0}
                    />
                </View>

                <View style={styles.profileInfo}>
                    <AppText.body style={[styles.profileName, { color: theme.colors.text }]}>{user.name}</AppText.body>
                    <AppText.body style={[styles.profileUsername, { color: theme.colors.subtext }]}>@{user.username || 'user'}</AppText.body>
                    <AppText.body style={[styles.profileBio, { color: theme.colors.text }]}>{user.bio || 'No bio yet'}</AppText.body>
                </View>

                <View style={styles.profileActions}>
                    {isOwner ? (
                        <>
                            <TouchableOpacity
                                style={[styles.profileActionsButton, { backgroundColor: theme.colors.primary }]}
                                onPress={() => navigation.navigate('EditProfile', { user })}
                            >
                                <AppText.body style={[styles.profileActionsButtonText, { color: '#fff' }]}>Edit Profile</AppText.body>
                            </TouchableOpacity>
                            <TouchableOpacity style={[styles.profileActionsButton, { backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border }]}>
                                <AppText.body style={[styles.profileActionsButtonText, { color: theme.colors.text }]}>Share Profile</AppText.body>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            <FollowButton targetUserId={userId} style={{ flex: 1, marginRight: 5 }} />
                            <TouchableOpacity
                                style={[styles.profileActionsButton, { flex: 1, marginLeft: 5, backgroundColor: theme.colors.surface, borderWidth: 1, borderColor: theme.colors.border }]}
                                onPress={() => { }}
                            >
                                <AppText.body style={[styles.profileActionsButtonText, { color: theme.colors.text }]}>Message</AppText.body>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            </View>

            <View style={{ flex: 1 }}>
                <ProfileTabs userId={userId} />
            </View>
        </SafeAreaView>
    )
}

export default ProfileScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: ms(20),
        paddingVertical: ms(10),
    },
    headerTitle: {
        fontSize: ms(20),
        fontWeight: 'bold',
        color: COLORS.text,
    },
    profileTopSection: {
        paddingHorizontal: ms(20),
        paddingVertical: ms(10),
    },
    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    profileImage: {
        width: ms(70),
        height: ms(70),
        borderRadius: ms(40),
    },
    profileInfo: {
        marginTop: ms(10),
    },
    profileName: {
        fontSize: ms(16),
        fontWeight: 'bold',
        color: COLORS.text,
    },
    profileUsername: {
        fontSize: ms(14),
        color: COLORS.subtext,
    },
    profileBio: {
        fontSize: ms(14),
        color: COLORS.text,
    },
    profileActions: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        marginTop: ms(15),
    },
    profileActionsButton: {
        backgroundColor: COLORS.primary,
        borderRadius: ms(10),
        paddingVertical: ms(10),
        paddingHorizontal: ms(20),
    },
    profileActionsButtonText: {
        color: COLORS.surface,
        fontSize: ms(14),
        fontWeight: 'bold',
    },
})