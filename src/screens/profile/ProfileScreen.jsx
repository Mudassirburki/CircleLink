import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { COLORS } from '../../utils/theme'
import { ms, s } from '../../utils/responsive'

import StatsRow from '../../components/ui/ProfileInfo'
import AppText from '../../components/common/AppText'
import { TouchableOpacity } from 'react-native'
import ProfileTabs from '../../navigation/ProfileTabs'
import { useNavigation } from '@react-navigation/native'


import { useUser } from '../../hooks/useUser'

const ProfileScreen = () => {
    const navigation = useNavigation();
    const { userData, loading } = useUser();

    if (loading) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <AppText.body>Loading profile...</AppText.body>
            </View>
        );
    }

    const user = userData || {
        name: 'Guest User',
        username: '@guest',
        bio: 'No bio available',
        avatar: null
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Ionicons name="arrow-back" size={24} color="black" onPress={() => navigation.goBack()} />
                <Text style={styles.headerTitle}>Profile</Text>
                <Ionicons name="menu" size={24} color="black" onPress={() => navigation.navigate('Settings')} />
            </View>

            <View style={styles.profileTopSection}>
                <View style={styles.profileContainer}>
                    <Image
                        source={user.avatar ? { uri: user.avatar } : require('../../assets/user.png')}
                        style={styles.profileImage}
                    />
                    <StatsRow />
                </View>

                <View style={styles.profileInfo}>
                    <AppText.body style={styles.profileName}>{user.name}</AppText.body>
                    <AppText.body style={styles.profileUsername}>@{user.username || 'user'}</AppText.body>
                    <AppText.body style={styles.profileBio}>{user.bio}</AppText.body>
                </View>

                <View style={styles.profileActions}>
                    <TouchableOpacity
                        style={styles.profileActionsButton}
                        onPress={() => navigation.navigate('EditProfile', { user })}
                    >
                        <AppText.body style={styles.profileActionsButtonText}>Edit Profile</AppText.body>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.profileActionsButton}>
                        <AppText.body style={styles.profileActionsButtonText}>Share Profile</AppText.body>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={{ flex: 1 }}>
                <ProfileTabs />
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