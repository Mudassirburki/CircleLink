import { Image, StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { COLORS } from '../../utils/theme'
import { TouchableOpacity } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons';
import AppText from '../../components/common/AppText';
import { ms } from '../../utils/responsive'
import { useState } from 'react'
import { useNavigation } from '@react-navigation/native';

import { useUser } from '../../hooks/useUser'
import { launchImageLibrary } from 'react-native-image-picker'
import { useRoute } from '@react-navigation/native'

import { useTheme } from '../../context/ThemeContext'

const EditProfile = () => {
    const route = useRoute();
    const { theme, isDarkMode } = useTheme();
    const initialUser = route.params?.user || {};

    const [name, setName] = useState(initialUser.name || '');
    const [bio, setBio] = useState(initialUser.bio || '');
    const [username, setUsername] = useState(initialUser.username || '');
    const [avatar, setAvatar] = useState(initialUser.avatar || null);

    const navigation = useNavigation();
    const { updateProfile, loading } = useUser();

    const handlePickImage = async () => {
        const result = await launchImageLibrary({
            mediaType: 'photo',
            quality: 0.8,
        });

        if (!result.didCancel && result.assets && result.assets.length > 0) {
            setAvatar(result.assets[0].uri);
        }
    };

    const handleSave = async () => {
        try {
            await updateProfile({ name, bio, avatar });
            alert('Profile updated successfully!');
            navigation.goBack();
        } catch (error) {
            alert('Failed to update profile');
        }
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <AppText.body style={[styles.headerTitle, { color: theme.colors.text }]}>Edit Profile</AppText.body>
            </View>
            <View style={styles.content}>
                <TouchableOpacity style={styles.profileImageContainer} onPress={handlePickImage}>
                    <Image
                        source={avatar ? { uri: avatar } : require('../../assets/user.png')}
                        style={[styles.profileImage, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
                    />
                    <AppText.body style={[styles.changeImageText, { color: theme.colors.primary }]}>Change Image</AppText.body>
                    <View style={[styles.editButton, { backgroundColor: theme.colors.primary }]}>
                        <Ionicons name="camera" size={20} color="#fff" />
                    </View>
                </TouchableOpacity>

                <View style={[styles.form, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border, shadowColor: isDarkMode ? 'transparent' : '#000' }]}>
                    <AppText.body style={[styles.label, { color: theme.colors.text }]}>Name</AppText.body>
                    <TextInput
                        style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.border }]}
                        placeholder="Name"
                        placeholderTextColor={theme.colors.subtext}
                        value={name}
                        onChangeText={setName}
                    />
                    <AppText.body style={[styles.label, { color: theme.colors.text }]}>Username</AppText.body>
                    <TextInput
                        style={[styles.input, { color: theme.colors.text, borderColor: theme.colors.border }]}
                        placeholder="Username"
                        placeholderTextColor={theme.colors.subtext}
                        value={username}
                        onChangeText={setUsername}
                        editable={true}
                    />
                    <AppText.body style={[styles.label, { color: theme.colors.text }]}>Bio</AppText.body>
                    <TextInput
                        style={[styles.input, { height: ms(80), textAlignVertical: 'top', color: theme.colors.text, borderColor: theme.colors.border }]}
                        placeholder="Bio"
                        placeholderTextColor={theme.colors.subtext}
                        value={bio}
                        onChangeText={setBio}
                        multiline
                    />
                </View>

                <TouchableOpacity
                    style={[styles.saveButton, { backgroundColor: theme.colors.primary }, loading && { opacity: 0.5 }]}
                    onPress={handleSave}
                    disabled={loading}
                >
                    <AppText.body style={[styles.saveButtonText, { color: '#fff' }]}>
                        {loading ? 'Saving...' : 'Save'}
                    </AppText.body>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    )
}

export default EditProfile

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',

        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.text,
        alignSelf: 'center',
        flex: 1,
        textAlign: 'center',
    },
    profileImageContainer: {
        width: ms(100),
        height: ms(100),
        borderRadius: ms(50),
        // overflow: 'hidden',
        alignSelf: 'center',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: ms(20),
    },
    profileImage: {
        width: ms(100),
        height: ms(100),
        resizeMode: 'cover',
        borderRadius: ms(50),
        borderWidth: 1,
        borderColor: COLORS.secondary,
        backgroundColor: COLORS.background,

    },
    editButton: {
        position: 'absolute',
        bottom: ms(10),
        right: ms(0),
        backgroundColor: COLORS.secondary,
        width: ms(30),
        height: ms(30),
        borderRadius: ms(15),
        justifyContent: 'center',
        alignItems: 'center',
    },
    form: {
        width: '90%',
        height: '60%',
        backgroundColor: COLORS.background,
        borderRadius: 20,
        padding: ms(16),
        marginTop: ms(20),
        alignSelf: 'center',
        justifyContent: 'center',
        shadowColor: COLORS.secondary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
        borderWidth: 1,
        borderColor: COLORS.border,
        paddingVertical: ms(20),
        paddingHorizontal: ms(20),
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.text,
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        color: COLORS.text,
        marginBottom: 16,
    },
    saveButton: {
        backgroundColor: COLORS.secondary,
        padding: 12,
        borderRadius: ms(30),
        alignItems: 'center',
        marginTop: ms(40),
        width: '50%',
        alignSelf: 'center',
    },
    saveButtonText: {
        color: COLORS.background,
        fontSize: 16,
        fontWeight: 'bold',
    },
    changeImageText: {
        color: COLORS.secondary,
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: ms(10),
    },
})