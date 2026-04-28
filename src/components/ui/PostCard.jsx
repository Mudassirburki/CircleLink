import React, { useState } from "react";
import {
    View,
    Text,
    Image,
    StyleSheet,
    TouchableOpacity,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { s, vs } from "../../utils/responsive";
import { COLORS } from "../../utils/theme";

import CommentsModal from './CommentsModal';
import auth from "@react-native-firebase/auth";

import { useNavigation } from "@react-navigation/native";

import { TapGestureHandler, State, GestureHandlerRootView } from 'react-native-gesture-handler';
import AnimatedHeart from '../common/AnimatedHeart';
import LikeButton from '../common/LikeButton';
import { useTheme } from "../../context/ThemeContext";

const PostCard = ({ post, onLike, onComment, onSave }) => {

    if (!post) return null;
    const navigation = useNavigation();
    const { theme } = useTheme();
    const [commentsVisible, setCommentsVisible] = useState(false);
    const heartRef = React.useRef(null);

    const handleProfilePress = () => {
        navigation.navigate('Profile', { userId: post.userId });
    };

    const currentUserId = auth().currentUser?.uid;
    const isLiked = Array.isArray(post.likes) ? post.likes.includes(currentUserId) : false;
    const isSaved = Array.isArray(post.savedBy) ? post.savedBy.includes(currentUserId) : false;


    const handleDoubleTap = (event) => {
        if (event.nativeEvent.state === State.ACTIVE) {
            heartRef.current?.play();
            if (!isLiked) {
                onLike(post.id, false);
            }
        }
    };

    const formatLikes = (count) => {
        if (!count) return 0;
        if (count >= 1000) {
            return (count / 1000).toFixed(1) + "k";
        }
        return count;
    };

    return (
        <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.userInfo}>
                    <TouchableOpacity onPress={handleProfilePress}>
                        <Image
                            source={post.userImage ? { uri: post.userImage } : require('../../assets/user.png')}
                            style={styles.avatar}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={handleProfilePress}>
                        <View style={[styles.nameRow, { color: theme.colors.text }]}>
                            <Text style={[styles.name, { color: theme.colors.text }]}>{post.username}</Text>
                        </View>
                        <Text style={[styles.time, { color: theme.colors.subtext }]}>{post.createdAt && typeof post.createdAt.toDate === 'function' ? new Date(post.createdAt.toDate()).toLocaleDateString() : 'Just now'}</Text>
                    </TouchableOpacity>
                </View>

                <Ionicons name="ellipsis-horizontal" size={20} color={theme.colors.subtext} />
            </View>

            {/* Content (Caption) */}
            <View style={styles.captionContainer}>
                <Text style={[styles.caption, { color: theme.colors.text }, !post.imageUrl && styles.textOnlyCaption]}>
                    {post.caption}
                </Text>
            </View>

            {/* Optional Image with Double Tap */}
            {post.imageUrl && (
                <TapGestureHandler onHandlerStateChange={handleDoubleTap} numberOfTaps={2}>
                    <View>
                        <Image source={{ uri: post.imageUrl }} style={styles.postImage} />
                        <AnimatedHeart ref={heartRef} />
                    </View>
                </TapGestureHandler>
            )}

            {/* Actions */}
            <View style={styles.actionsContainer}>
                <View style={styles.actionsRow}>
                    <View style={styles.leftActions}>
                        <LikeButton
                            isLiked={isLiked}
                            onPress={() => onLike(post.id, isLiked)}
                            inactiveColor={theme.colors.text}
                        />

                        <TouchableOpacity onPress={() => setCommentsVisible(true)}>
                            <Ionicons name="chatbubble-outline" size={22} color={theme.colors.text} />
                        </TouchableOpacity>
                        <Ionicons name="paper-plane-outline" size={22} color={theme.colors.text} />
                    </View>

                    <TouchableOpacity onPress={() => onSave?.(post.id, isSaved)}>
                        <Ionicons 
                            name={isSaved ? "bookmark" : "bookmark-outline"} 
                            size={22} 
                            color={isSaved ? theme.colors.primary : theme.colors.text} 
                        />
                    </TouchableOpacity>

                </View>

                {/* Stats */}
                <View style={styles.statsRow}>
                    <Ionicons name="heart" size={14} color="red" />
                    <Text style={[styles.boldText, { color: theme.colors.text }]}>{formatLikes(post.likesCount)} likes</Text>

                    <Text style={[styles.dot, { color: theme.colors.subtext }]}>·</Text>

                    <TouchableOpacity onPress={() => setCommentsVisible(true)} style={styles.statsRow}>
                        <Ionicons name="chatbubble-outline" size={14} color={theme.colors.subtext} />
                        <Text style={[styles.lightText, { color: theme.colors.subtext }]}>{post.commentsCount} comments</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <CommentsModal
                visible={commentsVisible}
                onClose={() => setCommentsVisible(false)}
                postId={post.id}
            />
        </View>
    );
};

export default PostCard;

const styles = StyleSheet.create({
    card: {
        marginBottom: 12,
        borderRadius: 16,
        overflow: "hidden",
        elevation: 3,
        width: s(350),
        alignSelf: 'center',
        marginTop: vs(10),
    },
    active: {
        position: 'absolute',
        top: 20,
        right: -4,
        width: 10,
        height: 10,
        borderRadius: 25,
    },

    header: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 12,
    },

    userInfo: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
    },

    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
    },

    nameRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
    },

    name: {
        fontSize: 14,
        fontWeight: "600",

    },

    time: {
        fontSize: 12,
    },

    postImage: {
        width: "100%",
        height: 250,
        resizeMode: "cover",
    },

    actionsContainer: {
        paddingHorizontal: 12,
        paddingTop: 10,
        paddingBottom: 8,
    },

    actionsRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
    },

    leftActions: {
        flexDirection: "row",
        gap: 16,
    },

    statsRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },

    boldText: {
        fontWeight: "600",
    },

    lightText: {
        color: "#777",
    },

    dot: {
        marginHorizontal: 4,
        color: "#777",
    },
    captionContainer: {
        paddingHorizontal: 12,
        paddingBottom: 8,
    },
    caption: {
        fontSize: 15,
        color: COLORS.text,
        lineHeight: 20,
    },
    textOnlyCaption: {
        fontSize: 18,
        fontWeight: '500',
        lineHeight: 24,
    },
})