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

const ProfileScreen = ({ route }) => {
    const navigation = useNavigation();
    const userId = route.params?.userId || auth().currentUser?.uid;
    const isOwner = userId === auth().currentUser?.uid;

    const { userData, loading } = useUser(userId);

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <ActivityIndicator size="large" color={COLORS.primary} />
                <AppText.body style={{ marginTop: 10 }}>Loading profile...</AppText.body>
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
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Ionicons name="arrow-back" size={24} color="black" onPress={() => navigation.goBack()} />
                <Text style={styles.headerTitle}>{isOwner ? 'My Profile' : user.name}</Text>
                {isOwner ? (
                    <Ionicons name="menu" size={24} color="black" onPress={() => navigation.navigate('Settings')} />
                ) : (
                    <Ionicons name="ellipsis-vertical" size={24} color="black" onPress={() => { }} />
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
                    <AppText.body style={styles.profileName}>{user.name}</AppText.body>
                    <AppText.body style={styles.profileUsername}>@{user.username || 'user'}</AppText.body>
                    <AppText.body style={styles.profileBio}>{user.bio || 'No bio yet'}</AppText.body>
                </View>

                <View style={styles.profileActions}>
                    {isOwner ? (
                        <>
                            <TouchableOpacity
                                style={styles.profileActionsButton}
                                onPress={() => navigation.navigate('EditProfile', { user })}
                            >
                                <AppText.body style={styles.profileActionsButtonText}>Edit Profile</AppText.body>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.profileActionsButton}>
                                <AppText.body style={styles.profileActionsButtonText}>Share Profile</AppText.body>
                            </TouchableOpacity>
                        </>
                    ) : (
                        <>
                            <FollowButton targetUserId={userId} style={{ flex: 1, marginRight: 5 }} />
                            <TouchableOpacity 
                                style={[styles.profileActionsButton, { flex: 1, marginLeft: 5, backgroundColor: COLORS.surface, borderWidth: 1, borderColor: COLORS.border }]}
                                onPress={() => { }}
                            >
                                <AppText.body style={[styles.profileActionsButtonText, { color: COLORS.text }]}>Message</AppText.body>
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