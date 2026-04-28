import { Alert, FlatList, Image, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { COLORS } from '../../utils/theme'
import { ms } from '../../utils/responsive'
import AppText from '../../components/common/AppText'
import { TouchableOpacity } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'

import { useNavigation } from '@react-navigation/native'
import SettingsCard from '../../components/ui/SettingsCard'
import { settingsData } from '../../dummyData/Data'
import { useAuth } from '../../context/AuthContext'
import { useUser } from '../../hooks/useUser'
import LogoutModal from '../../components/ui/LogoutModal'

import { useTheme } from '../../context/ThemeContext'

const Settings = () => {
    const navigation = useNavigation();
    const { logout } = useAuth();
    const { userData } = useUser();
    const { isDarkMode, toggleTheme, theme } = useTheme();
    const [isLogoutModalVisible, setLogoutModalVisible] = useState(false);

    const user = userData || {
        name: 'Guest User',
        username: '@guest',
        bio: 'No bio available',
        avatar: null
    }

    const handleLogout = () => {
        setLogoutModalVisible(true);
    }

    const handleNotificationToggle = async () => {
        try {
            const newValue = !user.pushNotificationsEnabled;
            await updateProfile({ pushNotificationsEnabled: newValue });
        } catch (error) {
            Alert.alert('Error', 'Failed to update notification settings');
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
                    </TouchableOpacity>
                    <AppText.body style={[styles.headerTitle, { color: theme.colors.text }]}>Settings</AppText.body>
                </View>
                <View style={[styles.profileCard, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
                    <View style={styles.profileView}>
                        <Image source={user.avatar ? { uri: user.avatar } : require('../../assets/user.png')} style={styles.profileImage} />
                        <View style={styles.profileInfo}>
                            <AppText.body style={[styles.profileName, { color: theme.colors.text }]}>{user.name}</AppText.body>
                            <AppText.body style={[styles.profileusername, { color: theme.colors.subtext }]}>@{user.username}</AppText.body>
                            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                                <AppText.body style={styles.viewProfile}>View Profile</AppText.body>
                            </TouchableOpacity>
                        </View>
                    </View>
                    <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                        <Ionicons name="chevron-forward-outline" size={24} color={theme.colors.text} />
                    </TouchableOpacity>
                </View>
                <FlatList
                    data={settingsData}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            onPress={() => {
                                if (item.title === 'Logout') {
                                    handleLogout();
                                } else if (item.title === 'Dark Mode') {
                                    toggleTheme();
                                } else if (item.title === 'Push Notifications') {
                                    handleNotificationToggle();
                                } else {
                                    if (item.type !== 'toggle' && item.route) {
                                        navigation.navigate(item.route)
                                    }
                                    if (item.onPress) {
                                        item.onPress()
                                    }
                                }
                            }}
                            activeOpacity={0.7}
                            disabled={item.type === 'toggle' && item.title !== 'Dark Mode' && item.title !== 'Push Notifications'}
                        >
                            <SettingsCard
                                icon={item.icon}
                                title={item.title}
                                subtitle={item.subtitle}
                                type={item.type}
                                color={item.color}
                                value={
                                    item.title === 'Dark Mode' ? isDarkMode : 
                                    item.title === 'Push Notifications' ? (user.pushNotificationsEnabled ?? true) : 
                                    false
                                }
                                onValueChange={
                                    item.title === 'Dark Mode' ? toggleTheme : 
                                    item.title === 'Push Notifications' ? handleNotificationToggle : 
                                    undefined
                                }
                            />
                        </TouchableOpacity>
                    )}
                    keyExtractor={(item) => item.id}
                />
            </View>
            <LogoutModal
                isVisible={isLogoutModalVisible}
                onClose={() => setLogoutModalVisible(false)}
                onLogout={logout}
            />
        </SafeAreaView>
    )
}

export default Settings

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        // justifyContent: 'space-between',
        paddingHorizontal: ms(16),
        paddingVertical: ms(12),
    },
    headerTitle: {
        fontSize: ms(20),
        fontWeight: 'bold',
        color: COLORS.text,
        marginLeft: ms(16),



    },
    profileCard: {
        width: ms(343),
        height: ms(100),
        borderRadius: ms(20),
        backgroundColor: COLORS.background,
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'center',
        paddingHorizontal: ms(16),
        paddingVertical: ms(12),
        borderWidth: 1,
        borderColor: COLORS.border,
        marginHorizontal: ms(16),
        marginTop: ms(16),
        marginBottom: ms(16),
        justifyContent: 'space-between',

    },
    profileView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    profileImage: {
        width: ms(60),
        height: ms(60),
        borderRadius: ms(30),
    },
    profileInfo: {
        marginLeft: ms(16),
    },
    profileName: {
        fontSize: ms(16),
        fontWeight: 'bold',
        color: COLORS.text,
    },
    profileusername: {
        fontSize: ms(12),
        color: COLORS.text,
    },
    viewProfile: {
        fontSize: ms(12),
        color: COLORS.primary,
    },
})