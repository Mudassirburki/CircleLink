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


const ProfileScreen = () => {
    const navigation = useNavigation();
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Ionicons name="arrow-back" size={24} color="black" />
                <Text style={styles.headerTitle}>Profile</Text>
                <Ionicons name="menu" size={24} color="black" onPress={() => navigation.navigate('Settings')} />
            </View>

            <View style={styles.profileTopSection}>
                <View style={styles.profileContainer}>
                    <Image source={require('../../assets/Mb.jpeg')} style={styles.profileImage} />
                    <StatsRow />
                </View>

                <View style={styles.profileInfo}>
                    <AppText.body style={styles.profileName}>Mudassir Burki</AppText.body>
                    <AppText.body style={styles.profileUsername}>@burki</AppText.body>
                    <AppText.body style={styles.profileBio}>App Developer | JavaScript | React Native</AppText.body>
                </View>

                <View style={styles.profileActions}>
                    <TouchableOpacity style={styles.profileActionsButton}>
                        <AppText.body style={styles.profileActionsButtonText}>Follow</AppText.body>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.profileActionsButton}>
                        <AppText.body style={styles.profileActionsButtonText}>Message</AppText.body>
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
        width: ms(80),
        height: ms(80),
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