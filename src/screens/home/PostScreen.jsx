import { Image, StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ms, s, vs } from '../../utils/responsive'
import { COLORS } from '../../utils/theme'
import AppText from '../../components/common/AppText'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { TouchableOpacity } from 'react-native'


import { useState } from 'react'
import { launchImageLibrary } from 'react-native-image-picker'
import { usePosts } from '../../hooks/usePosts'
import { useNavigation } from '@react-navigation/native'
import { useUser } from '../../hooks/useUser'

import { useTheme } from '../../context/ThemeContext'

const PostScreen = () => {
    const [caption, setCaption] = useState('');
    const [imageUri, setImageUri] = useState(null);
    const { createPost, uploading } = usePosts();
    const navigation = useNavigation();
    const { userData } = useUser();
    const { theme } = useTheme();

    const user = userData || {
        name: 'Guest User',
        username: '@guest',
        avatar: null
    };

    const handlePickImage = async () => {
        const result = await launchImageLibrary({
            mediaType: 'photo',
            quality: 0.8,
        });

        if (!result.didCancel && result.assets && result.assets.length > 0) {
            setImageUri(result.assets[0].uri);
        }
    };

    const handlePost = async () => {
        if (!caption.trim()) {
            alert('Please write something');
            return;
        }
        try {
            await createPost(imageUri, caption);
            alert('Post created successfully!');
            navigation.goBack();
        } catch (error) {
            alert('Failed to create post');
        }
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <AppText.body style={[styles.title, { color: theme.colors.text }]}>New Post</AppText.body>
                <TouchableOpacity
                    style={[styles.postButton, { backgroundColor: theme.colors.primary }, uploading && { opacity: 0.5 }]}
                    onPress={handlePost}
                    disabled={uploading}
                >
                    <AppText.body style={[styles.postButtonText, { color: '#fff' }]}>
                        {uploading ? 'Posting...' : 'Post'}
                    </AppText.body>
                </TouchableOpacity>
            </View>

            <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

            <View style={styles.postContainer}>
                <View style={styles.profileContainer}>
                    <Image
                        source={user.avatar ? { uri: user.avatar } : require('../../assets/user.png')}
                        style={[styles.profileImage, { backgroundColor: theme.colors.surface }]}
                    />
                    <View style={styles.profileInfo}>
                        <AppText.body style={[styles.profileName, { color: theme.colors.text }]}>{user.name}</AppText.body>
                        <AppText.body style={[styles.profileUsername, { color: theme.colors.subtext }]}>{user.username}</AppText.body>
                    </View>
                </View>

                <TextInput
                    style={[styles.postInput, { color: theme.colors.text }]}
                    placeholder="What's on your mind?"
                    placeholderTextColor={theme.colors.subtext}
                    multiline
                    value={caption}
                    onChangeText={setCaption}
                />

                {imageUri && (
                    <View style={styles.previewContainer}>
                        <Image source={{ uri: imageUri }} style={styles.previewImage} />
                        <TouchableOpacity style={styles.removeImage} onPress={() => setImageUri(null)}>
                            <Ionicons name="close-circle" size={24} color="red" />
                        </TouchableOpacity>
                    </View>
                )}

                <View style={styles.postOptions}>
                    <TouchableOpacity style={styles.postOption} onPress={handlePickImage}>
                        <Ionicons name="image" size={24} color={theme.colors.primary} />
                        <AppText.body style={[styles.postOptionText, { color: theme.colors.subtext }]}>Image</AppText.body>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    )
}

export default PostScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
        paddingTop: vs(10),
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: s(20),
        marginBottom: vs(10),
    },
    title: {
        fontSize: ms(20),
        fontWeight: 'bold',
        color: "#000",
    },
    postButton: {
        backgroundColor: "#AF1A5D",
        paddingHorizontal: s(20),
        paddingVertical: vs(10),
        borderRadius: 25,
    },
    postButtonText: {
        color: "#fff",
        fontWeight: 'bold',
    },
    divider: {
        width: '100%',
        height: 1.5,
        backgroundColor: COLORS.border,
    },
    postContainer: {
        paddingHorizontal: s(20),
        paddingVertical: vs(10),
    },
    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: vs(10),
    },
    profileImage: {
        width: ms(50),
        height: ms(50),
        borderRadius: ms(25),
    },
    profileInfo: {
        marginLeft: s(10),
    },
    profileName: {
        fontSize: ms(16),
        fontWeight: 'bold',
        color: "#000",
    },
    profileUsername: {
        fontSize: ms(14),
        color: COLORS.subtext,
    },
    postInput: {
        fontSize: ms(16),
        color: "#000",
    },
    postOptions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: s(20),
        marginBottom: vs(10),
    },
    postOption: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: s(6),
    },
    postOptionText: {
        fontSize: ms(14),
        color: COLORS.subtext,
    },
    previewContainer: {
        marginTop: vs(20),
        width: '100%',
        height: vs(300),
        borderRadius: 12,
        overflow: 'hidden',
        position: 'relative',
    },
    previewImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    removeImage: {
        position: 'absolute',
        top: 10,
        right: 10,
        backgroundColor: 'rgba(255,255,255,0.7)',
        borderRadius: 15,
    },
})