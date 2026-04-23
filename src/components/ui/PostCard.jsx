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

const PostCard = ({ post, onLike, onComment }) => {
    if (!post) return null;
    const [commentsVisible, setCommentsVisible] = useState(false);
    const currentUserId = auth().currentUser?.uid;
    const isLiked = Array.isArray(post.likes) ? post.likes.includes(currentUserId) : false;
    const formatLikes = (count) => {
        if (!count) return 0;
        if (count >= 1000) {
            return (count / 1000).toFixed(1) + "k";
        }
        return count;
    };

    return (
        <View style={styles.card}>
            {/* Header ... same ... */}
            <View style={styles.header}>
                <View style={styles.userInfo}>
                    <View>
                        <Image
                            source={post.userImage ? { uri: post.userImage } : require('../../assets/user.png')}
                            style={styles.avatar}
                        />
                    </View>

                    <View>
                        <View style={styles.nameRow}>
                            <Text style={styles.name}>{post.username}</Text>
                        </View>
                        <Text style={styles.time}>{post.createdAt && typeof post.createdAt.toDate === 'function' ? new Date(post.createdAt.toDate()).toLocaleDateString() : 'Just now'}</Text>
                    </View>
                </View>

                <Ionicons name="ellipsis-horizontal" size={20} color="#666" />
            </View>

            {/* Content (Caption) */}
            <View style={styles.captionContainer}>
                <Text style={[styles.caption, !post.imageUrl && styles.textOnlyCaption]}>
                    {post.caption}
                </Text>
            </View>

            {/* Optional Image */}
            {post.imageUrl && (
                <TouchableOpacity activeOpacity={0.9} onPress={() => onLike(post.id, isLiked)}>
                    <Image source={{ uri: post.imageUrl }} style={styles.postImage} />
                </TouchableOpacity>
            )}

            {/* Actions */}
            <View style={styles.actionsContainer}>
                <View style={styles.actionsRow}>
                    <View style={styles.leftActions}>
                        <TouchableOpacity onPress={() => onLike(post.id, isLiked)}>
                            <Ionicons
                                name={isLiked ? "heart" : "heart-outline"}
                                size={22}
                                color={isLiked ? "red" : "#000"}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => setCommentsVisible(true)}>
                            <Ionicons name="chatbubble-outline" size={22} color="#000" />
                        </TouchableOpacity>
                        <Ionicons name="paper-plane-outline" size={22} color="#000" />
                    </View>

                    <Ionicons name="bookmark-outline" size={22} color="#000" />
                </View>

                {/* Stats */}
                <View style={styles.statsRow}>
                    <Ionicons name="heart" size={14} color="red" />
                    <Text style={styles.boldText}>{formatLikes(post.likesCount)} likes</Text>

                    <Text style={styles.dot}>·</Text>

                    <TouchableOpacity onPress={() => setCommentsVisible(true)} style={styles.statsRow}>
                        <Ionicons name="chatbubble-outline" size={14} color="#777" />
                        <Text style={styles.lightText}>{post.commentsCount} comments</Text>
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
        backgroundColor: "#fff",
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
        backgroundColor: COLORS.success,
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
        color: "#777",
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
        color: '#000',
    },
})