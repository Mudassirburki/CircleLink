import { Image, StyleSheet, Text, TextInput, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { ms, s, vs } from '../../utils/responsive'
import { COLORS } from '../../utils/theme'
import AppText from '../../components/common/AppText'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { TouchableOpacity } from 'react-native'


const PostScreen = () => {
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Ionicons name="arrow-back" size={24} color={"#000"} />
                <AppText.body style={styles.title}>New Post</AppText.body>
                <TouchableOpacity style={styles.postButton}>
                    <AppText.body style={styles.postButtonText}>Post</AppText.body>

                </TouchableOpacity>
            </View>

            <View style={styles.divider}>

            </View>

            <View style={styles.postContainer}>
                <View style={styles.profileContainer}>
                    <Image source={require('../../assets/Mb.jpeg')} style={styles.profileImage} />
                    <View style={styles.profileInfo}>
                        <AppText.body style={styles.profileName}>Mudassir burki</AppText.body>
                        <AppText.body style={styles.profileUsername}>@burki</AppText.body>
                    </View>
                </View>
                <TextInput
                    style={styles.postInput}
                    placeholder="What's on your mind?"
                    multiline
                />
                <View style={styles.postOptions}>
                    <TouchableOpacity style={styles.postOption}>
                        <Ionicons name="image" size={24} color={COLORS.primary} />
                        <AppText.body style={styles.postOptionText}>Image</AppText.body>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.postOption}>
                        <Ionicons name="videocam-outline" size={24} color={COLORS.primary} />
                        <AppText.body style={styles.postOptionText}>Video</AppText.body>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.postOption}>
                        <Ionicons name="location" size={24} color={COLORS.primary} />
                        <AppText.body style={styles.postOptionText}>Location</AppText.body>
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
})